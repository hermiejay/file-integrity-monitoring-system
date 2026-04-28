"""
File Integrity Monitoring System (FIMS) - Simple Flask Backend
Simple backend API for file hashing and modification detection
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
from datetime import datetime

app = Flask(__name__)
CORS(app)

def calculate_file_hash(file_data, algorithm='sha256'):
    """
    Calculate hash of file data using specified algorithm

    Args:
        file_data: File content bytes
        algorithm: Hash algorithm ('sha256' or 'md5')

    Returns:
        Hash string
    """
    if algorithm == 'md5':
        hasher = hashlib.md5()
    else:  # default to sha256
        hasher = hashlib.sha256()

    hasher.update(file_data)
    return hasher.hexdigest()

@app.route('/hash-file', methods=['POST'])
def hash_file():
    """
    Generate SHA-256 or MD5 hash of uploaded file
    """
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Read file content
        file_content = file.read()

        if len(file_content) == 0:
            return jsonify({'error': 'File is empty'}), 400

        # Get hash algorithm from request
        algorithm = request.form.get('algorithm', 'sha256').lower()
        if algorithm not in ['sha256', 'md5']:
            algorithm = 'sha256'

        # Calculate hash
        file_hash = calculate_file_hash(file_content, algorithm)

        return jsonify({
            'hash': file_hash,
            'filename': file.filename,
            'size': len(file_content),
            'algorithm': algorithm,
            'message': f'{algorithm.upper()} hash generated successfully'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/detect-file', methods=['POST'])
def detect_file():
    """
    Compare file hashes to detect modification
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        file_name = data.get('file_name', 'Unknown')
        current_hash = data.get('current_hash', '')
        stored_hash = data.get('stored_hash', '')

        if not current_hash or not stored_hash:
            return jsonify({'error': 'Missing current_hash or stored_hash'}), 400

        # Compare hashes
        is_modified = current_hash != stored_hash

        if is_modified:
            status = 'unauthorized'
            message = f'⚠️ ALERT! File "{file_name}" has been modified. Unauthorized modification detected!'
        else:
            status = 'safe'
            message = f'✅ File "{file_name}" is safe. No unauthorized modifications detected.'

        return jsonify({
            'status': status,
            'message': message,
            'file_name': file_name,
            'is_modified': is_modified,
            'timestamp': datetime.now().isoformat()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify backend is running"""
    return jsonify({
        'status': 'healthy',
        'message': 'File Integrity Monitoring System backend is running',
        'timestamp': datetime.now().isoformat()
    }), 200

@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API information"""
    return jsonify({
        'name': 'File Integrity Monitoring System (FIMS)',
        'version': '1.0.0',
        'description': 'Simple backend API for file hashing and modification detection',
        'endpoints': {
            '/hash-file': 'POST - Generate SHA-256/MD5 hash of uploaded file',
            '/detect-file': 'POST - Compare hashes to detect modifications',
            '/health': 'GET - Health check'
        }
    }), 200

if __name__ == '__main__':
    print("=" * 60)
    print("File Integrity Monitoring System (FIMS) - Backend")
    print("=" * 60)
    print("Starting Flask server on http://localhost:5000")
    print("\n📁 FILE ENDPOINTS:")
    print("  POST /hash-file     - Generate SHA-256/MD5 hash")
    print("  POST /detect-file   - Detect file modifications")
    print("\n🔧 UTILITY:")
    print("  GET  /health        - Health check")
    print("\nFrontend: http://localhost:5173")
    print("=" * 60)

    # Run Flask development server
    app.run(debug=True, host='localhost', port=5000)

