import cv2
from yolo_model import YoloAccidentDetector
import os

def test():
    detector = YoloAccidentDetector()
    base = os.path.dirname(os.path.abspath(__file__))
    img_path = os.path.join(base, "dataset", "val", "non_accident", "test1_10.jpg")
    
    if not os.path.exists(img_path):
        print(f"Image not found at {img_path}")
        return
        
    frame = cv2.imread(img_path)
    pred, prob = detector.detect(frame, persist=False)
    print(f"Image Prediction: {pred}, Probability: {prob:.2f}%")

if __name__ == '__main__':
    test()
