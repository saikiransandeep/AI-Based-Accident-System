import sqlite3
import os
import random
from datetime import datetime, timedelta

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "app.db")

def now(days_ago=0):
    dt = datetime.now() - timedelta(days=days_ago)
    return dt.strftime("%Y-%m-%d %H:%M:%S")

def seed_history():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Clear existing incidents if any
    cur.execute("DELETE FROM incidents")

    incidents = [
        (f"INC-{random.randint(1000,9999)}", now(0), "Highway I-95 North", "Exit 42", "Vehicle Collision", "critical", 94.5, "confirmed"),
        (f"INC-{random.randint(1000,9999)}", now(1), "Main Street Junction", "Central District", "Minor Scrape", "low", 82.1, "false-positive"),
        (f"INC-{random.randint(1000,9999)}", now(2), "Industrial Zone A", "Port Area", "Multi-car Pileup", "critical", 98.2, "confirmed"),
        (f"INC-{random.randint(1000,9999)}", now(3), "Airport Terminal", "Arrivals Level", "Pedestrian Incident", "high", 88.7, "confirmed"),
        (f"INC-{random.randint(1000,9999)}", now(5), "Upload Image", "Manual Upload", "Vehicle Overturn", "high", 91.4, "confirmed"),
        (f"INC-{random.randint(1000,9999)}", now(7), "Upload Video", "Manual Upload", "Engine Fire", "critical", 95.0, "confirmed"),
        (f"INC-{random.randint(1000,9999)}", now(10), "Highway I-95 North", "Mile Marker 12", "Debris on Road", "medium", 76.5, "confirmed"),
    ]

    cur.executemany("""
        INSERT INTO incidents(id, date, camera, location, type, severity, probability, status)
        VALUES(?,?,?,?,?,?,?,?)
    """, incidents)

    conn.commit()
    conn.close()
    print("Database seeded with incident history successfully!")

if __name__ == "__main__":
    seed_history()
