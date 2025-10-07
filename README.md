# ticket-system

## Getting Started

### Backend
```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

### Frontend: in another terminal window...
cd client
touch .env

in .env, set VITE_APP_URL to the URL given when you ran "uvicorn main:app --reload"

### Note about the CORS Configuration: To make the frontend and backend work together during development and testing, CORS is configured to allow requests from all origins (`allow_origins=["*"]`).This safe for development and demo purposes but should be restricted in production environments.
