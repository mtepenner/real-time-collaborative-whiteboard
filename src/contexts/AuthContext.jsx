import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create a custom hook for easy access to this context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 3. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for an existing session when the app first loads
  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        // In a real app, you would make an API call here to check for a valid session/token
        // Example: const response = await fetch('/api/auth/me');
        // const userData = await response.json();
        
        // Simulating a network request delay for demonstration
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simulated check: Look for a mock token in localStorage
        const token = localStorage.getItem('whiteboard_token');
        if (token) {
          // Rehydrate the user state
          setUser({
            id: 'user_123',
            name: 'Guest Designer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
          });
        }
      } catch (error) {
        console.error("Failed to verify authentication", error);
        setUser(null);
      } finally {
        setIsLoading(false); // App is ready to render, whether logged in or not
      }
    };

    checkLoggedInUser();
  }, []);

  // Login function
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      // In a real app: Send credentials to your backend
      // const response = await fetch('/api/auth/login', { ... });
      
      // Simulated successful login
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: credentials.username || 'New User',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.username}`,
      };
      
      localStorage.setItem('whiteboard_token', 'mock_jwt_token_here');
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // In a real app: Tell the backend to destroy the session cookie/token
    localStorage.removeItem('whiteboard_token');
    setUser(null);
  };

  // The value object contains everything we want to make available globally
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
