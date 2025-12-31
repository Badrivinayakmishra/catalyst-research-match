"""
Catalyst Research Lab Matching Platform - Backend API
Flask-based REST API for connecting UCLA students with research opportunities
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
import uuid
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

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

    # Insert sample data if tables are empty
    c.execute('SELECT COUNT(*) FROM labs')
    if c.fetchone()[0] == 0:
        # Create a sample professor
        prof_id = str(uuid.uuid4())
        c.execute('''
            INSERT INTO users (id, email, password_hash, full_name, user_type)
            VALUES (?, ?, ?, ?, ?)
        ''', (prof_id, 'shahan@ucla.edu', hashlib.sha256('password'.encode()).hexdigest(),
              'Dr. Shahan', 'professor'))

        # Create sample labs
        sample_labs = [
            {
                'id': str(uuid.uuid4()),
                'name': 'Shahan Lab',
                'professor_id': prof_id,
                'pi_name': 'Dr Shahan',
                'department': 'Molecular Biology',
                'description': 'Our lab focuses on molecular mechanisms of gene regulation and cellular signaling pathways. We use cutting-edge techniques including CRISPR gene editing, single-cell RNA sequencing, and advanced microscopy to understand how cells make decisions.',
                'requirements': 'Strong background in molecular biology, lab experience preferred',
                'commitment': '10-15 hours/week',
                'location': 'Life Sciences Building 3rd Floor',
                'website': 'https://www.lifesci.ucla.edu/mcdb-shahan/',
                'research_areas': 'Research,Science,Molecular Biology'
            },
            {
                'id': str(uuid.uuid4()),
                'name': 'Chen Lab - Machine Learning for Healthcare',
                'professor_id': prof_id,
                'pi_name': 'Dr. Sarah Chen',
                'department': 'Computer Science',
                'description': 'Research on applying deep learning models to predict patient outcomes and optimize treatment plans.',
                'requirements': 'Python programming, Calculus and Linear Algebra, Interest in healthcare applications',
                'commitment': '10-15 hours/week',
                'location': 'Boelter Hall 4532',
                'website': 'https://cs.ucla.edu',
                'research_areas': 'Machine Learning,Healthcare,AI'
            },
            {
                'id': str(uuid.uuid4()),
                'name': 'Martinez Lab - Sustainable Energy Materials',
                'professor_id': prof_id,
                'pi_name': 'Dr. James Martinez',
                'department': 'Materials Science',
                'description': 'Developing novel materials for solar cells and energy storage systems to address climate change.',
                'requirements': 'Chemistry background, Lab experience preferred, Commitment to sustainability',
                'commitment': '12-20 hours/week',
                'location': 'Engineering VI 289',
                'website': 'https://engineering.ucla.edu',
                'research_areas': 'Materials Science,Energy,Sustainability'
            }
        ]

        for lab in sample_labs:
            c.execute('''
                INSERT INTO labs (id, name, professor_id, pi_name, department, description,
                                requirements, commitment, location, website, research_areas)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (lab['id'], lab['name'], lab['professor_id'], lab['pi_name'], lab['department'],
                  lab['description'], lab['requirements'], lab['commitment'], lab['location'],
                  lab['website'], lab['research_areas']))

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
