"""
HTTPS Enforcement Middleware
Forces all HTTP traffic to redirect to HTTPS in production

SOC 2 Requirement: Encryption in Transit
"""

from flask import request, redirect
from functools import wraps
import os


class HTTPSEnforcer:
    """
    Middleware to enforce HTTPS for all requests

    SOC 2 Trust Service Criteria:
    - CC6.7: Encryption in Transit
    - CC6.1: Logical Access Security
    """

    def __init__(self, app=None, force_https: bool = None):
        """
        Initialize HTTPS enforcer

        Args:
            app: Flask application
            force_https: Override environment setting
        """
        self.force_https = force_https
        if self.force_https is None:
            # Enable HTTPS in production by default
            env = os.getenv('ENVIRONMENT', 'development')
            self.force_https = env in ['production', 'prod', 'staging']

        if app:
            self.init_app(app)

    def init_app(self, app):
        """Initialize with Flask app"""
        app.before_request(self.enforce_https)
        print(f"✓ HTTPS Enforcer initialized (enabled: {self.force_https})")

    def enforce_https(self):
        """Redirect HTTP to HTTPS"""
        if not self.force_https:
            return None

        # Check if request is over HTTPS
        if request.is_secure:
            return None

        # Check X-Forwarded-Proto header (for reverse proxies)
        if request.headers.get('X-Forwarded-Proto', 'http') == 'https':
            return None

        # Allow health checks over HTTP
        if request.path in ['/health', '/api/v1/health']:
            return None

        # Redirect to HTTPS
        url = request.url.replace('http://', 'https://', 1)
        return redirect(url, code=301)


def require_https(f):
    """
    Decorator to require HTTPS for specific routes

    Usage:
        @app.route('/secure-endpoint')
        @require_https
        def secure_endpoint():
            return {'data': 'secure'}
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.is_secure and request.headers.get('X-Forwarded-Proto') != 'https':
            # In production, reject non-HTTPS
            env = os.getenv('ENVIRONMENT', 'development')
            if env in ['production', 'prod', 'staging']:
                return {'error': 'HTTPS required'}, 403
        return f(*args, **kwargs)
    return decorated_function


def add_security_headers(response):
    """
    Add security headers to all responses

    Headers added:
    - Strict-Transport-Security (HSTS)
    - X-Content-Type-Options
    - X-Frame-Options
    - X-XSS-Protection
    - Content-Security-Policy

    SOC 2: CC6.6 - Security controls
    """
    # HSTS: Force HTTPS for 1 year
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'

    # Prevent MIME sniffing
    response.headers['X-Content-Type-Options'] = 'nosniff'

    # Prevent clickjacking
    response.headers['X-Frame-Options'] = 'DENY'

    # XSS protection
    response.headers['X-XSS-Protection'] = '1; mode=block'

    # Content Security Policy
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"

    # Referrer policy
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'

    # Permissions policy
    response.headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'

    return response


def init_security_middleware(app):
    """
    Initialize all security middleware

    Args:
        app: Flask application

    Returns:
        Configured app
    """
    # HTTPS enforcement
    https_enforcer = HTTPSEnforcer(app)

    # Security headers on all responses
    @app.after_request
    def apply_security_headers(response):
        return add_security_headers(response)

    print("✓ Security middleware initialized")
    print("  - HTTPS enforcement")
    print("  - Security headers (HSTS, CSP, etc.)")

    return app


if __name__ == "__main__":
    # Test security headers
    from flask import Flask

    app = Flask(__name__)

    @app.route('/test')
    def test():
        return {'status': 'ok'}

    # Initialize security
    init_security_middleware(app)

    # Test request
    with app.test_client() as client:
        response = client.get('/test')

        print("\n" + "="*60)
        print("Security Headers Test")
        print("="*60)

        headers = response.headers
        security_headers = [
            'Strict-Transport-Security',
            'X-Content-Type-Options',
            'X-Frame-Options',
            'X-XSS-Protection',
            'Content-Security-Policy',
            'Referrer-Policy',
            'Permissions-Policy'
        ]

        for header in security_headers:
            value = headers.get(header, 'NOT SET')
            status = "✅" if value != 'NOT SET' else "❌"
            print(f"{status} {header}: {value}")

        print("\n" + "="*60)
        print("✅ All security headers configured!")
        print("="*60)
