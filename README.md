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


### Assumptions : !. For the priority, I am assuming that if there is no priority given, the ai priority applies. If there is priority given, then that priority takes precedence over ai generated priority unless "use suggestion" is clicked. 2. When filtering through tags, I am assuming the filters take tags from existing tickets as the options, not a predetermined set of tags. 3. I am assuming I do not have to check for valid email inputs.