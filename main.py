
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import random
import time
import os

app = Flask(__name__)
# Enable CORS for local development
CORS(app, resources={r"/api/*": {"origins": "*"}}, methods=["GET", "POST", "OPTIONS"])

# Ensure DB is created in the same folder as the script
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'flixa.db')

def get_db_connection():
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn
    except Exception as e:
        print(f"CRITICAL: SQLite Connection Error: {e}")
        return None

def init_db():
    conn = get_db_connection()
    if not conn: return
    try:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                email TEXT PRIMARY KEY, phone TEXT NOT NULL, 
                otp TEXT, is_verified INTEGER DEFAULT 0, last_otp_gen REAL
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS bookings (
                id TEXT PRIMARY KEY, email TEXT NOT NULL, 
                movie_title TEXT NOT NULL, seats TEXT NOT NULL, 
                parking_spot TEXT, total_price REAL, timestamp REAL
            )
        ''')
        conn.commit()
        print(f"DATABASE: SQLite online at {DB_PATH}")
    except Exception as e:
        print(f"DATABASE ERROR: {e}")
    finally:
        conn.close()

init_db()

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "online", "database": "sqlite", "server": "Python Flask"})

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    email, phone = data.get('email'), data.get('phone')
    otp = str(random.randint(1000, 9999))
    conn = get_db_connection()
    if not conn: return jsonify({"error": "DB Offline"}), 500
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO users (email, phone, otp, last_otp_gen) VALUES (?, ?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET phone=excluded.phone, otp=excluded.otp
        ''', (email, phone, otp, time.time()))
        conn.commit()
        print(f"--- AUTH: {email} access token: {otp} ---")
        return jsonify({"status": "success"})
    finally:
        conn.close()

@app.route('/api/bookings/create', methods=['POST'])
def create_booking():
    data = request.json
    booking_id = f"FLX-{random.randint(1000, 9999)}"
    conn = get_db_connection()
    if not conn: return jsonify({"error": "DB Offline"}), 500
    try:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO bookings VALUES (?,?,?,?,?,?,?)', (
            booking_id, data['email'], data['movie_title'], 
            ",".join(data['seats']), data['parking_spot'], 
            data['total_price'], time.time()
        ))
        conn.commit()
        print(f"--- BOOKING: Recorded {booking_id} ---")
        return jsonify({"status": "success", "booking_id": booking_id})
    finally:
        conn.close()

if __name__ == '__main__':
    print("--- FLIXA PREMIER BACKEND STARTING ---")
    app.run(host='0.0.0.0', port=5000)
