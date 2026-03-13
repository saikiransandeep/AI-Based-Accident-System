import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "app.db")

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

print("Schema for incidents:")
cur.execute("PRAGMA table_info(incidents)")
columns = cur.fetchall()
for col in columns:
    print(col)

print("\nSchema for alerts:")
cur.execute("PRAGMA table_info(alerts)")
columns = cur.fetchall()
for col in columns:
    print(col)

conn.close()
