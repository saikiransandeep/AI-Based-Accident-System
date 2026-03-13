import os
import cv2
import numpy as np
import sqlite3
import random
from datetime import datetime
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from yolo_model import YoloAccidentDetector

# ---------------------------------------------------
# Flask Setup
# ---------------------------------------------------

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "app.db")

ACCIDENT_THRESHOLD = 60

# ---------------------------------------------------
# Load YOLO Model
# ---------------------------------------------------

detector = YoloAccidentDetector()

font = cv2.FONT_HERSHEY_SIMPLEX

# ---------------------------------------------------
# Database
# ---------------------------------------------------

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def now():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def init_db():

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password_hash TEXT,
            created_at TEXT
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS incidents(
            id TEXT PRIMARY KEY,
            date TEXT,
            camera TEXT,
            location TEXT,
            type TEXT,
            severity TEXT,
            probability REAL,
            status TEXT
        )
    """)

    conn.commit()
    conn.close()


init_db()

# ---------------------------------------------------
# YOLO Prediction
# ---------------------------------------------------

def predict_frame(frame):

    prediction, probability = detector.detect(frame)

    print("Prediction:", prediction, "Confidence:", probability)

    return prediction, probability


# ---------------------------------------------------
# API: Register
# ---------------------------------------------------

@app.route("/api/register",methods=["POST"])
def register():

    data = request.json

    name = data["name"]
    email = data["email"]
    password = generate_password_hash(data["password"])

    conn = get_db()
    cur = conn.cursor()

    try:

        cur.execute("""
        INSERT INTO users(name,email,password_hash,created_at)
        VALUES(?,?,?,?)
        """,(name,email,password,now()))

        conn.commit()

        return jsonify({"status":"registered"})

    except:

        return jsonify({"status":"error","message":"email exists"})


# ---------------------------------------------------
# API: Login
# ---------------------------------------------------

@app.route("/api/login",methods=["POST"])
def login():

    data = request.json

    email = data["email"]
    password = data["password"]

    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM users WHERE email=?",(email,))
    user = cur.fetchone()

    if user and check_password_hash(user["password_hash"],password):

        return jsonify({
            "status":"success",
            "user":{
                "id":user["id"],
                "name":user["name"],
                "email":user["email"]
            }
        })

    return jsonify({"status":"error","message":"invalid credentials"}),401


# ---------------------------------------------------
# API: Image Detection
# ---------------------------------------------------

@app.route("/api/detect-image",methods=["POST"])
def detect_image():

    file = request.files.get("image")

    if not file:
        return jsonify({"error":"no image"}),400

    file_bytes = np.frombuffer(file.read(),np.uint8)
    img = cv2.imdecode(file_bytes,cv2.IMREAD_COLOR)

    pred,prob = predict_frame(img)

    if pred == "Accident" and prob >= ACCIDENT_THRESHOLD:

        log_accident_to_db("Upload Image","Vehicle Collision",round(prob,2))

        return jsonify({
            "prediction":"Accident",
            "probability":round(prob,2)
        })

    return jsonify({
        "prediction":"Normal",
        "probability":round(prob,2)
    })


# ---------------------------------------------------
# Video Detection
# ---------------------------------------------------

@app.route("/api/detect-video", methods=["POST"])
def detect_video():

    file = request.files.get("video")

    if not file:
        return jsonify({"error": "no video"}), 400

    temp_path = "temp_video.mp4"
    file.save(temp_path)

    cap = cv2.VideoCapture(temp_path)

    max_prob = 0
    consecutive_accidents = 0
    is_accident = False

    while True:

        ret,frame = cap.read()

        if not ret:
            break

        pred,prob = predict_frame(frame)

        if pred == "Accident" and prob >= ACCIDENT_THRESHOLD:

            consecutive_accidents += 1
            max_prob = max(max_prob,prob)

            if consecutive_accidents >= 5:
                is_accident = True

        else:
            consecutive_accidents = 0

    cap.release()
    os.remove(temp_path)

    if is_accident:

        log_accident_to_db("Upload Video","Vehicle Collision",round(max_prob,2))

        return jsonify({
            "prediction":"Accident",
            "probability":round(max_prob,2)
        })

    return jsonify({
        "prediction":"Normal",
        "probability":0
    })


# ---------------------------------------------------
# Log Accident
# ---------------------------------------------------

def log_accident_to_db(camera_name,type_str,confidence):

    conn = get_db()
    cur = conn.cursor()

    incident_id = f"INC-{random.randint(1000,9999)}"

    cur.execute("""
        INSERT INTO incidents(id,date,camera,location,type,severity,probability,status)
        VALUES(?,?,?,?,?,?,?,?)
    """,(incident_id,now(),camera_name,"Upload",type_str,"critical",confidence,"confirmed"))

    conn.commit()
    conn.close()


# ---------------------------------------------------
# Live Camera Detection
# ---------------------------------------------------

def video_stream(video_source):

    cap = cv2.VideoCapture(video_source)

    while True:

        ret,frame = cap.read()

        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES,0)
            continue

        pred,prob = predict_frame(frame)

        if pred == "Accident":

            label = f"Accident {prob:.2f}%"
            color = (0,0,255)

        else:

            label = f"Normal {prob:.2f}%"
            color = (0,255,0)

        cv2.rectangle(frame,(0,0),(400,50),(0,0,0),-1)

        cv2.putText(frame,label,(10,35),font,1,color,2)

        _,jpeg = cv2.imencode(".jpg",frame)

        yield(
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n'+jpeg.tobytes()+b'\r\n'
        )


@app.route("/api/live-camera")
def live_camera():

    return Response(
        video_stream("demo3.mp4"),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )


# ---------------------------------------------------
# Run Server
# ---------------------------------------------------

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )