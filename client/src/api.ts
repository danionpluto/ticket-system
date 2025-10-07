const BASE_URL = import.meta.env.VITE_API_URL;

export async function getBackendStatus() {
  const res = await fetch(`${BASE_URL}/`);
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export type AiSuggestion = {
  category: string;
  tags: string[];
  priority: string;
  suggested_response: string;
};

export type TicketCreateData = {
  title: string;
  description: string;
  email: string;
  priority?: string;
  department?: string;
  category?: string;
  tags?: string[];
  suggested_response: string;
  
};

// logic for getting ai suggestions, submitting, and updating tickets using ai suggestions
export async function getAiSuggestions(title: string, description: string): Promise<AiSuggestion> {
  const res = await fetch(`${BASE_URL}/api/ai/suggest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) throw new Error('Failed to get AI suggestions');
  return res.json();
}

export async function createTicket(ticketData: TicketCreateData) {
  const res = await fetch(`${BASE_URL}/api/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketData),
  });
  if (!res.ok) throw new Error('Failed to create ticket');
  return res.json();
}

export async function updateTicket(ticketId: string, updates: Partial<TicketCreateData>) {
  const res = await fetch(`${BASE_URL}/api/tickets/${ticketId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update ticket');
  return res.json();
}

// logic for getting and updating tickets for dashboard
export async function getTickets() {
  const res = await fetch(`${BASE_URL}/api/tickets`);
  if (!res.ok) throw new Error('Failed to fetch tickets');
  return res.json();
}

export async function updateTicketStatus(id: string, status: string) {
  const res = await fetch(`${BASE_URL}/api/tickets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

