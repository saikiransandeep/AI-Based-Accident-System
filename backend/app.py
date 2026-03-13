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

    cur.execute("""
        CREATE TABLE IF NOT EXISTS alerts(
            id TEXT PRIMARY KEY,
            title TEXT,
            description TEXT,
            severity TEXT,
            status TEXT,
            camera TEXT,
            location TEXT,
            timestamp TEXT,
            confidence REAL
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS emergency_contacts(
            id TEXT PRIMARY KEY,
            name TEXT,
            type TEXT,
            phone TEXT,
            address TEXT,
            distance TEXT,
            available INTEGER,
            responseTime TEXT
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS map_markers(
            id TEXT PRIMARY KEY,
            lat REAL,
            lng REAL,
            type TEXT,
            title TEXT,
            description TEXT,
            severity TEXT,
            timestamp TEXT
        )
    """)

    conn.commit()
    conn.close()


init_db()

# ---------------------------------------------------
# YOLO Prediction
# ---------------------------------------------------

def predict_frame(frame, persist=False):

    prediction, probability = detector.detect(frame, persist=persist)

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

        pred,prob = predict_frame(frame, persist=True)

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
# API: Alerts
# ---------------------------------------------------

@app.route("/api/alerts", methods=["GET"])
def get_alerts():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM alerts ORDER BY timestamp DESC")
    rows = cur.fetchall()
    alerts = []
    for row in rows:
        alerts.append({
            "id": row["id"],
            "title": row["title"],
            "description": row["description"],
            "severity": row["severity"],
            "status": row["status"],
            "camera": row["camera"],
            "location": row["location"],
            "timestamp": row["timestamp"],
            "confidence": row["confidence"]
        })
    conn.close()
    return jsonify({"alerts": alerts})


@app.route("/api/alerts/<id>/status", methods=["PUT"])
def update_alert_status(id):
    data = request.json
    status = data.get("status")
    
    conn = get_db()
    cur = conn.cursor()
    cur.execute("UPDATE alerts SET status = ? WHERE id = ?", (status, id))
    conn.commit()
    conn.close()
    return jsonify({"status": "updated"})


# ---------------------------------------------------
# API: History
# ---------------------------------------------------

@app.route("/api/history", methods=["GET"])
@app.route("/api/history/<user_id>", methods=["GET"])
def get_history(user_id=None):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM incidents ORDER BY date DESC")
    rows = cur.fetchall()
    incidents = []
    for row in rows:
        incidents.append({
            "id": row["id"],
            "date": row["date"],
            "camera": row["camera"],
            "location": row["location"],
            "type": row["type"],
            "severity": row["severity"],
            "probability": row["probability"],
            "status": row["status"]
        })
    conn.close()
    return jsonify({"incidents": incidents})


# ---------------------------------------------------
# API: Emergency Contacts
# ---------------------------------------------------

@app.route("/api/emergency-contacts", methods=["GET", "POST"])
def manage_contacts():
    conn = get_db()
    cur = conn.cursor()

    if request.method == "POST":
        data = request.json
        cur.execute("""
            INSERT INTO emergency_contacts(id, name, type, phone, address, distance, available, responseTime)
            VALUES(?,?,?,?,?,?,?,?)
        """, (data["id"], data["name"], data["type"], data["phone"], data["address"], data["distance"], 1 if data["available"] else 0, data["responseTime"]))
        conn.commit()
        conn.close()
        return jsonify({"status": "created"})

    cur.execute("SELECT * FROM emergency_contacts")
    rows = cur.fetchall()
    contacts = []
    for row in rows:
        contacts.append({
            "id": row["id"],
            "name": row["name"],
            "type": row["type"],
            "phone": row["phone"],
            "address": row["address"],
            "distance": row["distance"],
            "available": bool(row["available"]),
            "responseTime": row["responseTime"]
        })
    conn.close()
    return jsonify({"contacts": contacts})


@app.route("/api/emergency-contacts/<id>", methods=["PUT", "DELETE"])
def update_delete_contact(id):
    conn = get_db()
    cur = conn.cursor()

    if request.method == "DELETE":
        cur.execute("DELETE FROM emergency_contacts WHERE id = ?", (id,))
        conn.commit()
        conn.close()
        return jsonify({"status": "deleted"})

    data = request.json
    cur.execute("""
        UPDATE emergency_contacts SET 
        name=?, type=?, phone=?, address=?, distance=?, available=?, responseTime=?
        WHERE id=?
    """, (data["name"], data["type"], data["phone"], data["address"], data["distance"], 1 if data["available"] else 0, data["responseTime"], id))
    conn.commit()
    conn.close()
    return jsonify({"status": "updated"})


# ---------------------------------------------------
# API: Analytics & Map
# ---------------------------------------------------

@app.route("/api/analytics", methods=["GET"])
def get_analytics():
    # Simple analytics based on incidents
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) as total FROM incidents")
    total = cur.fetchone()["total"]
    cur.execute("SELECT COUNT(*) as total FROM incidents WHERE date >= date('now', '-7 days')")
    last_week = cur.fetchone()["total"]
    conn.close()
    
    return jsonify({
        "total_incidents": total,
        "last_week_incidents": last_week,
        "trends": [
            {"name": "Mon", "value": random.randint(1, 5)},
            {"name": "Tue", "value": random.randint(1, 5)},
            {"name": "Wed", "value": random.randint(1, 5)},
            {"name": "Thu", "value": random.randint(1, 5)},
            {"name": "Fri", "value": random.randint(1, 5)},
            {"name": "Sat", "value": random.randint(1, 3)},
            {"name": "Sun", "value": random.randint(1, 2)}
        ]
    })


@app.route("/api/map-markers", methods=["GET"])
def get_markers():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM map_markers")
    rows = cur.fetchall()
    markers = []
    for row in rows:
        markers.append({
            "id": row["id"],
            "lat": row["lat"],
            "lng": row["lng"],
            "type": row["type"],
            "title": row["title"],
            "description": row["description"],
            "severity": row["severity"],
            "timestamp": row["timestamp"]
        })
    conn.close()
    return jsonify({"markers": markers})


@app.route("/api/system-health", methods=["GET"])
def system_health():
    return jsonify({
        "status": "online",
        "cpu": random.randint(20, 45),
        "memory": random.randint(30, 60),
        "gpu": random.randint(15, 30),
        "storage": 42
    })


# ---------------------------------------------------
# Log Accident
# ---------------------------------------------------

def log_accident_to_db(camera_name,type_str,confidence):

    conn = get_db()
    cur = conn.cursor()

    incident_id = f"INC-{random.randint(1000,9999)}"
    alert_id = f"ALT-{random.randint(1000,9999)}"
    
    # Log to incidents
    cur.execute("""
        INSERT INTO incidents(id,date,camera,location,type,severity,probability,status)
        VALUES(?,?,?,?,?,?,?,?)
    """,(incident_id,now(),camera_name,"Upload",type_str,"critical",confidence,"confirmed"))

    # Log to alerts
    cur.execute("""
        INSERT INTO alerts(id, title, description, severity, status, camera, location, timestamp, confidence)
        VALUES(?,?,?,?,?,?,?,?,?)
    """, (alert_id, "Accident Detected", f"Vehicle collision detected at {camera_name}", "critical", "active", camera_name, "Upload", now(), confidence))

    conn.commit()
    conn.close()


# ---------------------------------------------------
# Live Camera Detection
# ---------------------------------------------------

def video_stream(video_name):

    video_path = os.path.join("videos", video_name)
    if not os.path.exists(video_path):
        # Fallback to demo3 if file not found
        video_path = os.path.join("videos", "demo3.mp4")

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        cap = cv2.VideoCapture(os.path.join("videos", "demo3.mp4"))

    retry_count = 0
    while True:

        ret,frame = cap.read()

        if not ret:
            retry_count += 1
            if retry_count > 5:
                # Fallback to demo3 if demo1 keeps failing
                cap.release()
                cap = cv2.VideoCapture(os.path.join("videos", "demo3.mp4"))
                retry_count = 0
                continue
            cap.set(cv2.CAP_PROP_POS_FRAMES,0)
            continue
        
        retry_count = 0

        # No prediction on dashboard streams per user request
        # pred,prob = predict_frame(frame, persist=True)
        # if pred == "Accident":
        #     label = f"Accident {prob:.2f}%"
        #     color = (0,0,255)
        # else:
        #     label = f"Normal {prob:.2f}%"
        #     color = (0,255,0)
        # cv2.rectangle(frame,(0,0),(400,50),(0,0,0),-1)
        # cv2.putText(frame,label,(10,35),font,1,color,2)

        _,jpeg = cv2.imencode(".jpg",frame)

        yield(
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n'+jpeg.tobytes()+b'\r\n'
        )


@app.route("/api/live-camera/<video_name>")
def live_camera(video_name):

    return Response(
        video_stream(video_name),
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