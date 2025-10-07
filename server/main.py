from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4
from fastapi import HTTPException

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all for testing, would not for actual product
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tickets_db = []


class TicketCreate(BaseModel):
    title: str
    description: str
    email: str
    priority: str
    department: str
    category: str
    tags: List[str]
    suggested_response: str


class Ticket(TicketCreate):
    id: str
    status: str = "New"
    suggested_response: Optional[str] = None


class AiRequest(BaseModel):
    title: str
    description: str


class AiSuggestion(BaseModel):
    category: str
    tags: List[str]
    priority: str
    suggested_response: str


@app.get("/")
def root():
    return {"message": "AI Ticket System Backend Running"}

# getting a ticket suggestion


@app.post("/api/ai/suggest", response_model=AiSuggestion)
def ai_suggest(data: AiRequest):
    # simlating AI logic
    mock_tags = []
    if "vpn" in data.description.lower():
        category = "Networking"
        mock_tags = ["VPN", "timeout", "remote access"]
        priority = "High"
        response = "Please ensure you're on the company network and restart your VPN client. If that fails, contact IT Support at x1234."
    elif "email" in data.description.lower():
        category = "Software"
        mock_tags = ["Email", "Outlook"]
        priority = "Medium"
        response = "Try restarting your email client or check server settings. If that fails, contact IT Support at x1234."
    else:
        category = "General"
        mock_tags = ["support", "issue", "IT"]
        priority = "Low"
        response = "Thank you for reporting. A support agent will follow up shortly."

    return AiSuggestion(
        category=category,
        tags=mock_tags,
        priority=priority,
        suggested_response=response
    )

# adding a ticket


@app.post("/api/tickets", response_model=Ticket)
def create_ticket(ticket: TicketCreate):
    new_ticket = Ticket(
        **ticket.dict(),
        id=str(uuid4()),
        status="New"
    )
    tickets_db.append(new_ticket)
    return new_ticket

# listing tickets (for dashboard)


@app.get("/api/tickets", response_model=List[Ticket])
def get_tickets():
    return tickets_db

# update ticket


@app.patch("/api/tickets/{ticket_id}", response_model=Ticket)
def update_ticket(ticket_id: str, updates: dict):
    for ticket in tickets_db:
        if ticket.id == ticket_id:
            for key, value in updates.items():
                if hasattr(ticket, key):
                    setattr(ticket, key, value)
            return ticket
    raise HTTPException(status_code=404, detail="Ticket not found")
