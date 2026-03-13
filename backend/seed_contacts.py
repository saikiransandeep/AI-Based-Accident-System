import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "app.db")

def seed_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Clear existing contacts if any
    cur.execute("DELETE FROM emergency_contacts")

    contacts = [
        ("hosp-001", "City General Hospital", "hospital", "+1-555-0101", "123 Medical Center Way", "1.2 km", 1, "8 min"),
        ("pol-001", "Downtown Police Station", "police", "+1-555-0202", "456 Safety Blvd", "0.8 km", 1, "5 min"),
        ("amb-001", "FastCare Ambulance", "ambulance", "+1-555-0303", "789 Response Ave", "2.5 km", 1, "4 min"),
        ("fire-001", "Central Fire Dept", "fire", "+1-555-0404", "101 Rescue St", "1.5 km", 1, "6 min"),
        ("hosp-002", "St. Jude Trauma Center", "hospital", "+1-555-0505", "202 Emergency Rd", "3.1 km", 1, "12 min"),
    ]

    cur.executemany("""
        INSERT INTO emergency_contacts(id, name, type, phone, address, distance, available, response_time)
        VALUES(?,?,?,?,?,?,?,?)
    """, contacts)

    conn.commit()
    conn.close()
    print("Database seeded with emergency contacts successfully!")

if __name__ == "__main__":
    seed_db()
