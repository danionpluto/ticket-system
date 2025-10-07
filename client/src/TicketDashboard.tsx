import React, { useEffect, useState } from "react";
import { getTickets, updateTicketStatus } from "./api";

type Ticket = {
  id: string;
  title: string;
  description: string;
  email: string;
  priority: string;
  department: string;
  category: string;
  tags?: string[];
  status: string;
  suggested_response?: string;
};

const TicketDashboard: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
//   filtering states
  const [filter, setFilter] = useState({ category: "", status: "", tag: "" });

  useEffect(() => {
    fetchTickets();
  }, []);

  // retrieve tickets from backend
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (err) {
      console.error("Failed to load tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  // change status of ticket
  const handleStatusChange = async (id: string, newStatus: string) => {
    const updated = tickets.map((t) =>
      t.id === id ? { ...t, status: newStatus } : t
    );
    setTickets(updated); // update optimistically !!

    try {
      await updateTicketStatus(id, newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
      await fetchTickets(); // revert on failure
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const categoryMatch = filter.category
      ? ticket.category === filter.category
      : true;
    const statusMatch = filter.status ? ticket.status === filter.status : true;
    const tagMatch = filter.tag ? ticket.tags?.includes(filter.tag) : true;
    return categoryMatch && statusMatch && tagMatch;
  });

  return (
    <div className="dashboard">
      <h2>Support Ticket Dashboard</h2>
      {loading ? (
        <p>Loading tickets</p>
      ) : (
        <div className="dashboard">
          <div className="filters">
            <h3>Filters: </h3>
            <label>
              Category:
              <select
                value={filter.category}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                <option value="">All</option>
                {[
                  ...new Set(tickets.map((t) => t.category).filter(Boolean)),
                ].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Status:
              <select
                value={filter.status}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="">All</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </label>

            <label>
              Tag:
              <select
                value={filter.tag}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, tag: e.target.value }))
                }
              >
                <option value="">All</option>
                {[...new Set(tickets.flatMap((t) => t.tags || []))].map(
                  (tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  )
                )}
              </select>
            </label>

            <button
              onClick={() => setFilter({ category: "", status: "", tag: "" })}
            >
              Reset Filters
            </button>
          </div>

          <table className="ticket-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Category</th>
                <th>Tags</th>
                <th>Priority</th>
                <th>AI Response</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.title}</td>
                  <td>{ticket.description}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.category}</td>
                  <td>{ticket.tags?.join(", ")}</td>
                  <td>{ticket.priority}</td>
                  <td>{ticket.suggested_response}</td>
                  <td>
                    <select
                      value={ticket.status}
                      onChange={(e) =>
                        handleStatusChange(ticket.id, e.target.value)
                      }
                    >
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TicketDashboard;
