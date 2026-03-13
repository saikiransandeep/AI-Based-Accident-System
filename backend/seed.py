import sqlite3
import json
from datetime import datetime, timedelta
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "app.db")

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# Incidents Data from frontend
incidents = [
  {"id": "INC-001", "date": (datetime.now() - timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S"), "camera": "CAM-01", "location": "Highway A1 - Mile 42", "type": "Multi-vehicle Collision", "severity": "critical", "probability": 94.5, "status": "confirmed"},
  {"id": "INC-002", "date": (datetime.now() - timedelta(hours=5)).strftime("%Y-%m-%d %H:%M:%S"), "camera": "CAM-05", "location": "Junction 5 - North", "type": "Rear-end Collision", "severity": "high", "probability": 87.2, "status": "confirmed"},
  {"id": "INC-003", "date": (datetime.now() - timedelta(hours=24)).strftime("%Y-%m-%d %H:%M:%S"), "camera": "CAM-03", "location": "Main St - 5th Ave", "type": "Side Impact", "severity": "high", "probability": 91.8, "status": "confirmed"},
  {"id": "INC-004", "date": (datetime.now() - timedelta(hours=48)).strftime("%Y-%m-%d %H:%M:%S"), "camera": "CAM-08", "location": "Cross Rd - East", "type": "Single Vehicle", "severity": "medium", "probability": 78.4, "status": "false-positive"},
  {"id": "INC-005", "date": (datetime.now() - timedelta(hours=72)).strftime("%Y-%m-%d %H:%M:%S"), "camera": "CAM-02", "location": "Highway A1 - Exit 12", "type": "Vehicle Stalled", "severity": "low", "probability": 96.1, "status": "confirmed"},
  {"id": "INC-006", "date": (datetime.now() - timedelta(hours=96)).strftime("%Y-%m-%d %H:%M:%S"), "camera": "CAM-07", "location": "Route 66 - Crosswalk", "type": "Pedestrian Near Miss", "severity": "high", "probability": 82.7, "status": "pending"},
  {"id": "INC-007", "date": (datetime.now() - timedelta(hours=120)).strftime("%Y-%m-%d %H:%M:%S"), "camera": "CAM-04", "location": "Bridge Rd - Section B", "type": "Multi-vehicle Collision", "severity": "critical", "probability": 89.3, "status": "confirmed"},
  {"id": "INC-008", "date": (datetime.now() - timedelta(hours=144)).strftime("%Y-%m-%d %H:%M:%S"), "camera": "CAM-06", "location": "Tunnel E - Entry", "type": "Debris on Road", "severity": "medium", "probability": 75.6, "status": "confirmed"}
]

for inc in incidents:
    cur.execute("INSERT OR IGNORE INTO incidents(id, date, camera, location, type, severity, probability, status) VALUES (?,?,?,?,?,?,?,?)",
        (inc['id'], inc['date'], inc['camera'], inc['location'], inc['type'], inc['severity'], inc['probability'], inc['status']))

# Alerts Data
alerts = [
  {"id": "1", "title": "Multi-vehicle Collision Detected", "description": "AI detected a potential multi-vehicle collision on Highway A1.", "severity": "critical", "status": "active", "camera": "CAM-01", "location": "Highway A1 - Mile 42", "timestamp": (datetime.now() - timedelta(minutes=2)).strftime("%Y-%m-%d %H:%M:%S"), "confidence": 94.5},
  {"id": "2", "title": "Rear-end Collision Alert", "description": "Rear-end collision detected at traffic junction.", "severity": "high", "status": "active", "camera": "CAM-05", "location": "Junction 5 - North Exit", "timestamp": (datetime.now() - timedelta(minutes=15)).strftime("%Y-%m-%d %H:%M:%S"), "confidence": 87.2},
  {"id": "3", "title": "Vehicle Stalled on Bridge", "description": "Stalled vehicle detected on bridge causing traffic slowdown.", "severity": "medium", "status": "acknowledged", "camera": "CAM-04", "location": "Bridge Rd - Section B", "timestamp": (datetime.now() - timedelta(minutes=45)).strftime("%Y-%m-%d %H:%M:%S"), "confidence": 91.8},
  {"id": "4", "title": "Debris on Road", "description": "Debris detected on road surface. May affect traffic flow.", "severity": "low", "status": "resolved", "camera": "CAM-08", "location": "Cross Rd - East", "timestamp": (datetime.now() - timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S"), "confidence": 78.4},
  {"id": "5", "title": "Side Impact Collision", "description": "Side impact collision detected at intersection.", "severity": "critical", "status": "acknowledged", "camera": "CAM-03", "location": "Main St - 5th Ave", "timestamp": (datetime.now() - timedelta(minutes=30)).strftime("%Y-%m-%d %H:%M:%S"), "confidence": 96.1},
  {"id": "6", "title": "Pedestrian Near Miss", "description": "Near miss incident involving pedestrian detected.", "severity": "high", "status": "active", "camera": "CAM-07", "location": "Route 66 - Crosswalk", "timestamp": (datetime.now() - timedelta(minutes=10)).strftime("%Y-%m-%d %H:%M:%S"), "confidence": 82.7}
]

for alert in alerts:
    cur.execute("INSERT OR IGNORE INTO alerts(id, title, description, severity, status, camera, location, timestamp, confidence) VALUES (?,?,?,?,?,?,?,?,?)",
        (alert['id'], alert['title'], alert['description'], alert['severity'], alert['status'], alert['camera'], alert['location'], alert['timestamp'], alert['confidence']))

# Contacts Data
contacts = [
  {"id": "h1", "name": "City General Hospital", "type": "hospital", "phone": "+1-555-0100", "address": "123 Medical Center Dr", "distance": "2.3 km", "available": True, "responseTime": "8 min"},
  {"id": "h2", "name": "Emergency Medical Center", "type": "hospital", "phone": "+1-555-0101", "address": "456 Health Avenue", "distance": "4.1 km", "available": True, "responseTime": "12 min"},
  {"id": "p1", "name": "Central Police Station", "type": "police", "phone": "+1-555-0200", "address": "789 Law Enforcement Blvd", "distance": "1.8 km", "available": True, "responseTime": "5 min"},
  {"id": "p2", "name": "Highway Patrol Unit", "type": "police", "phone": "+1-555-0201", "address": "321 Highway Control Center", "distance": "3.5 km", "available": True, "responseTime": "7 min"},
  {"id": "a1", "name": "Rapid Response Ambulance", "type": "ambulance", "phone": "+1-555-0300", "address": "654 Emergency Lane", "distance": "0.8 km", "available": True, "responseTime": "3 min"},
  {"id": "a2", "name": "Metro Ambulance Services", "type": "ambulance", "phone": "+1-555-0301", "address": "987 Rescue Street", "distance": "2.9 km", "available": False, "responseTime": "9 min"},
  {"id": "f1", "name": "Fire Station #1", "type": "fire", "phone": "+1-555-0400", "address": "111 Firefighter Ave", "distance": "1.5 km", "available": True, "responseTime": "4 min"},
  {"id": "f2", "name": "Industrial Fire Response", "type": "fire", "phone": "+1-555-0401", "address": "222 Industrial Zone", "distance": "5.2 km", "available": True, "responseTime": "15 min"}
]

for c in contacts:
    cur.execute("INSERT OR IGNORE INTO emergency_contacts(id, name, type, phone, address, distance, available, response_time) VALUES (?,?,?,?,?,?,?,?)",
        (c['id'], c['name'], c['type'], c['phone'], c['address'], c['distance'], int(c['available']), c['responseTime']))

# Map Markers
map_markers = [
  {"id": "1", "type": "camera", "name": "CAM-01", "location": "Highway A1 - Mile 42", "status": "active", "x": 25, "y": 30, "details": "1080p @ 30fps", "confidence": "", "timestamp": ""},
  {"id": "2", "type": "camera", "name": "CAM-02", "location": "Highway A1 - Exit 12", "status": "active", "x": 35, "y": 25, "details": "1080p @ 30fps", "confidence": "", "timestamp": ""},
  {"id": "3", "type": "camera", "name": "CAM-03", "location": "Main St - 5th Ave", "status": "active", "x": 55, "y": 45, "details": "4K @ 30fps", "confidence": "", "timestamp": ""},
  {"id": "4", "type": "camera", "name": "CAM-04", "location": "Bridge Rd - Section B", "status": "warning", "x": 70, "y": 35, "details": "1080p @ 30fps", "confidence": "", "timestamp": ""},
  {"id": "5", "type": "camera", "name": "CAM-05", "location": "Junction 5 - North", "status": "active", "x": 45, "y": 55, "details": "1080p @ 30fps", "confidence": "", "timestamp": ""},
  {"id": "6", "type": "camera", "name": "CAM-06", "location": "Tunnel E - Entry", "status": "active", "x": 60, "y": 65, "details": "Night Vision", "confidence": "", "timestamp": ""},
  {"id": "7", "type": "camera", "name": "CAM-07", "location": "Route 66 - Crosswalk", "status": "offline", "x": 30, "y": 70, "details": "1080p @ 30fps", "confidence": "", "timestamp": ""},
  {"id": "8", "type": "camera", "name": "CAM-08", "location": "Cross Rd - East", "status": "active", "x": 80, "y": 50, "details": "1080p @ 30fps", "confidence": "", "timestamp": ""},
  {"id": "9", "type": "accident", "name": "Collision Detected", "location": "Highway A1 - Mile 42", "status": "critical", "x": 27, "y": 32, "details": "Vehicle collision", "confidence": "94.5%", "timestamp": "2 min ago"},
  {"id": "10", "type": "accident", "name": "Rear-end Collision", "location": "Junction 5", "status": "warning", "x": 47, "y": 57, "details": "Minor collision", "confidence": "87.2%", "timestamp": "15 min ago"},
  {"id": "11", "type": "alert", "name": "Traffic Slowdown", "location": "Bridge Rd", "status": "warning", "x": 72, "y": 37, "details": "30% speed reduction", "confidence": "", "timestamp": ""},
  {"id": "12", "type": "alert", "name": "Debris Reported", "location": "Route 66", "status": "active", "x": 32, "y": 68, "details": "Pending verification", "confidence": "", "timestamp": ""},
  {"id": "13", "type": "hospital", "name": "City General Hospital", "location": "123 Medical Center Dr", "status": "active", "x": 20, "y": 45, "details": "Emergency: Available", "confidence": "", "timestamp": ""},
  {"id": "14", "type": "hospital", "name": "Emergency Medical Center", "location": "456 Health Avenue", "status": "active", "x": 65, "y": 20, "details": "Emergency: Available", "confidence": "", "timestamp": ""},
  {"id": "15", "type": "police", "name": "Central Police Station", "location": "789 Law Enforcement Blvd", "status": "active", "x": 40, "y": 40, "details": "Units: 5 Available", "confidence": "", "timestamp": ""},
  {"id": "16", "type": "police", "name": "Highway Patrol Unit", "location": "321 Highway Control Center", "status": "active", "x": 75, "y": 60, "details": "Units: 3 Available", "confidence": "", "timestamp": ""}
]

for m in map_markers:
    cur.execute("INSERT OR IGNORE INTO map_markers(id, type, name, location, status, x, y, details, confidence, timestamp) VALUES (?,?,?,?,?,?,?,?,?,?)",
        (m['id'], m['type'], m['name'], m['location'], m['status'], m['x'], m['y'], m['details'], m['confidence'], m['timestamp']))

conn.commit()
conn.close()
print('Seeded database!')
