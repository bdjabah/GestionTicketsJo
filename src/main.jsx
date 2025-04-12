import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { PanierProvider } from './context/PanierContext.jsx';
import { TicketEditProvider } from './context/TicketEditContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PanierProvider>
      <TicketEditProvider>
        <App />
      </TicketEditProvider>
    </PanierProvider>

  </React.StrictMode>
);