import React, { createContext, useState } from 'react';
import { AuthService } from '../services/AuthService';

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error('Error loading saved user:', error);
      }
    }
    return null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('currentUser') !== null;
  });

  const login = (username, password) => {
    const result = AuthService.login(username, password);
    
    if (result.success) {
      setCurrentUser(result.user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      return { success: true, user: result.user };
    }
    
    return result;
  };

  const register = (userData) => {
    const result = AuthService.register(userData);
    
    if (result.success) {
      setCurrentUser(result.user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      return { success: true, user: result.user, isFirstUser: result.isFirstUser };
    }
    
    return result;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const hasUsers = () => {
    return AuthService.hasUsers();
  };

  const isAdmin = () => {
    return AuthService.isAdmin(currentUser);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        register,
        logout,
        hasUsers,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
