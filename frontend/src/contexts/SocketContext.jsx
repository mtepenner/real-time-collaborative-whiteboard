import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

// 1. Create the Context
const SocketContext = createContext(null);

// 2. Custom hook for easy access
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// 3. Provider Component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useAuth(); // Import auth state to secure the connection

  useEffect(() => {
    // Determine the backend URL (Use environment variables in production)
    // Vite uses import.meta.env instead of process.env
    const SERVER_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    // Grab the token from local storage to prove identity to the backend
    const token = localStorage.getItem('whiteboard_token');

    // Initialize the Socket connection with production-grade options
    const socketInstance = io(SERVER_URL, {
      reconnection: true,           // Automatically try to reconnect if dropped
      reconnectionAttempts: 10,     // Give up after 10 tries to save user bandwidth
      reconnectionDelay: 1000,      // Wait 1 second before first retry
      reconnectionDelayMax: 5000,   // Max wait time between retries
      auth: {
        // This is passed securely in the WebSocket handshake
        token: token 
      },
      query: {
        // Pass basic user info so the server doesn't have to decode the token just to get a name
        userId: user?.id || 'guest',
        userName: user?.name || 'Anonymous'
      }
    });

    // --- EVENT LISTENERS FOR DEBUGGING & STATE ---
    socketInstance.on('connect', () => {
      console.log(`🟢 Socket connected: ${socketInstance.id}`);
    });

    socketInstance.on('disconnect', (reason) => {
      console.warn(`🔴 Socket disconnected: ${reason}`);
      // If the server forced a disconnect (e.g., invalid token), you might want to handle it
      if (reason === 'io server disconnect') {
        // The disconnection was initiated by the server, you need to reconnect manually
        socketInstance.connect();
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('⚠️ Socket connection error:', error.message);
    });

    // Save the active instance to state so the rest of the app can use it
    setSocket(socketInstance);

    // CLEANUP: When the app unmounts or the user state completely changes, 
    // sever the connection to prevent memory leaks and ghost users on the backend.
    return () => {
      if (socketInstance) {
        socketInstance.removeAllListeners();
        socketInstance.disconnect();
      }
    };
  }, [user?.id]); // Re-run this effect if the user ID changes (e.g., they log in/out)

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
