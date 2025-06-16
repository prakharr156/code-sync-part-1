import { useState, useEffect } from 'react';
import { authUtils } from '../utils/authUtils';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const userData = await authUtils.verifyAuth();
    setUser(userData);
    setLoading(false);
  };

  const login = async (email, password) => {
    const userData = await authUtils.login(email, password);
    setUser(userData);
    return userData;
  };

  const signup = async (name, email, password) => {
    return await authUtils.signup(name, email, password);
  };

  const logout = async () => {
    await authUtils.logout();
    setUser(null);
  };

  return { user, login, signup, logout, loading, checkAuth };
};