import React, { useState } from "react";
import { getAiSuggestions, createTicket, updateTicket } from "./api";
import type { AiSuggestion } from "./api";

export default function TicketForm() {
  const [ticketId, setTicketId] = useState<string | null>(null);

  // form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [priority, setPriority] = useState("");
  const [department, setDepartment] = useState("");

  // ai suggestions states
  const [aiSuggestion, setAiSuggestion] = useState<AiSuggestion | null>(null);
  const [aiSuggestionText, setAiSuggestionText] = useState("");
  const [aiCategory, setAiCategory] = useState("");
  const [aiTags, setAiTags] = useState<string[]>([]);
  const [aiPriority, setAiPriority] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsArray = e.target.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setAiTags(tagsArray);
  };

  // generate ai suggestions and save ticket for support dashboard
  const generateSuggestionsAndSave = async () => {
    if (!title || !description || !email) {
      setError("Please provide Title, Description, and Email.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // first, try to get AI suggestions
      const aiData = await getAiSuggestions(title, description); // getAiSuggestion returns a promise
      console.log("AI Suggestion from backend:", aiData);
      setAiSuggestion(aiData);
      setAiSuggestionText(aiData.suggested_response);
      setAiCategory(aiData.category);
      setAiTags(aiData.tags);
      setAiPriority(aiData.priority);

      // then, save the ticket using AI suggestions
      const ticketToSave = {
        title,
        description,
        email,
        priority: priority || aiData.priority,
        department,
        category: aiData.category,
        tags: aiData.tags,
        suggested_response: aiData.suggested_response,
      };

      const savedTicket = await createTicket(ticketToSave);

      console.log("Ticket saved:", savedTicket);

      setTicketId(savedTicket.id);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // use ai suggestion button --> assuming this means clicking it will save to ticket dashboard/list
  const useSuggestion = async () => {
    if (!aiSuggestion || !ticketId) return;

    // Update backend
    try {
      await updateTicket(ticketId, {
        priority: aiSuggestion.priority,
        category: aiSuggestion.category,
        tags: aiSuggestion.tags,
        suggested_response: aiSuggestion.suggested_response,
      });

      console.log("Ticket saved:");
    } catch (err) {
      console.error("Failed to update ticket with AI suggestion:", err);
    }
  };

  return (
    <div
      className={`ticket-form-wrapper ${aiSuggestion ? "with-suggestion" : ""}`}
    >
      <div className="ticket-form">
        <h2 className="form-heading">Submit a Support Ticket</h2>

        <label className="form-label">
          Title <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
          />
        </label>

        <label className="form-label">
          Description <br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="form-input"
          />
        </label>

        <label className="form-label">
          Email <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
        </label>

        <label className="form-label">
          Priority (optional) <br />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="form-input"
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <label className="form-label">
          Department <br />
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="form-input"
          />
        </label>

        {/* ONLY show submit button if suggestion doesn't exist */}
        {!aiSuggestion && (
          <button
            onClick={generateSuggestionsAndSave}
            disabled={loading}
            className={`form-button ${loading ? "disabled" : ""}`}
          >
            {loading
              ? "Generating & Saving..."
              : "Generate AI Suggestions & Save Ticket"}
          </button>
        )}

        {error && <p className="form-error">{error}</p>}
      </div>

      {/* AI SUGGESTION BOX */}
      {aiSuggestion && (
        <div className="ai-suggestion-box">
          <h3>AI Suggestions (editable)</h3>

          <label className="form-label">
            Category <br />
            <input
              type="text"
              value={aiCategory}
              onChange={(e) => setAiCategory(e.target.value)}
              className="form-input"
            />
          </label>

          <label className="form-label">
            Tags (comma separated) <br />
            <input
              type="text"
              value={aiTags.join(", ")}
              onChange={onTagsChange}
              className="form-input"
            />
          </label>

          <label className="form-label">
            Priority <br />
            <input
              type="text"
              value={aiPriority}
              onChange={(e) => setAiPriority(e.target.value)}
              className="form-input"
            />
          </label>

          <button onClick={useSuggestion} className="use-suggestion-button">
            Use Suggestion
          </button>

          <div className="ai-response">
            <strong>Suggested AI Response:</strong>
            <p>{aiSuggestion.suggested_response}</p>
          </div>
        </div>
      )}
    </div>
  );
}
