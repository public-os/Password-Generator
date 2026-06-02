from flask import Flask, request, jsonify
from flask_cors import CORS
import secrets
import string

app = Flask(__name__)
CORS(app)

@app.route('/api/generate', methods=['POST'])
def generate_password():
    data = request.get_json()

    length = int(data.get('length', 16))
    use_upper = data.get('uppercase', True)
    use_lower = data.get('lowercase', True)
    use_numbers = data.get('numbers', True)
    use_symbols = data.get('symbols', False)

    length = max(6, min(64, length))

    pool = ''
    guaranteed = []

    if use_upper:
        pool += string.ascii_uppercase
        guaranteed.append(secrets.choice(string.ascii_uppercase))
    if use_lower:
        pool += string.ascii_lowercase
        guaranteed.append(secrets.choice(string.ascii_lowercase))
    if use_numbers:
        pool += string.digits
        guaranteed.append(secrets.choice(string.digits))
    if use_symbols:
        symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
        pool += symbols
        guaranteed.append(secrets.choice(symbols))

    if not pool:
        return jsonify({'error': 'Select at least one character type'}), 400

    remaining = [secrets.choice(pool) for _ in range(length - len(guaranteed))]
    password_list = guaranteed + remaining
    secrets.SystemRandom().shuffle(password_list)
    password = ''.join(password_list)

    # Calculate strength
    score = 0
    if length >= 8: score += 1
    if length >= 12: score += 1
    if length >= 16: score += 1
    if length >= 24: score += 1
    active_types = sum([use_upper, use_lower, use_numbers, use_symbols])
    if active_types >= 2: score += 1
    if active_types >= 3: score += 1
    if active_types >= 4: score += 1

    levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong', 'Excellent']
    strength = levels[min(score, len(levels) - 1)]

    return jsonify({'password': password, 'strength': strength, 'length': length})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
