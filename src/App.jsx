import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Board from './pages/Board';

function App() {
  return (
    /* 1. AuthProvider is the outermost layer so the Socket connection 
         (and every page) can know if the user is logged in.
    */
    <AuthProvider>
      {/* 2. SocketProvider initializes the connection to your Node.js backend.
      */}
      <SocketProvider>
        {/* 3. Router handles the URL paths and component rendering.
        */}
        <Router>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<Home />} />
            
            {/* Protected User Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* The core collaborative workspace */}
            <Route path="/board/:boardId" element={<Board />} />
            
            {/* Catch-all: If a user types a random URL, send them back home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
