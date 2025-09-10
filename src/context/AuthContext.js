// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To check initial auth state

  const backendUrl = 'http://localhost:5000'; // Your backend URL

  // Check for token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // You could optionally verify the token with the backend here
      // For simplicity, we'll just set a generic user or decode client-side
      // A more robust approach would be to hit a /profile or /validate-token endpoint
      try {
        const decoded = JSON.parse(atob(token.split('.')[1])); // Basic client-side decode
        setUser({ id: decoded.id, email: decoded.email, fullName: decoded.fullName }); // Adjust based on your token payload
      } catch (error) {
        console.error("Invalid token in localStorage", error);
        localStorage.removeItem('token'); // Clear invalid token
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/users/login`, { email, password });
      localStorage.setItem('token', data.token);
      setUser({ _id: data._id, fullName: data.fullName, email: data.email }); // Set user from backend response
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (fullName, email, password) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/users/register`, { fullName, email, password });
      localStorage.setItem('token', data.token);
      setUser({ _id: data._id, fullName: data.fullName, email: data.email }); // Set user from backend response
      return { success: true };
    } catch (error) {
      console.error("Signup failed:", error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);