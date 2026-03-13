from ultralytics import YOLO
import cv2

class YOLOAccidentDetector:

    def __init__(self):
        self.model = YOLO("yolov8n.pt")

    def detect(self, frame):

        results = self.model(frame)

        accident_detected = False
        confidence = 0

        for result in results:
            for box in result.boxes:

                conf = float(box.conf)

                if conf > 0.6:
                    accident_detected = True
                    confidence = conf

        if accident_detected:
            return "Accident", confidence
        else:
            return "No Accident", confidence