import React, { useState } from 'react';
import TicketForm from './TicketForm';
import TicketDashboard from './TicketDashboard';

export default function App() {
  const [view, setView] = useState<'form' | 'dashboard'>('form');

  return (
    <div className="app-container">
      <header className="app-header">
        <nav className="nav-buttons">
          <button
            className={view === 'form' ? 'nav-button active' : 'nav-button'}
            onClick={() => setView('form')}
          >
            Submit Ticket
          </button>
          <button
            className={view === 'dashboard' ? 'nav-button active' : 'nav-button'}
            onClick={() => setView('dashboard')}
          >
            View Dashboard
          </button>
        </nav>
      </header>

      <main>
        {view === 'form' ? <TicketForm /> : <TicketDashboard />}
      </main>
    </div>
  );
}

