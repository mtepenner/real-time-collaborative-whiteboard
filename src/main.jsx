import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Import global styles (Tailwind directives and custom CSS)
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode helps highlight potential problems in an application during development.
  // Note: It causes components to render twice in development mode, which is normal.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
