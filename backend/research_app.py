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
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Configuration
SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://catalyst-indol-beta.vercel.app')

# Database setup
DB_PATH = os.path.join(os.path.dirname(__file__), 'instance', 'catalyst.db')

def init_db():
    """Initialize the database with required tables"""
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
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Research labs table
    c.execute('''
        CREATE TABLE IF NOT EXISTS labs (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            professor_id TEXT NOT NULL,
            pi_name TEXT NOT NULL,
            department TEXT NOT NULL,
            description TEXT,
            requirements TEXT,
            commitment TEXT,
            location TEXT,
            website TEXT,
            research_areas TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (professor_id) REFERENCES users(id)
        )
    ''')

    # Applications table
    c.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            id TEXT PRIMARY KEY,
            lab_id TEXT NOT NULL,
            student_id TEXT NOT NULL,
            cover_letter TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (lab_id) REFERENCES labs(id),
            FOREIGN KEY (student_id) REFERENCES users(id)
        )
    ''')

    # Password reset tokens table
    c.execute('''
        CREATE TABLE IF NOT EXISTS password_resets (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            token TEXT UNIQUE NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    # Database initialized - no sample data
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

def send_email(to_email, subject, html_content):
    """Send email using SendGrid"""
    if not SENDGRID_API_KEY:
        print("⚠️ SendGrid API key not configured - email not sent")
        return False

    try:
        message = Mail(
            from_email='noreply@catalyst-research.com',
            to_emails=to_email,
            subject=subject,
            html_content=html_content
        )

        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)

        print(f"✓ Email sent to {to_email}: {subject}")
        return True
    except Exception as e:
        print(f"✗ Email failed: {str(e)}")
        return False

def send_welcome_email(email, full_name, user_type):
    """Send welcome email to new user"""
    subject = "Welcome to Catalyst Research!"

    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #1E293B;">Welcome to Catalyst Research!</h2>

                <p>Hi {full_name},</p>

                <p>Your account has been successfully created!</p>

                <div style="background-color: #F8FAFC; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <strong>Account Details:</strong><br>
                    Email: {email}<br>
                    Account Type: {user_type.title()}
                </div>

                <p>{'Start exploring research opportunities at UCLA!' if user_type == 'student' else 'Start posting research opportunities for UCLA students!'}</p>

                <p>
                    <a href="{FRONTEND_URL}/login"
                       style="background-color: #1E293B; color: white; padding: 12px 24px;
                              text-decoration: none; border-radius: 6px; display: inline-block;">
                        Go to Dashboard
                    </a>
                </p>

                <p style="margin-top: 30px; color: #64748B; font-size: 14px;">
                    Best,<br>
                    The Catalyst Team
                </p>
            </div>
        </body>
    </html>
    """

    return send_email(email, subject, html_content)

def send_password_reset_email(email, full_name, reset_token):
    """Send password reset email"""
    reset_url = f"{FRONTEND_URL}/reset-password?token={reset_token}"
    subject = "Reset Your Catalyst Password"

    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #1E293B;">Reset Your Password</h2>

                <p>Hi {full_name},</p>

                <p>We received a request to reset your password for your Catalyst account.</p>

                <p>Click the button below to reset your password. This link will expire in 1 hour.</p>

                <p>
                    <a href="{reset_url}"
                       style="background-color: #1E293B; color: white; padding: 12px 24px;
                              text-decoration: none; border-radius: 6px; display: inline-block;">
                        Reset Password
                    </a>
                </p>

                <p style="color: #64748B; font-size: 14px;">
                    Or copy and paste this link:<br>
                    <a href="{reset_url}">{reset_url}</a>
                </p>

                <p style="margin-top: 30px; color: #DC2626; font-size: 14px;">
                    If you didn't request this, please ignore this email. Your password will not be changed.
                </p>

                <p style="margin-top: 30px; color: #64748B; font-size: 14px;">
                    Best,<br>
                    The Catalyst Team
                </p>
            </div>
        </body>
    </html>
    """

    return send_email(email, subject, html_content)

def send_application_confirmation_email(email, full_name, lab_name):
    """Send application confirmation email"""
    subject = f"Application Submitted - {lab_name}"

    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #1E293B;">Application Submitted!</h2>

                <p>Hi {full_name},</p>

                <p>Your application to <strong>{lab_name}</strong> has been submitted successfully!</p>

                <div style="background-color: #F0FDF4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
                    <strong style="color: #059669;">✓ What's Next?</strong><br>
                    The principal investigator will review your application and contact you directly if they'd like to move forward.
                </div>

                <p>You can view your application status anytime in your dashboard.</p>

                <p>
                    <a href="{FRONTEND_URL}/student/dashboard"
                       style="background-color: #1E293B; color: white; padding: 12px 24px;
                              text-decoration: none; border-radius: 6px; display: inline-block;">
                        View Dashboard
                    </a>
                </p>

                <p style="margin-top: 30px; color: #64748B; font-size: 14px;">
                    Good luck!<br>
                    The Catalyst Team
                </p>
            </div>
        </body>
    </html>
    """

    return send_email(email, subject, html_content)

# ==================== Authentication Endpoints ====================

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """Create new user account"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('fullName')
        user_type = data.get('userType', 'student')

        if not all([email, password, full_name]):
            return jsonify({'error': 'All fields are required'}), 400

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

        c.execute('''
            INSERT INTO users (id, email, password_hash, full_name, user_type)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, email, password_hash, full_name, user_type))

        conn.commit()
        conn.close()

        # Send welcome email
        send_welcome_email(email, full_name, user_type)

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
    """Request password reset"""
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
            # Don't reveal if email exists or not
            return jsonify({'success': True, 'message': 'If an account exists, a reset link has been sent'}), 200

        # Generate reset token
        reset_token = str(uuid.uuid4())
        user_id = user['id']
        expires_at = datetime.now() + timedelta(hours=1)

        # Store reset token
        c.execute('''
            INSERT INTO password_resets (id, user_id, token, expires_at)
            VALUES (?, ?, ?, ?)
        ''', (str(uuid.uuid4()), user_id, reset_token, expires_at))

        conn.commit()
        conn.close()

        # Send reset email
        send_password_reset_email(email, user['full_name'], reset_token)

        return jsonify({
            'success': True,
            'message': 'If an account exists, a reset link has been sent'
        }), 200

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
            return jsonify({'error': 'Token and new password are required'}), 400

        conn = get_db()
        c = conn.cursor()

        # Verify token is valid and not expired
        c.execute('''
            SELECT pr.user_id, u.email, u.full_name
            FROM password_resets pr
            JOIN users u ON pr.user_id = u.id
            WHERE pr.token = ? AND pr.expires_at > ?
        ''', (token, datetime.now()))

        result = c.fetchone()

        if not result:
            conn.close()
            return jsonify({'error': 'Invalid or expired reset token'}), 400

        user_id = result['user_id']
        new_password_hash = hash_password(new_password)

        # Update password
        c.execute('''
            UPDATE users
            SET password_hash = ?
            WHERE id = ?
        ''', (new_password_hash, user_id))

        # Delete used token
        c.execute('DELETE FROM password_resets WHERE token = ?', (token,))

        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'message': 'Password reset successfully'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== Lab Endpoints ====================

@app.route('/api/labs', methods=['GET'])
def get_labs():
    """Get all research labs"""
    try:
        conn = get_db()
        c = conn.cursor()

        c.execute('''
            SELECT id, name, pi_name, department, description, requirements,
                   commitment, location, website, research_areas
            FROM labs
            ORDER BY created_at DESC
        ''')

        labs = []
        for row in c.fetchall():
            labs.append({
                'id': row['id'],
                'name': row['name'],
                'piName': row['pi_name'],
                'department': row['department'],
                'description': row['description'],
                'requirements': row['requirements'],
                'commitment': row['commitment'],
                'location': row['location'],
                'website': row['website'],
                'researchAreas': row['research_areas'].split(',') if row['research_areas'] else []
            })

        conn.close()
        return jsonify({'labs': labs}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/labs/<lab_id>', methods=['GET'])
def get_lab(lab_id):
    """Get specific lab details"""
    try:
        conn = get_db()
        c = conn.cursor()

        c.execute('''
            SELECT id, name, pi_name, department, description, requirements,
                   commitment, location, website, research_areas
            FROM labs
            WHERE id = ?
        ''', (lab_id,))

        row = c.fetchone()
        conn.close()

        if not row:
            return jsonify({'error': 'Lab not found'}), 404

        lab = {
            'id': row['id'],
            'name': row['name'],
            'piName': row['pi_name'],
            'department': row['department'],
            'description': row['description'],
            'requirements': row['requirements'],
            'commitment': row['commitment'],
            'location': row['location'],
            'website': row['website'],
            'researchAreas': row['research_areas'].split(',') if row['research_areas'] else []
        }

        return jsonify({'lab': lab}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/labs', methods=['POST'])
def create_lab():
    """Create new research lab (professors only)"""
    try:
        data = request.get_json()

        required_fields = ['name', 'professorId', 'piName', 'department', 'description']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        lab_id = str(uuid.uuid4())

        conn = get_db()
        c = conn.cursor()

        c.execute('''
            INSERT INTO labs (id, name, professor_id, pi_name, department, description,
                            requirements, commitment, location, website, research_areas)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            lab_id,
            data['name'],
            data['professorId'],
            data['piName'],
            data['department'],
            data['description'],
            data.get('requirements', ''),
            data.get('commitment', ''),
            data.get('location', ''),
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

@app.route('/api/labs/<lab_id>/apply', methods=['POST'])
def apply_to_lab(lab_id):
    """Submit application to a lab"""
    try:
        data = request.get_json()
        student_id = data.get('studentId')
        cover_letter = data.get('coverLetter')

        if not all([student_id, cover_letter]):
            return jsonify({'error': 'Student ID and cover letter are required'}), 400

        conn = get_db()
        c = conn.cursor()

        # Check if lab exists
        c.execute('SELECT id FROM labs WHERE id = ?', (lab_id,))
        if not c.fetchone():
            conn.close()
            return jsonify({'error': 'Lab not found'}), 404

        # Check if already applied
        c.execute('''
            SELECT id FROM applications
            WHERE lab_id = ? AND student_id = ?
        ''', (lab_id, student_id))

        if c.fetchone():
            conn.close()
            return jsonify({'error': 'You have already applied to this lab'}), 400

        # Create application
        application_id = str(uuid.uuid4())
        c.execute('''
            INSERT INTO applications (id, lab_id, student_id, cover_letter, status)
            VALUES (?, ?, ?, ?, ?)
        ''', (application_id, lab_id, student_id, cover_letter, 'pending'))

        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'applicationId': application_id,
            'message': 'Application submitted successfully'
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/applications/<student_id>', methods=['GET'])
def get_student_applications(student_id):
    """Get all applications for a student"""
    try:
        conn = get_db()
        c = conn.cursor()

        c.execute('''
            SELECT a.id, a.lab_id, a.cover_letter, a.status, a.created_at,
                   l.name as lab_name, l.pi_name, l.department
            FROM applications a
            JOIN labs l ON a.lab_id = l.id
            WHERE a.student_id = ?
            ORDER BY a.created_at DESC
        ''', (student_id,))

        applications = []
        for row in c.fetchall():
            applications.append({
                'id': row['id'],
                'labId': row['lab_id'],
                'labName': row['lab_name'],
                'piName': row['pi_name'],
                'department': row['department'],
                'coverLetter': row['cover_letter'],
                'status': row['status'],
                'createdAt': row['created_at']
            })

        conn.close()
        return jsonify({'applications': applications}), 200

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

@app.route('/', methods=['GET'])
def index():
    """Root endpoint"""
    return jsonify({
        'service': 'Catalyst Research Lab Matching Platform',
        'version': '1.0.0',
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
            }
        }
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=True)
