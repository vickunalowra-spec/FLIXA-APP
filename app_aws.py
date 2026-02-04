from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from flask_cors import CORS
import os
import boto3
import uuid
import random
import time
from botocore.exceptions import ClientError

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'
CORS(app)

# AWS Configuration (Locked to us-east-1 as requested)
REGION = 'us-east-1' 

dynamodb = boto3.resource('dynamodb', region_name=REGION)
sns = boto3.client('sns', region_name=REGION)

# DynamoDB Tables (Mapped from your SQLite logic)
users_table = dynamodb.Table('Users')         # Key: email
bookings_table = dynamodb.Table('Bookings')   # Key: id
SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:054037122362:flixa_app' 

def send_notification(subject, message):
    try:
        sns.publish(TopicArn=SNS_TOPIC_ARN, Subject=subject, Message=message)
    except ClientError as e:
        print(f"SNS Error: {e}")

# --- API ROUTES (From Flixa Logic) ---

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "online", "cloud": "AWS us-east-1", "database": "DynamoDB"})

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    phone = data.get('phone')
    otp = str(random.randint(1000, 9999))
    
    try:
        # DynamoDB put_item handles the "ON CONFLICT" logic automatically
        users_table.put_item(Item={
            'email': email,
            'phone': phone,
            'otp': otp,
            'is_verified': 0,
            'last_otp_gen': int(time.time())
        })
        
        # Notify via SNS
        send_notification("New Registration", f"User {email} registered. OTP: {otp}")
        
        print(f"--- AUTH: {email} access token: {otp} ---")
        return jsonify({"status": "success", "message": "OTP generated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/bookings/create', methods=['POST'])
def create_booking():
    data = request.json
    booking_id = f"FLX-{random.randint(1000, 9999)}"
    
    try:
        # Convert seats list to string if necessary, or store as List (DynamoDB supports Lists)
        booking_item = {
            'id': booking_id,
            'email': data['email'],
            'movie_title': data['movie_title'],
            'seats': data['seats'], # DynamoDB can store this as a list directly
            'parking_spot': data.get('parking_spot', 'None'),
            'total_price': data['total_price'],
            'timestamp': int(time.time())
        }
        
        bookings_table.put_item(Item=booking_item)
        
        # Notify admin of new booking
        send_notification("New Booking", f"Booking {booking_id} confirmed for {data['email']}")
        
        return jsonify({"status": "success", "booking_id": booking_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- APP RUN ---

if __name__ == '__main__':
    print("--- FLIXA AWS BACKEND STARTING (US-EAST-1) ---")
    app.run(host='0.0.0.0', port=5000, debug=True)
