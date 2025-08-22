import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Check if user is logged in on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    // Store token and user data
    if (userData.token) {
      localStorage.setItem('token', userData.token);
      setToken(userData.token);
    }
    
    // Store user data (without token)
    const userWithoutToken = { ...userData };
    delete userWithoutToken.token;
    localStorage.setItem('user', JSON.stringify(userWithoutToken));
    setUser(userWithoutToken);
  };

  const logout = () => {
    // Clear token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
