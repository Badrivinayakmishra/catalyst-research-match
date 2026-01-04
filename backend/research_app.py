"""
Catalyst Research Lab Matching Platform - Backend API
Flask-based REST API for connecting UCLA students with research opportunities
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
import uuid
from datetime import datetime, timedelta
import os
from typing import List, Dict, Any

# Import SendGrid for email (optional)
try:
    import sendgrid
    from sendgrid.helpers.mail import Mail, Email, To, Content
    SENDGRID_ENABLED = True
except ImportError:
    print("⚠️ SendGrid not available - email features disabled")
    SENDGRID_ENABLED = False

# Import OAuth libraries (optional)
try:
    from authlib.integrations.flask_client import OAuth
    import requests
    OAUTH_ENABLED = True
except ImportError:
    print("⚠️ OAuth libraries not available - SSO features disabled")
    OAUTH_ENABLED = False

# Import AI matching algorithms
try:
    from models import (
        Candidate, Lab, MatchResult, Transcript, Course,
        ResearchExperience, ExperienceLevel
    )
    from lab_ats_algorithm import LabATSAlgorithm
    from nlp_utils import SimpleEmbedding, TextProcessor
    AI_MATCHING_ENABLED = True
except ImportError as e:
    print(f"⚠️  AI matching algorithms not available: {e}")
    AI_MATCHING_ENABLED = False

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'dev-secret-key-change-in-production')
CORS(app)  # Enable CORS for frontend communication

# OAuth setup
if OAUTH_ENABLED:
    oauth = OAuth(app)
    google = oauth.register(
        name='google',
        client_id=os.environ.get('GOOGLE_CLIENT_ID'),
        client_secret=os.environ.get('GOOGLE_CLIENT_SECRET'),
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={'scope': 'openid email profile'}
    )
else:
    google = None

# Database setup
DB_PATH = os.path.join(os.path.dirname(__file__), 'instance', 'catalyst.db')

def init_db():
    """Initialize the database with required tables"""
    # Create database directory if it doesn't exist
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # Users table
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT NOT NULL,
            user_type TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
        )
    ''')

    # Students table (extended profile)
    c.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id TEXT PRIMARY KEY,
            user_id TEXT UNIQUE NOT NULL,
            first_name TEXT,
            last_name TEXT,
            phone TEXT,
            student_id TEXT,
            major TEXT,
            minor TEXT,
            year TEXT,
            gpa TEXT,
            graduation_date TEXT,
            bio TEXT,
            linkedin TEXT,
            github TEXT,
            portfolio TEXT,
            resume_url TEXT,
            transcript_url TEXT,
            skills TEXT,
            interests TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    # PIs table (professor profiles)
    c.execute('''
        CREATE TABLE IF NOT EXISTS pis (
            id TEXT PRIMARY KEY,
            user_id TEXT UNIQUE NOT NULL,
            first_name TEXT,
            last_name TEXT,
            title TEXT,
            department TEXT,
            phone TEXT,
            office_location TEXT,
            personal_website TEXT,
            google_scholar TEXT,
            twitter TEXT,
            linkedin TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    # Research labs table (updated with more fields)
    c.execute('''
        CREATE TABLE IF NOT EXISTS labs (
            id TEXT PRIMARY KEY,
            pi_id TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            building TEXT,
            room TEXT,
            website TEXT,
            research_areas TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (pi_id) REFERENCES pis(id)
        )
    ''')

    # Opportunities table (detailed job postings)
    c.execute('''
        CREATE TABLE IF NOT EXISTS opportunities (
            id TEXT PRIMARY KEY,
            lab_id TEXT NOT NULL,
            title TEXT NOT NULL,
            research_area TEXT,
            description TEXT,
            responsibilities TEXT,
            qualifications TEXT,
            required_skills TEXT,
            preferred_skills TEXT,
            hours_per_week TEXT,
            duration TEXT,
            positions_available INTEGER DEFAULT 1,
            location TEXT,
            start_date TEXT,
            deadline TEXT,
            remote BOOLEAN DEFAULT 0,
            compensation_type TEXT,
            compensation_amount TEXT,
            status TEXT DEFAULT 'active',
            views INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (lab_id) REFERENCES labs(id)
        )
    ''')

    # Applications table (extended)
    c.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            id TEXT PRIMARY KEY,
            student_id TEXT NOT NULL,
            opportunity_id TEXT NOT NULL,
            cover_letter TEXT,
            availability TEXT,
            start_date TEXT,
            status TEXT DEFAULT 'pending',
            match_score INTEGER DEFAULT 0,
            resume_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id),
            FOREIGN KEY (opportunity_id) REFERENCES opportunities(id)
        )
    ''')

    # Saved labs table (bookmarking)
    c.execute('''
        CREATE TABLE IF NOT EXISTS saved_labs (
            id TEXT PRIMARY KEY,
            student_id TEXT NOT NULL,
            lab_id TEXT NOT NULL,
            saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id),
            FOREIGN KEY (lab_id) REFERENCES labs(id),
            UNIQUE(student_id, lab_id)
        )
    ''')

    # Password Reset Tokens table
    c.execute('''
        CREATE TABLE IF NOT EXISTS password_resets (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            token TEXT NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    # TODO: Add sample data for new schema (pis, labs, opportunities)

    conn.commit()
    conn.close()
    print("✓ Database initialized successfully")

# Initialize database on startup
init_db()

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password):
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

# ==================== Email Helper Functions ====================

def send_email(to_email, subject, content_html):
    """Send email using SendGrid"""
    if not SENDGRID_ENABLED:
        print("⚠️ SendGrid not available. Email not sent.")
        return False

    try:
        api_key = os.environ.get('SENDGRID_API_KEY')
        if not api_key:
            print("⚠️ SendGrid API key not found. Email not sent.")
            return False

        # Use verified sender email from environment variable
        sender_email = os.environ.get('SENDGRID_SENDER_EMAIL', 'noreply@example.com')

        sg = sendgrid.SendGridAPIClient(api_key=api_key)
        from_email = Email(sender_email)
        to_email_obj = To(to_email)
        content_obj = Content("text/html", content_html)
        mail = Mail(from_email, to_email_obj, subject, content_obj)

        response = sg.client.mail.send.post(request_body=mail.get())
        print(f"✓ Email sent to {to_email}: {response.status_code}")
        return True
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        return False

# ==================== Authentication Endpoints ====================

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """Create new user account with extended profile"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        user_type = data.get('userType', 'student')

        # Basic required fields
        if not all([email, password]):
            return jsonify({'error': 'Email and password are required'}), 400

        # Validate UCLA email for students
        if user_type == 'student':
            if not (email.endswith('@ucla.edu') or email.endswith('@g.ucla.edu')):
                return jsonify({'error': 'Students must use a UCLA email'}), 400

        conn = get_db()
        c = conn.cursor()

        # Check if user already exists
        c.execute('SELECT id FROM users WHERE email = ?', (email,))
        if c.fetchone():
            conn.close()
            return jsonify({'error': 'Email already registered'}), 400

        # Create new user
        user_id = str(uuid.uuid4())
        password_hash = hash_password(password)

        # Get full name from firstName + lastName or fallback to fullName
        first_name = data.get('firstName', '')
        last_name = data.get('lastName', '')
        full_name = data.get('fullName', f"{first_name} {last_name}".strip())

        if not full_name:
            return jsonify({'error': 'Name is required'}), 400

        c.execute('''
            INSERT INTO users (id, email, password_hash, full_name, user_type)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, email, password_hash, full_name, user_type))

        # If student, create extended profile
        if user_type == 'student':
            student_id = str(uuid.uuid4())
            c.execute('''
                INSERT INTO students (
                    id, user_id, first_name, last_name, phone, student_id,
                    major, minor, year, gpa, graduation_date, bio,
                    linkedin, github, portfolio, skills, interests
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                student_id,
                user_id,
                first_name or full_name.split()[0] if full_name else '',
                last_name or (full_name.split()[1] if len(full_name.split()) > 1 else ''),
                data.get('phone', ''),
                data.get('studentId', ''),
                data.get('major', ''),
                data.get('minor', ''),
                data.get('year', ''),
                data.get('gpa', ''),
                data.get('graduationDate', ''),
                data.get('bio', ''),
                data.get('linkedin', ''),
                data.get('github', ''),
                data.get('portfolio', ''),
                ','.join(data.get('skills', [])) if isinstance(data.get('skills'), list) else data.get('skills', ''),
                ','.join(data.get('interests', [])) if isinstance(data.get('interests'), list) else data.get('interests', '')
            ))

        conn.commit()
        conn.close()

        # Send welcome email
        welcome_html = f"""
        <h1>Welcome to Catalyst, {full_name}!</h1>
        <p>Your account has been successfully created.</p>
        <p>You can now log in and start exploring research opportunities at UCLA.</p>
        <br>
        <p>Best regards,<br>The Catalyst Team</p>
        """
        send_email(email, "Welcome to Catalyst Research Matching", welcome_html)

        return jsonify({
            'success': True,
            'user': {
                'id': user_id,
                'email': email,
                'fullName': full_name,
                'userType': user_type
            }
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/pi/signup', methods=['POST'])
def pi_signup():
    """Create new PI account with profile"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        first_name = data.get('firstName')
        last_name = data.get('lastName')

        # Required fields
        if not all([email, password, first_name, last_name]):
            return jsonify({'error': 'Email, password, first name, and last name are required'}), 400

        # Validate UCLA email for PIs
        if not (email.endswith('@ucla.edu') or email.endswith('@g.ucla.edu')):
            return jsonify({'error': 'PIs must use a UCLA email'}), 400

        conn = get_db()
        c = conn.cursor()

        # Check if user already exists
        c.execute('SELECT id FROM users WHERE email = ?', (email,))
        if c.fetchone():
            conn.close()
            return jsonify({'error': 'Email already registered'}), 400

        # Create new user
        user_id = str(uuid.uuid4())
        password_hash = hash_password(password)
        full_name = f"{first_name} {last_name}"

        c.execute('''
            INSERT INTO users (id, email, password_hash, full_name, user_type)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, email, password_hash, full_name, 'pi'))

        # Create PI profile
        pi_id = str(uuid.uuid4())
        c.execute('''
            INSERT INTO pis (
                id, user_id, first_name, last_name, title, department,
                phone, office_location, personal_website, google_scholar,
                twitter, linkedin
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            pi_id,
            user_id,
            first_name,
            last_name,
            data.get('title', ''),
            data.get('department', ''),
            data.get('phone', ''),
            data.get('officeLocation', ''),
            data.get('personalWebsite', ''),
            data.get('googleScholar', ''),
            data.get('twitter', ''),
            data.get('linkedin', '')
        ))

        conn.commit()
        conn.close()

        # Send welcome email
        welcome_html = f"""
        <h1>Welcome to Catalyst, {full_name}!</h1>
        <p>Your PI account has been successfully created.</p>
        <p>You can now log in and start posting research opportunities for UCLA students.</p>
        <br>
        <p>Best regards,<br>The Catalyst Team</p>
        """
        send_email(email, "Welcome to Catalyst Research Matching", welcome_html)

        return jsonify({
            'success': True,
            'user': {
                'id': user_id,
                'email': email,
                'fullName': full_name,
                'userType': 'pi',
                'piId': pi_id
            }
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return jsonify({'error': 'Email and password are required'}), 400

        conn = get_db()
        c = conn.cursor()

        password_hash = hash_password(password)
        c.execute('''
            SELECT id, email, full_name, user_type
            FROM users
            WHERE email = ? AND password_hash = ?
        ''', (email, password_hash))

        user = c.fetchone()
        conn.close()

        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401

        return jsonify({
            'success': True,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'fullName': user['full_name'],
                'userType': user['user_type']
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    """Initiate password reset"""
    try:
        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({'error': 'Email is required'}), 400

        conn = get_db()
        c = conn.cursor()

        # Check if user exists
        c.execute('SELECT id, full_name FROM users WHERE email = ?', (email,))
        user = c.fetchone()

        if not user:
            conn.close()
            # Return success even if email not found (security best practice)
            return jsonify({'message': 'If an account exists, a reset link has been sent.'}), 200

        user_id = user['id']
        full_name = user['full_name']

        # Create reset token
        token = str(uuid.uuid4())
        reset_id = str(uuid.uuid4())
        expires_at = datetime.now() + timedelta(hours=1)

        c.execute('''
            INSERT INTO password_resets (id, user_id, token, expires_at)
            VALUES (?, ?, ?, ?)
        ''', (reset_id, user_id, token, expires_at))

        conn.commit()
        conn.close()

        # Send reset email
        # In production, link to the frontend reset page
        reset_link = f"https://catalyst-indol-beta.vercel.app/reset-password?token={token}"
        
        email_html = f"""
        <h1>Password Reset Request</h1>
        <p>Hi {full_name},</p>
        <p>We received a request to reset your password. Click the link below to proceed:</p>
        <p><a href="{reset_link}">Reset Password</a></p>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        """
        
        send_email(email, "Catalyst Password Reset", email_html)

        return jsonify({'message': 'If an account exists, a reset link has been sent.'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    """Reset password with token"""
    try:
        data = request.get_json()
        token = data.get('token')
        new_password = data.get('newPassword')

        if not all([token, new_password]):
            return jsonify({'error': 'Token and new password required'}), 400

        conn = get_db()
        c = conn.cursor()

        # Validate token
        c.execute('''
            SELECT user_id, expires_at FROM password_resets
            WHERE token = ?
        ''', (token,))
        record = c.fetchone()

        if not record:
            conn.close()
            return jsonify({'error': 'Invalid or expired token'}), 400

        expires_at = datetime.strptime(record['expires_at'], '%Y-%m-%d %H:%M:%S.%f')
        if datetime.now() > expires_at:
            conn.close()
            return jsonify({'error': 'Token expired'}), 400

        # Update password
        user_id = record['user_id']
        password_hash = hash_password(new_password)

        c.execute('UPDATE users SET password_hash = ? WHERE id = ?', (password_hash, user_id))
        
        # Delete used token (and potentially all old tokens for this user)
        c.execute('DELETE FROM password_resets WHERE user_id = ?', (user_id,))
        
        conn.commit()
        conn.close()

        return jsonify({'success': True, 'message': 'Password successfully reset'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== Google OAuth Endpoints ====================

@app.route('/api/auth/google', methods=['GET'])
def google_login():
    """Initiate Google OAuth flow"""
    if not OAUTH_ENABLED or not google:
        return jsonify({'error': 'OAuth not configured'}), 503

    redirect_uri = os.environ.get('GOOGLE_REDIRECT_URI', 'https://catalyst-indol-beta.vercel.app/auth/callback')
    return google.authorize_redirect(redirect_uri)

@app.route('/api/auth/google/callback', methods=['POST'])
def google_callback():
    """Handle Google OAuth callback"""
    if not OAUTH_ENABLED:
        return jsonify({'error': 'OAuth not configured'}), 503

    try:
        data = request.get_json()
        code = data.get('code')

        if not code:
            return jsonify({'error': 'No authorization code provided'}), 400

        # Exchange code for token
        token_url = 'https://oauth2.googleapis.com/token'
        token_data = {
            'code': code,
            'client_id': os.environ.get('GOOGLE_CLIENT_ID'),
            'client_secret': os.environ.get('GOOGLE_CLIENT_SECRET'),
            'redirect_uri': os.environ.get('GOOGLE_REDIRECT_URI', 'https://catalyst-indol-beta.vercel.app/auth/callback'),
            'grant_type': 'authorization_code'
        }

        token_response = requests.post(token_url, data=token_data)
        token_json = token_response.json()

        if 'error' in token_json:
            return jsonify({'error': token_json['error']}), 400

        # Get user info
        access_token = token_json['access_token']
        userinfo_url = 'https://www.googleapis.com/oauth2/v2/userinfo'
        headers = {'Authorization': f'Bearer {access_token}'}
        userinfo_response = requests.get(userinfo_url, headers=headers)
        userinfo = userinfo_response.json()

        email = userinfo.get('email')
        full_name = userinfo.get('name')

        if not email:
            return jsonify({'error': 'Failed to get email from Google'}), 400

        # Check if user exists, if not create them
        conn = get_db()
        c = conn.cursor()

        c.execute('SELECT id, email, full_name, user_type FROM users WHERE email = ?', (email,))
        user = c.fetchone()

        if user:
            # User exists, return their info
            user_data = {
                'id': user['id'],
                'email': user['email'],
                'fullName': user['full_name'],
                'userType': user['user_type']
            }
        else:
            # Create new user (default to student for OAuth users)
            user_id = str(uuid.uuid4())
            # Generate a random password hash (won't be used for OAuth users)
            password_hash = hashlib.sha256(str(uuid.uuid4()).encode()).hexdigest()

            c.execute('''
                INSERT INTO users (id, email, password_hash, full_name, user_type)
                VALUES (?, ?, ?, ?, ?)
            ''', (user_id, email, password_hash, full_name, 'student'))

            conn.commit()

            user_data = {
                'id': user_id,
                'email': email,
                'fullName': full_name,
                'userType': 'student'
            }

        conn.close()

        return jsonify({
            'success': True,
            'user': user_data
        }), 200

    except Exception as e:
        print(f"OAuth error: {e}")
        return jsonify({'error': str(e)}), 500

# ==================== Lab Endpoints ====================

@app.route('/api/labs', methods=['GET'])
def get_labs():
    """Get all research labs with opportunities"""
    try:
        conn = get_db()
        c = conn.cursor()

        # Get labs with PI info
        c.execute('''
            SELECT
                l.id, l.name, l.description, l.building, l.room, l.website, l.research_areas,
                p.first_name || ' ' || p.last_name as pi_name,
                p.department,
                p.id as pi_id
            FROM labs l
            JOIN pis p ON l.pi_id = p.id
            ORDER BY l.created_at DESC
        ''')

        labs_dict = {}
        for row in c.fetchall():
            lab_id = row['id']
            labs_dict[lab_id] = {
                'id': lab_id,
                'name': row['name'],
                'pi': row['pi_name'],
                'piId': row['pi_id'],
                'department': row['department'],
                'description': row['description'],
                'building': row['building'],
                'room': row['room'],
                'location': f"{row['building']} {row['room']}" if row['building'] and row['room'] else '',
                'website': row['website'],
                'researchAreas': row['research_areas'].split(',') if row['research_areas'] else [],
                'opportunities': [],
                'openPositions': 0
            }

        # Get opportunities for each lab
        c.execute('''
            SELECT
                id, lab_id, title, research_area, description, responsibilities,
                required_skills, preferred_skills, hours_per_week, duration,
                compensation_type, compensation_amount, deadline, status,
                created_at
            FROM opportunities
            WHERE status = 'active'
        ''')

        for row in c.fetchall():
            lab_id = row['lab_id']
            if lab_id in labs_dict:
                opportunity = {
                    'id': row['id'],
                    'title': row['title'],
                    'type': row['research_area'],
                    'duration': row['duration'],
                    'compensation': f"{row['compensation_type']}" + (f" - {row['compensation_amount']}" if row['compensation_amount'] else ''),
                    'postedDate': row['created_at'],
                    'requirements': row['required_skills'].split(',') if row['required_skills'] else []
                }
                labs_dict[lab_id]['opportunities'].append(opportunity)
                labs_dict[lab_id]['openPositions'] += 1

        conn.close()
        return jsonify({'labs': list(labs_dict.values())}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/labs/<lab_id>', methods=['GET'])
def get_lab(lab_id):
    """Get specific lab details with opportunities"""
    try:
        conn = get_db()
        c = conn.cursor()

        # Get lab with PI info
        c.execute('''
            SELECT
                l.id, l.name, l.description, l.building, l.room, l.website, l.research_areas,
                p.first_name || ' ' || p.last_name as pi_name,
                p.department,
                p.title as pi_title,
                p.id as pi_id
            FROM labs l
            JOIN pis p ON l.pi_id = p.id
            WHERE l.id = ?
        ''', (lab_id,))

        row = c.fetchone()

        if not row:
            conn.close()
            return jsonify({'error': 'Lab not found'}), 404

        lab = {
            'id': row['id'],
            'name': row['name'],
            'pi': row['pi_name'],
            'piId': row['pi_id'],
            'piTitle': row['pi_title'],
            'department': row['department'],
            'description': row['description'],
            'building': row['building'],
            'room': row['room'],
            'location': f"{row['building']} {row['room']}" if row['building'] and row['room'] else '',
            'website': row['website'],
            'researchAreas': row['research_areas'].split(',') if row['research_areas'] else [],
            'opportunities': []
        }

        # Get opportunities for this lab
        c.execute('''
            SELECT
                id, title, research_area, description, responsibilities,
                qualifications, required_skills, preferred_skills,
                hours_per_week, duration, positions_available, location,
                start_date, deadline, remote, compensation_type,
                compensation_amount, status, views, created_at
            FROM opportunities
            WHERE lab_id = ? AND status = 'active'
            ORDER BY created_at DESC
        ''', (lab_id,))

        opportunities = []
        for opp_row in c.fetchall():
            opportunities.append({
                'id': opp_row['id'],
                'title': opp_row['title'],
                'researchArea': opp_row['research_area'],
                'description': opp_row['description'],
                'responsibilities': opp_row['responsibilities'],
                'qualifications': opp_row['qualifications'],
                'requiredSkills': opp_row['required_skills'].split(',') if opp_row['required_skills'] else [],
                'preferredSkills': opp_row['preferred_skills'].split(',') if opp_row['preferred_skills'] else [],
                'hoursPerWeek': opp_row['hours_per_week'],
                'duration': opp_row['duration'],
                'positionsAvailable': opp_row['positions_available'],
                'location': opp_row['location'],
                'startDate': opp_row['start_date'],
                'deadline': opp_row['deadline'],
                'remote': bool(opp_row['remote']),
                'compensationType': opp_row['compensation_type'],
                'compensationAmount': opp_row['compensation_amount'],
                'status': opp_row['status'],
                'views': opp_row['views'],
                'postedDate': opp_row['created_at']
            })

        lab['opportunities'] = opportunities
        lab['openPositions'] = len(opportunities)

        conn.close()
        return jsonify({'lab': lab}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/labs', methods=['POST'])
def create_lab():
    """Create new research lab (PIs only)"""
    try:
        data = request.get_json()

        required_fields = ['name', 'piId', 'description']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        lab_id = str(uuid.uuid4())

        conn = get_db()
        c = conn.cursor()

        # Verify PI exists
        c.execute('SELECT id FROM pis WHERE id = ?', (data['piId'],))
        if not c.fetchone():
            conn.close()
            return jsonify({'error': 'PI not found'}), 404

        # Create lab
        c.execute('''
            INSERT INTO labs (id, pi_id, name, description, building, room, website, research_areas)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            lab_id,
            data['piId'],
            data['name'],
            data['description'],
            data.get('building', ''),
            data.get('room', ''),
            data.get('website', ''),
            ','.join(data.get('researchAreas', []))
        ))

        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'labId': lab_id
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== Application Endpoints ====================

@app.route('/api/opportunities/<opportunity_id>/apply', methods=['POST'])
def apply_to_opportunity(opportunity_id):
    """Submit application to an opportunity"""
    try:
        data = request.get_json()
        student_id = data.get('studentId')
        cover_letter = data.get('coverLetter')
        availability = data.get('availability', '')
        start_date = data.get('startDate', '')

        if not all([student_id, cover_letter]):
            return jsonify({'error': 'Student ID and cover letter are required'}), 400

        conn = get_db()
        c = conn.cursor()

        # Check if opportunity exists
        c.execute('SELECT id, lab_id FROM opportunities WHERE id = ?', (opportunity_id,))
        opportunity = c.fetchone()
        if not opportunity:
            conn.close()
            return jsonify({'error': 'Opportunity not found'}), 404

        # Check if already applied
        c.execute('''
            SELECT id FROM applications
            WHERE opportunity_id = ? AND student_id = ?
        ''', (opportunity_id, student_id))

        if c.fetchone():
            conn.close()
            return jsonify({'error': 'You have already applied to this opportunity'}), 400

        # Get student profile for match score calculation
        c.execute('''
            SELECT skills, interests, gpa, major, year
            FROM students
            WHERE id = ?
        ''', (student_id,))
        student = c.fetchone()

        # Get opportunity details for match score
        c.execute('''
            SELECT required_skills, research_area
            FROM opportunities
            WHERE id = ?
        ''', (opportunity_id,))
        opp = c.fetchone()

        # Calculate simple match score
        match_score = 75  # Default score
        if student and opp:
            match_score = calculate_simple_match_score(
                {
                    'skills': student['skills'] or '',
                    'interests': student['interests'] or '',
                    'gpa': student['gpa'] or '0.0',
                    'major': student['major'] or '',
                    'year': student['year'] or ''
                },
                {
                    'required_skills': opp['required_skills'] or '',
                    'research_area': opp['research_area'] or ''
                }
            )

        # Create application
        application_id = str(uuid.uuid4())
        c.execute('''
            INSERT INTO applications (id, student_id, opportunity_id, cover_letter,
                                     availability, start_date, status, match_score)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (application_id, student_id, opportunity_id, cover_letter,
              availability, start_date, 'pending', match_score))

        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'applicationId': application_id,
            'matchScore': match_score,
            'message': 'Application submitted successfully'
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def calculate_simple_match_score(student, opportunity):
    """
    Calculate simple match score (0-100) between student and opportunity
    without using heavy ML models
    """
    score = 0

    # Skills matching (40 points)
    student_skills = set(s.lower().strip() for s in student.get('skills', '').split(',') if s.strip())
    required_skills = set(s.lower().strip() for s in opportunity.get('required_skills', '').split(',') if s.strip())

    if required_skills:
        skills_match_count = len(student_skills & required_skills)
        skills_match_ratio = skills_match_count / len(required_skills) if len(required_skills) > 0 else 0
        score += int(skills_match_ratio * 40)

    # Research interests matching (20 points)
    student_interests = student.get('interests', '').lower()
    opportunity_area = opportunity.get('research_area', '').lower()
    if student_interests and opportunity_area:
        interests_list = [i.strip() for i in student_interests.split(',') if i.strip()]
        if any(interest in opportunity_area for interest in interests_list):
            score += 20

    # GPA matching (15 points) - assuming 3.0+ is good
    try:
        gpa = float(student.get('gpa', '0.0'))
        if gpa >= 3.5:
            score += 15
        elif gpa >= 3.0:
            score += 10
        elif gpa >= 2.5:
            score += 5
    except ValueError:
        score += 5  # Default if GPA is invalid

    # Year matching (10 points) - juniors and seniors get more points
    year = student.get('year', '').lower()
    if 'senior' in year or '4' in year:
        score += 10
    elif 'junior' in year or '3' in year:
        score += 8
    elif 'sophomore' in year or '2' in year:
        score += 6
    else:
        score += 4

    # Major relevance (15 points) - could be enhanced
    major = student.get('major', '').lower()
    opportunity_area = opportunity.get('research_area', '').lower()
    if major in opportunity_area or opportunity_area in major:
        score += 15
    else:
        score += 8  # Give some points anyway

    return min(score, 100)  # Cap at 100

@app.route('/api/applications/<student_id>', methods=['GET'])
def get_student_applications(student_id):
    """Get all applications for a student"""
    try:
        conn = get_db()
        c = conn.cursor()

        c.execute('''
            SELECT
                a.id, a.opportunity_id, a.cover_letter, a.availability,
                a.start_date, a.status, a.match_score, a.created_at, a.updated_at,
                o.title as position_title,
                o.lab_id,
                l.name as lab_name,
                p.first_name || ' ' || p.last_name as pi_name,
                p.department
            FROM applications a
            JOIN opportunities o ON a.opportunity_id = o.id
            JOIN labs l ON o.lab_id = l.id
            JOIN pis p ON l.pi_id = p.id
            WHERE a.student_id = ?
            ORDER BY a.created_at DESC
        ''', (student_id,))

        applications = []
        for row in c.fetchall():
            applications.append({
                'id': row['id'],
                'opportunityId': row['opportunity_id'],
                'position': row['position_title'],
                'labId': row['lab_id'],
                'labName': row['lab_name'],
                'piName': row['pi_name'],
                'department': row['department'],
                'coverLetter': row['cover_letter'],
                'availability': row['availability'],
                'startDate': row['start_date'],
                'status': row['status'],
                'matchScore': row['match_score'],
                'appliedDate': row['created_at'],
                'lastUpdate': row['updated_at']
            })

        conn.close()
        return jsonify({'applications': applications}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== Student Dashboard & Profile Endpoints ====================

@app.route('/api/student/dashboard', methods=['GET'])
def get_student_dashboard():
    """Get student dashboard data with saved labs, applications, and recommendations"""
    try:
        # Get student_id from query params (in production, get from auth token)
        student_id = request.args.get('studentId')
        if not student_id:
            return jsonify({'error': 'Student ID required'}), 400

        conn = get_db()
        c = conn.cursor()

        # Get student profile
        c.execute('''
            SELECT s.first_name, s.last_name, s.major, s.year, s.gpa, s.user_id
            FROM students s
            WHERE s.id = ?
        ''', (student_id,))

        student = c.fetchone()
        if not student:
            conn.close()
            return jsonify({'error': 'Student not found'}), 404

        # Get saved labs with match scores
        c.execute('''
            SELECT
                l.id, l.name,
                p.first_name || ' ' || p.last_name as pi_name,
                p.department,
                COUNT(o.id) as open_positions
            FROM saved_labs sl
            JOIN labs l ON sl.lab_id = l.id
            JOIN pis p ON l.pi_id = p.id
            LEFT JOIN opportunities o ON l.id = o.lab_id AND o.status = 'active'
            WHERE sl.student_id = ?
            GROUP BY l.id, l.name, pi_name, p.department
            ORDER BY sl.saved_at DESC
        ''', (student_id,))

        saved_labs = []
        for row in c.fetchall():
            # Calculate match score for saved lab (simplified - using a placeholder)
            saved_labs.append({
                'id': row['id'],
                'name': row['name'],
                'pi': row['pi_name'],
                'department': row['department'],
                'matchScore': 85,  # TODO: Calculate real match score
                'openPositions': row['open_positions']
            })

        # Get active applications
        c.execute('''
            SELECT
                a.id, a.status, a.created_at, a.updated_at,
                o.title as position,
                l.name as lab_name
            FROM applications a
            JOIN opportunities o ON a.opportunity_id = o.id
            JOIN labs l ON o.lab_id = l.id
            WHERE a.student_id = ?
            ORDER BY a.created_at DESC
        ''', (student_id,))

        active_applications = []
        for row in c.fetchall():
            active_applications.append({
                'id': row['id'],
                'labName': row['lab_name'],
                'position': row['position'],
                'status': row['status'],
                'appliedDate': row['created_at'],
                'lastUpdate': row['updated_at']
            })

        # Get recommendations (top matching opportunities)
        # First get student profile for matching
        c.execute('''
            SELECT skills, interests, gpa, major, year
            FROM students
            WHERE id = ?
        ''', (student_id,))
        student_profile = c.fetchone()

        # Get all active opportunities
        c.execute('''
            SELECT
                o.id, o.title, o.research_area, o.required_skills, o.description,
                l.id as lab_id, l.name as lab_name,
                p.first_name || ' ' || p.last_name as pi_name,
                p.department
            FROM opportunities o
            JOIN labs l ON o.lab_id = l.id
            JOIN pis p ON l.pi_id = p.id
            WHERE o.status = 'active'
            LIMIT 20
        ''')

        recommendations = []
        for row in c.fetchall():
            # Calculate match score
            if student_profile:
                match_score = calculate_simple_match_score(
                    {
                        'skills': student_profile['skills'] or '',
                        'interests': student_profile['interests'] or '',
                        'gpa': student_profile['gpa'] or '0.0',
                        'major': student_profile['major'] or '',
                        'year': student_profile['year'] or ''
                    },
                    {
                        'required_skills': row['required_skills'] or '',
                        'research_area': row['research_area'] or ''
                    }
                )
            else:
                match_score = 70

            if match_score >= 60:  # Only recommend if match score is decent
                recommendations.append({
                    'id': row['id'],
                    'labId': row['lab_id'],
                    'labName': row['lab_name'],
                    'title': row['title'],
                    'pi': row['pi_name'],
                    'department': row['department'],
                    'researchArea': row['research_area'],
                    'description': row['description'],
                    'matchScore': match_score
                })

        # Sort recommendations by match score
        recommendations.sort(key=lambda x: x['matchScore'], reverse=True)
        recommendations = recommendations[:5]  # Top 5 recommendations

        conn.close()

        return jsonify({
            'name': f"{student['first_name']} {student['last_name']}",
            'major': student['major'],
            'year': student['year'],
            'gpa': student['gpa'],
            'savedLabs': saved_labs,
            'activeApplications': active_applications,
            'recommendations': recommendations
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/student/profile', methods=['GET'])
def get_student_profile():
    """Get student profile"""
    try:
        student_id = request.args.get('studentId')
        if not student_id:
            return jsonify({'error': 'Student ID required'}), 400

        conn = get_db()
        c = conn.cursor()

        c.execute('''
            SELECT
                s.id, s.user_id, s.first_name, s.last_name, s.phone, s.student_id,
                s.major, s.minor, s.year, s.gpa, s.graduation_date, s.bio,
                s.linkedin, s.github, s.portfolio, s.resume_url, s.transcript_url,
                s.skills, s.interests,
                u.email
            FROM students s
            JOIN users u ON s.user_id = u.id
            WHERE s.id = ?
        ''', (student_id,))

        student = c.fetchone()
        conn.close()

        if not student:
            return jsonify({'error': 'Student not found'}), 404

        return jsonify({
            'id': student['id'],
            'userId': student['user_id'],
            'firstName': student['first_name'],
            'lastName': student['last_name'],
            'email': student['email'],
            'phone': student['phone'],
            'studentId': student['student_id'],
            'major': student['major'],
            'minor': student['minor'],
            'year': student['year'],
            'gpa': student['gpa'],
            'graduationDate': student['graduation_date'],
            'bio': student['bio'],
            'linkedin': student['linkedin'],
            'github': student['github'],
            'portfolio': student['portfolio'],
            'resumeUrl': student['resume_url'],
            'transcriptUrl': student['transcript_url'],
            'skills': student['skills'].split(',') if student['skills'] else [],
            'interests': student['interests'].split(',') if student['interests'] else []
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/student/profile', methods=['PUT'])
def update_student_profile():
    """Update student profile"""
    try:
        data = request.get_json()
        student_id = data.get('studentId')

        if not student_id:
            return jsonify({'error': 'Student ID required'}), 400

        conn = get_db()
        c = conn.cursor()

        # Build update query dynamically based on provided fields
        update_fields = []
        params = []

        field_mapping = {
            'firstName': 'first_name',
            'lastName': 'last_name',
            'phone': 'phone',
            'studentId': 'student_id',
            'major': 'major',
            'minor': 'minor',
            'year': 'year',
            'gpa': 'gpa',
            'graduationDate': 'graduation_date',
            'bio': 'bio',
            'linkedin': 'linkedin',
            'github': 'github',
            'portfolio': 'portfolio',
            'resumeUrl': 'resume_url',
            'transcriptUrl': 'transcript_url'
        }

        for json_field, db_field in field_mapping.items():
            if json_field in data:
                update_fields.append(f"{db_field} = ?")
                params.append(data[json_field])

        # Handle arrays (skills, interests)
        if 'skills' in data:
            update_fields.append("skills = ?")
            skills = ','.join(data['skills']) if isinstance(data['skills'], list) else data['skills']
            params.append(skills)

        if 'interests' in data:
            update_fields.append("interests = ?")
            interests = ','.join(data['interests']) if isinstance(data['interests'], list) else data['interests']
            params.append(interests)

        if not update_fields:
            return jsonify({'error': 'No fields to update'}), 400

        # Add updated_at timestamp
        update_fields.append("updated_at = CURRENT_TIMESTAMP")
        params.append(student_id)

        query = f"UPDATE students SET {', '.join(update_fields)} WHERE id = ?"
        c.execute(query, params)
        conn.commit()
        conn.close()

        return jsonify({'success': True, 'message': 'Profile updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/student/saved-labs', methods=['GET'])
def get_saved_labs():
    """Get student's saved labs"""
    try:
        student_id = request.args.get('studentId')
        if not student_id:
            return jsonify({'error': 'Student ID required'}), 400

        conn = get_db()
        c = conn.cursor()

        c.execute('''
            SELECT
                l.id, l.name, l.description, l.website,
                p.first_name || ' ' || p.last_name as pi_name,
                p.department,
                sl.saved_at,
                COUNT(o.id) as open_positions
            FROM saved_labs sl
            JOIN labs l ON sl.lab_id = l.id
            JOIN pis p ON l.pi_id = p.id
            LEFT JOIN opportunities o ON l.id = o.lab_id AND o.status = 'active'
            WHERE sl.student_id = ?
            GROUP BY l.id, l.name, l.description, l.website, pi_name, p.department, sl.saved_at
            ORDER BY sl.saved_at DESC
        ''', (student_id,))

        saved_labs = []
        for row in c.fetchall():
            saved_labs.append({
                'id': row['id'],
                'name': row['name'],
                'pi': row['pi_name'],
                'department': row['department'],
                'description': row['description'],
                'website': row['website'],
                'openPositions': row['open_positions'],
                'savedAt': row['saved_at']
            })

        conn.close()
        return jsonify({'savedLabs': saved_labs}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/student/saved-labs/<lab_id>', methods=['POST'])
def save_lab(lab_id):
    """Save/bookmark a lab"""
    try:
        data = request.get_json()
        student_id = data.get('studentId')

        if not student_id:
            return jsonify({'error': 'Student ID required'}), 400

        conn = get_db()
        c = conn.cursor()

        # Check if already saved
        c.execute('''
            SELECT id FROM saved_labs
            WHERE student_id = ? AND lab_id = ?
        ''', (student_id, lab_id))

        if c.fetchone():
            conn.close()
            return jsonify({'message': 'Lab already saved'}), 200

        # Save lab
        saved_id = str(uuid.uuid4())
        c.execute('''
            INSERT INTO saved_labs (id, student_id, lab_id)
            VALUES (?, ?, ?)
        ''', (saved_id, student_id, lab_id))

        conn.commit()
        conn.close()

        return jsonify({'success': True, 'message': 'Lab saved successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/student/saved-labs/<lab_id>', methods=['DELETE'])
def unsave_lab(lab_id):
    """Remove saved lab"""
    try:
        student_id = request.args.get('studentId')
        if not student_id:
            return jsonify({'error': 'Student ID required'}), 400

        conn = get_db()
        c = conn.cursor()

        c.execute('''
            DELETE FROM saved_labs
            WHERE student_id = ? AND lab_id = ?
        ''', (student_id, lab_id))

        conn.commit()
        conn.close()

        return jsonify({'success': True, 'message': 'Lab removed from saved'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== Health Check ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Catalyst Research Matching API',
        'timestamp': datetime.now().isoformat()
    }), 200

# ==================== AI Matching Helper Functions ====================

def convert_to_candidate_model(application_data: Dict[str, Any]) -> Candidate:
    """Convert simple application data to AI algorithm's Candidate model"""

    # Create transcript with courses if available
    courses = []
    if 'courses' in application_data:
        for course in application_data['courses']:
            courses.append(Course(
                name=course.get('name', ''),
                grade_points=float(course.get('grade', 3.0)),
                credits=int(course.get('credits', 4))
            ))

    transcript = Transcript(
        university=application_data.get('university', 'UCLA'),
        major=application_data.get('major', ''),
        gpa=float(application_data.get('gpa', 3.0)),
        courses=courses
    )

    # Create research experiences if available
    research_exps = []
    if 'researchExperiences' in application_data:
        for exp in application_data['researchExperiences']:
            research_exps.append(ResearchExperience(
                lab_name=exp.get('labName', ''),
                description=exp.get('description', ''),
                duration_months=int(exp.get('durationMonths', 6)),
                hours_per_week=int(exp.get('hoursPerWeek', 10))
            ))

    # Create candidate
    return Candidate(
        id=application_data.get('id', str(uuid.uuid4())),
        name=application_data.get('studentName', application_data.get('fullName', '')),
        email=application_data.get('email', ''),
        transcript=transcript,
        personal_essay=application_data.get('coverLetter', application_data.get('bio', '')),
        career_goals=[application_data.get('interests', '').split(',')[0]] if application_data.get('interests') else [],
        skills=application_data.get('skills', '').split(',') if application_data.get('skills') else [],
        research_experiences=research_exps,
        experience_level=ExperienceLevel.BEGINNER  # Default for now
    )

def convert_to_lab_model(lab_data: Dict[str, Any]) -> Lab:
    """Convert simple lab data to AI algorithm's Lab model"""

    return Lab(
        id=lab_data.get('id', str(uuid.uuid4())),
        name=lab_data.get('name', lab_data.get('labName', '')),
        pi_name=lab_data.get('pi_name', lab_data.get('piName', '')),
        department=lab_data.get('department', ''),
        description=lab_data.get('description', ''),
        required_skills=lab_data.get('requirements', '').split(',') if lab_data.get('requirements') else [],
        preferred_experience_level=ExperienceLevel.BEGINNER,  # Default
        research_areas=lab_data.get('research_areas', '').split(',') if lab_data.get('research_areas') else []
    )

# ==================== AI Matching Endpoints ====================

@app.route('/api/ai/match-score', methods=['POST'])
def calculate_ai_match_score():
    """
    Calculate AI match score between a student and a lab

    Request body:
    {
        "student": {
            "studentName": "...",
            "email": "...",
            "major": "...",
            "gpa": "3.8",
            "skills": "Python, ML, Data Analysis",
            "coverLetter": "...",
            ...
        },
        "lab": {
            "name": "...",
            "department": "...",
            "description": "...",
            "requirements": "...",
            ...
        }
    }

    Returns:
    {
        "score": 85,
        "reasoning": "Strong match: ...",
        "tier": "high_priority",
        "strengths": [...],
        "gaps": [...]
    }
    """
    if not AI_MATCHING_ENABLED:
        return jsonify({
            'error': 'AI matching not available',
            'fallback': True,
            'score': 75,
            'reasoning': 'Using basic matching (AI modules not loaded)'
        }), 200

    try:
        data = request.get_json()
        student_data = data.get('student', {})
        lab_data = data.get('lab', {})

        if not student_data or not lab_data:
            return jsonify({'error': 'Student and lab data required'}), 400

        # Convert to AI model format
        candidate = convert_to_candidate_model(student_data)
        lab = convert_to_lab_model(lab_data)

        # Initialize AI algorithm with embedding system
        embedding_system = SimpleEmbedding()
        ats = LabATSAlgorithm(embedding_system)

        # Calculate match score
        result = ats.score_candidate(candidate, lab)

        # Return results
        return jsonify({
            'score': int(result.total_score),
            'reasoning': result.explanation,
            'tier': result.tier.value if hasattr(result.tier, 'value') else str(result.tier),
            'strengths': result.strengths,
            'gaps': result.gaps,
            'breakdown': {
                component.name: {
                    'score': component.score,
                    'reasoning': component.reasoning
                }
                for component in result.score_components
            } if hasattr(result, 'score_components') else {}
        }), 200

    except Exception as e:
        print(f"Error in AI matching: {e}")
        import traceback
        traceback.print_exc()

        # Return fallback simple score
        return jsonify({
            'error': str(e),
            'fallback': True,
            'score': 70,
            'reasoning': 'Error occurred, using fallback matching'
        }), 200

@app.route('/api/ai/batch-match', methods=['POST'])
def batch_match_candidates():
    """
    Calculate match scores for multiple candidates against a single lab

    Request body:
    {
        "lab": { ... },
        "candidates": [ { ... }, { ... }, ... ]
    }

    Returns:
    {
        "matches": [
            {
                "candidateId": "...",
                "candidateName": "...",
                "score": 85,
                "reasoning": "...",
                "tier": "high_priority"
            },
            ...
        ]
    }
    """
    if not AI_MATCHING_ENABLED:
        return jsonify({
            'error': 'AI matching not available'
        }), 503

    try:
        data = request.get_json()
        lab_data = data.get('lab', {})
        candidates_data = data.get('candidates', [])

        if not lab_data or not candidates_data:
            return jsonify({'error': 'Lab and candidates data required'}), 400

        # Convert lab to model
        lab = convert_to_lab_model(lab_data)

        # Initialize AI algorithm
        embedding_system = SimpleEmbedding()
        ats = LabATSAlgorithm(embedding_system)

        # Calculate scores for all candidates
        matches = []
        for candidate_data in candidates_data:
            try:
                candidate = convert_to_candidate_model(candidate_data)
                result = ats.score_candidate(candidate, lab)

                matches.append({
                    'candidateId': candidate.id,
                    'candidateName': candidate.name,
                    'candidateEmail': candidate.email,
                    'score': int(result.total_score),
                    'reasoning': result.explanation,
                    'tier': result.tier.value if hasattr(result.tier, 'value') else str(result.tier),
                    'strengths': result.strengths,
                    'gaps': result.gaps
                })
            except Exception as e:
                print(f"Error scoring candidate {candidate_data.get('id', 'unknown')}: {e}")
                continue

        # Sort by score descending
        matches.sort(key=lambda x: x['score'], reverse=True)

        return jsonify({
            'matches': matches,
            'totalProcessed': len(matches)
        }), 200

    except Exception as e:
        print(f"Error in batch matching: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/', methods=['GET'])
def index():
    """Root endpoint"""
    return jsonify({
        'service': 'Catalyst Research Lab Matching Platform',
        'version': '1.0.0',
        'aiMatching': AI_MATCHING_ENABLED,
        'endpoints': {
            'auth': {
                'signup': 'POST /api/auth/signup',
                'login': 'POST /api/auth/login'
            },
            'labs': {
                'list': 'GET /api/labs',
                'get': 'GET /api/labs/<id>',
                'create': 'POST /api/labs',
                'apply': 'POST /api/labs/<id>/apply'
            },
            'applications': {
                'list': 'GET /api/applications/<student_id>'
            },
            'ai': {
                'matchScore': 'POST /api/ai/match-score',
                'batchMatch': 'POST /api/ai/batch-match'
            }
        }
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=True)
