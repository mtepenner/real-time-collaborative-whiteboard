import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 3. Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- INITIAL SESSION CHECK ---
  const verifySession = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // ⚠️ PRODUCTION CODE GOES HERE:
      // const response = await fetch('/api/auth/me', {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // });
      // if (!response.ok) throw new Error('Session expired');
      // const userData = await response.json();
      
      // --- MOCK IMPLEMENTATION ---
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network latency
      const token = localStorage.getItem('whiteboard_token');
      const savedUser = localStorage.getItem('whiteboard_user');
      
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error("Session verification failed:", err);
      setUser(null);
      localStorage.removeItem('whiteboard_token');
      localStorage.removeItem('whiteboard_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run the session check once when the app loads
  useEffect(() => {
    verifySession();
  }, [verifySession]);

  // --- LOGIN ---
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      // ⚠️ PRODUCTION CODE GOES HERE:
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // if (!response.ok) throw new Error('Invalid credentials');
      // const { token, user } = await response.json();
      
      // --- MOCK IMPLEMENTATION ---
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (password === 'fail') throw new Error('Invalid username or password'); // Way to test errors
      
      const mockUser = {
        id: Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0] || 'User',
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };
      
      localStorage.setItem('whiteboard_token', 'mock_jwt_token_12345');
      localStorage.setItem('whiteboard_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // --- REGISTER ---
  const register = async (name, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      // ⚠️ PRODUCTION CODE GOES HERE:
      // const response = await fetch('/api/auth/register', { ... });
      
      // --- MOCK IMPLEMENTATION ---
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // After successful registration, automatically log them in
      return await login(email, password);
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGOUT ---
  const logout = () => {
    // ⚠️ PRODUCTION: You might also want to notify the backend to invalidate the token
    localStorage.removeItem('whiteboard_token');
    localStorage.removeItem('whiteboard_user');
    setUser(null);
    setError(null);
  };

  // The state and methods exposed to the rest of the application
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError: () => setError(null) // Utility to clear errors from UI
  };

  return (
    <AuthContext.Provider value={value}>
      {/* We only block rendering if we are doing the INITIAL load check. 
          We don't want the screen to go blank during a standard login request. */}
      {!isLoading && user === null && !error ? children : children}
    </AuthContext.Provider>
  );
};
