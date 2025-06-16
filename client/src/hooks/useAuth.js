import { useState, useEffect } from 'react';
import { authUtils } from '../utils/authUtils';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Check authentication status on initial load
  useEffect(() => {
    initializeAuth();
  }, []);

  // Initialize authentication with connection test
  const initializeAuth = async () => {
    try {
      setLoading(true);
      setConnectionError(null);
      
      // First test server connection
      await authUtils.testConnection();
      
      // Then check authentication
      await checkAuth();
    } catch (error) {
      console.error('Auth initialization failed:', error);
      setConnectionError(error.message);
      setUser(null);
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  // Verify user's authentication status
  const checkAuth = async () => {
    try {
      const userData = await authUtils.verifyAuth();
      setUser(userData);
      setConnectionError(null);
      return userData;
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setConnectionError(error.message);
      throw error;
    }
  };

  // Handle user login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setConnectionError(null);
      
      // Perform login request
      await authUtils.login(email, password);
      
      // Immediately verify authentication to ensure sync
      const verifiedUser = await checkAuth();
      
      return verifiedUser;
    } catch (error) {
      console.error('Login failed:', error);
      setUser(null);
      setConnectionError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle user signup
  const signup = async (name, email, password) => {
    try {
      setLoading(true);
      setConnectionError(null);
      
      await authUtils.signup(name, email, password);
      
      // Auto-login after signup
      return await login(email, password);
    } catch (error) {
      console.error('Signup failed:', error);
      setConnectionError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle user logout
  const logout = async () => {
    try {
      setLoading(true);
      await authUtils.logout();
      setUser(null);
      setConnectionError(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state even if logout request fails
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Retry connection
  const retryConnection = async () => {
    await initializeAuth();
  };

  return { 
    user, 
    login, 
    signup, 
    logout, 
    loading, 
    authChecked,
    connectionError,
    checkAuth,
    retryConnection
  };
};