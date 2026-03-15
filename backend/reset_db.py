import sqlite3
import app
import os

print("Resetting map_markers table...")

conn = sqlite3.connect('app.db')
conn.execute("DROP TABLE IF EXISTS map_markers")
conn.commit()
conn.close()

print("Recreating table...")
app.init_db()
print("Done resetting.")
