from ultralytics import YOLO
import numpy as np
import math


class YoloAccidentDetector:

    def __init__(self):

        # Load YOLO model
        self.model = YOLO("yolov8n.pt")

        # vehicle classes
        self.vehicle_classes = ["car", "truck", "bus", "motorcycle"]


    # ------------------------------------------------
    # Detect accident
    # ------------------------------------------------
    def detect(self, frame):

        results = self.model(frame)[0]

        boxes = []
        centers = []
        names = self.model.names

        for box in results.boxes:

            cls_id = int(box.cls[0])
            label = names[cls_id]

            if label in self.vehicle_classes:

                x1, y1, x2, y2 = box.xyxy[0]

                x1 = float(x1)
                y1 = float(y1)
                x2 = float(x2)
                y2 = float(y2)

                boxes.append([x1, y1, x2, y2])

                # vehicle center
                cx = (x1 + x2) / 2
                cy = (y1 + y2) / 2

                centers.append((cx, cy))


        # ------------------------------------
        # collision detection
        # ------------------------------------

        for i in range(len(boxes)):
            for j in range(i + 1, len(boxes)):

                overlap = self.iou(boxes[i], boxes[j])

                distance = self.center_distance(
                    centers[i],
                    centers[j]
                )

                # accident condition
                if overlap > 0.15 and distance < 120:
                    return "Accident", 90


        return "Normal", 10


    # ------------------------------------------------
    # IOU
    # ------------------------------------------------
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


    # ------------------------------------------------
    # Distance between vehicles
    # ------------------------------------------------
    def center_distance(self, c1, c2):

        return math.sqrt(
            (c1[0] - c2[0])**2 +
            (c1[1] - c2[1])**2
        )