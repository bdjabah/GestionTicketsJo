import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { PanierProvider } from './context/PanierContext.jsx';
import { TicketEditProvider } from './context/TicketEditContext';
import { AuthProvider } from './context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <PanierProvider>
        <TicketEditProvider>
          <App />
        </TicketEditProvider>
      </PanierProvider>
    </AuthProvider>
  </React.StrictMode>
);