// import { useState, useEffect } from 'react';
// import { authUtils } from '../utils/authUtils';

// export const useAuth = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = async () => {
//     const userData = await authUtils.verifyAuth();
//     setUser(userData);
//     setLoading(false);
//   };

//   const login = async (email, password) => {
//     const userData = await authUtils.login(email, password);
//     // Immediately verify to ensure sync
//     const verifiedUser = await checkAuth(); 
//     return verifiedUser;
//   };

//   const signup = async (name, email, password) => {
//     return await authUtils.signup(name, email, password);
//   };

//   const logout = async () => {
//     await authUtils.logout();
//     setUser(null);
//   };

//   return { user, login, signup, logout, loading, checkAuth };
// };
import { useState, useEffect } from 'react';
import { authUtils } from '../utils/authUtils';

export const useAuth = () => {
  // State for user data and loading status
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Check authentication status on initial load
  useEffect(() => {
    checkAuth();
  }, []);

  // Verify user's authentication status
  const checkAuth = async () => {
    try {
      setLoading(true);
      const userData = await authUtils.verifyAuth();
      setUser(userData);
      return userData;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  // Handle user login
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // 1. Perform login request
      await authUtils.login(email, password);
      
      // 2. Immediately verify authentication to ensure sync
      const verifiedUser = await checkAuth();
      
      // 3. Return the verified user data
      return verifiedUser;
    } catch (error) {
      // Clear user state on failed login
      setUser(null);
      
      // Re-throw the error for components to handle
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle user signup
  const signup = async (name, email, password) => {
    try {
      setLoading(true);
      await authUtils.signup(name, email, password);
      
      // Optional: Auto-login after signup
      return await login(email, password);
    } catch (error) {
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
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { 
    user, 
    login, 
    signup, 
    logout, 
    loading, 
    authChecked,
    checkAuth 
  };
};