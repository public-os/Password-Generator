# Password Generator [React + Flask]

A full-stack password generator with a React (Vite) frontend and Python Flask backend.

## Setup & Run

### 1. Backend (Flask)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
# Runs on http://localhost:5000
```

### 2. Frontend (React + Vite)

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# Runs on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## API

`POST /api/generate`

**Request body:**
```json
{
  "length": 16,
  "uppercase": true,
  "lowercase": true,
  "numbers": true,
  "symbols": false
}
```

**Response:**
```json
{
  "password": "aB3xKm9Qr2Lp5nWv",
  "strength": "Strong",
  "length": 16
}
```

## Features
- Cryptographically secure password generation (`secrets` module)
- Length control (6–64 characters)
- Toggle: Uppercase, Lowercase, Numbers, Symbols
- Strength meter (7 levels)
- Copy to clipboard
- Responsive design
