import os
import math
import cv2
import torch
import torch.nn as nn
from torchvision import transforms, models
from ultralytics import YOLO
from deep_sort_realtime.deepsort_tracker import DeepSort

class YoloAccidentDetector:
    def __init__(self):
        # Load YOLO model
        self.model = YOLO("yolov8n.pt")
        self.vehicle_classes = ["car", "truck", "bus", "motorcycle"]
        
        # Initialize DeepSORT Tracker
        self.tracker = DeepSort(max_age=30, n_init=3, nms_max_overlap=1.0, max_cosine_distance=0.2)
        
        # Tracking history: {id: [center_x, center_y, time_step]}
        self.history = {}
        self.max_history_len = 30
        self.time_step = 0
        
        # Load EfficientNet Model (if trained weights exist)
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.efficientnet = None
        
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, 'efficientnet_accident.pth')
        
        if os.path.exists(model_path):
            try:
                # Based on train_cnn.py: efficientnet_b0 with 2 output classes
                self.efficientnet = models.efficientnet_b0(pretrained=False)
                num_ftrs = self.efficientnet.classifier[1].in_features
                self.efficientnet.classifier[1] = nn.Linear(num_ftrs, 2)
                self.efficientnet.load_state_dict(torch.load(model_path, map_location=self.device))
                self.efficientnet = self.efficientnet.to(self.device)
                self.efficientnet.eval()
                print("Loaded EfficientNet Accident Classifier.")
            except Exception as e:
                print(f"Failed to load EfficientNet: {e}")
                self.efficientnet = None
        else:
            print("efficientnet_accident.pth not found. Using fallback heuristics.")
            
        self.transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])

    def detect(self, frame, persist=False):
        self.time_step += 1
        
        # We run normal YOLO detection model
        results = self.model(frame, verbose=False)[0]

        boxes = []
        centers = []
        ids = []
        names = self.model.names
        
        max_vehicle_conf = 0.0
        bbs = []
        
        for box in results.boxes:
            cls_id = int(box.cls[0])
            label = names[cls_id]

            if label in self.vehicle_classes:
                x1, y1, x2, y2 = map(float, box.xyxy[0])
                conf = float(box.conf[0])
                max_vehicle_conf = max(max_vehicle_conf, conf * 100)
                
                # Format for DeepSORT: ([left, top, w, h], confidence, class_name)
                w, h = x2 - x1, y2 - y1
                bbs.append(([x1, y1, w, h], conf, label))
                
                boxes.append([x1, y1, x2, y2])
                centers.append(((x1 + x2) / 2, (y1 + y2) / 2))

        # DeepSORT update
        tracks = self.tracker.update_tracks(bbs, frame=frame)
        
        max_accident_prob = 0.0
        use_cnn = self.efficientnet is not None
        
        if not persist:
            # Single image analysis (no tracking required)
            for box in boxes:
                x1, y1, x2, y2 = map(int, box)
                h_frame, w_frame = frame.shape[:2]
                x1, y1 = max(0, x1), max(0, y1)
                x2, y2 = min(w_frame, x2), min(h_frame, y2)
                
                if use_cnn and (x2 > x1) and (y2 > y1):
                    # Add 20% spatial context padding around the vehicle
                    pad_w, pad_h = int((x2 - x1) * 0.20), int((y2 - y1) * 0.20)
                    px1 = max(0, x1 - pad_w)
                    py1 = max(0, y1 - pad_h)
                    px2 = min(w_frame, x2 + pad_w)
                    py2 = min(h_frame, y2 + pad_h)
                    
                    crop = frame[py1:py2, px1:px2]
                    try:
                        input_tensor = self.transform(crop).unsqueeze(0).to(self.device)
                        with torch.no_grad():
                            outputs = self.efficientnet(input_tensor)
                            probs = torch.nn.functional.softmax(outputs, dim=1)
                            accident_prob = float(probs[0][0]) * 100
                            # Require >70% confidence to consider it a definite accident from CNN
                            if accident_prob > 70.0:
                                max_accident_prob = max(max_accident_prob, accident_prob)
                    except:
                        pass
                else:
                    w, h = x2 - x1, y2 - y1
                    aspect_ratio = w / h if h != 0 else 0
                    if 0.5 < aspect_ratio < 1.7: 
                        max_accident_prob = max(max_accident_prob, 88.0)
                    if aspect_ratio < 0.4 or aspect_ratio > 4.5:
                        max_accident_prob = max(max_accident_prob, min(92.0, max_vehicle_conf + 40))
        else:
            # 1. Evaluate CNN and Track History for videos
            for track in tracks:
                if not track.is_confirmed() or track.time_since_update > 1:
                    continue
                    
                obj_id = track.track_id
                ltrb = track.to_ltrb()
                x1, y1, x2, y2 = map(int, ltrb)
                
                # Bound boxes to frame size
                h_frame, w_frame = frame.shape[:2]
                x1, y1 = max(0, x1), max(0, y1)
                x2, y2 = min(w_frame, x2), min(h_frame, y2)
                
                cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
                
                # --- CNN Classification on Cropped Vehicle ---
                if use_cnn and (x2 > x1) and (y2 > y1):
                    # Add 20% spatial context padding around the vehicle for better CNN feature extraction
                    pad_w, pad_h = int((x2 - x1) * 0.20), int((y2 - y1) * 0.20)
                    px1 = max(0, x1 - pad_w)
                    py1 = max(0, y1 - pad_h)
                    px2 = min(w_frame, x2 + pad_w)
                    py2 = min(h_frame, y2 + pad_h)
                    
                    crop = frame[py1:py2, px1:px2]
                    try:
                        input_tensor = self.transform(crop).unsqueeze(0).to(self.device)
                        with torch.no_grad():
                            outputs = self.efficientnet(input_tensor)
                            probs = torch.nn.functional.softmax(outputs, dim=1)
                            # Assume index 0 is accident, index 1 is non_accident
                            accident_prob = float(probs[0][0]) * 100
                            
                            if accident_prob > 70.0:
                                max_accident_prob = max(max_accident_prob, accident_prob)
                    except Exception as e:
                        pass # Ignore crop issues at image edge
                        
                # --- Motion Intelligence History ---
                if obj_id not in self.history:
                    self.history[obj_id] = []
                
                self.history[obj_id].append((cx, cy, self.time_step))
                if len(self.history[obj_id]) > self.max_history_len:
                    self.history[obj_id].pop(0)

                if len(self.history[obj_id]) >= 5:
                    p1 = self.history[obj_id][-5]
                    p2 = self.history[obj_id][-1]
                    dist = self.center_distance(p1, p2)
                    if len(self.history[obj_id]) >= 10:
                        p0 = self.history[obj_id][-10]
                        prev_dist = self.center_distance(p0, p1)
                        if prev_dist > 40 and dist < 8:
                            fall_prob = min(98.0, 85 + (prev_dist / 2))
                            max_accident_prob = max(max_accident_prob, fall_prob)
                            
                # --- Spatial Context (Heuristics) ---
                w, h = x2 - x1, y2 - y1
                aspect_ratio = w / h if h != 0 else 0
                if (0.5 < aspect_ratio < 1.7) and not use_cnn: 
                     max_accident_prob = max(max_accident_prob, 88.0)
                if (aspect_ratio < 0.4 or aspect_ratio > 4.5) and not use_cnn:
                     max_accident_prob = max(max_accident_prob, min(92.0, max_vehicle_conf + 40))

        # 2. Collision Logic (Multi-vehicle) over raw YOLO boxes
        # Only use overlap heuristics if CNN probability is low
        if len(boxes) > 1 and max_accident_prob < 60.0 and not use_cnn:
            for i in range(len(boxes)):
                for j in range(i + 1, len(boxes)):
                    overlap = self.iou(boxes[i], boxes[j])
                    dist = self.center_distance(centers[i], centers[j])

                    if overlap > 0.4:
                        accident_conf = min(99.0, 75 + (overlap * 100))
                        max_accident_prob = max(max_accident_prob, accident_conf)
                    elif overlap > 0.2 and dist < 80:
                        accident_conf = min(95.0, 60 + (overlap * 150))
                        max_accident_prob = max(max_accident_prob, accident_conf)

        if max_accident_prob >= 70.0:
            return "Accident", max_accident_prob

        return "Normal", max_vehicle_conf * 0.1

    def iou(self, boxA, boxB):
        xA = max(boxA[0], boxB[0])
        yA = max(boxA[1], boxB[1])
        xB = min(boxA[2], boxB[2])
        yB = min(boxA[3], boxB[3])

        interArea = max(0, xB - xA) * max(0, yB - yA)
        if interArea == 0:
            return 0

        boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
        boxBArea = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])
        return interArea / float(boxAArea + boxBArea - interArea)

    def center_distance(self, c1, c2):
        return math.sqrt((c1[0] - c2[0])**2 + (c1[1] - c2[1])**2)