import { useEffect, useState } from 'react';
import { getBackendStatus } from './api';
import TicketForm from './TicketForm';

function App() {
  return (
  
  <div>
      <TicketForm />
  </div>
  
);
}

export default App;