import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

export const authUtils = {
  // Verify if user is authenticated
  verifyAuth: async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/auth/verify`, {
        withCredentials: true
      });
      return response.data.success ? response.data.user : null;
    } catch (error) {
      return null;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (response.data.success) {
        return response.data.user;
      }
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Signup user
  signup: async (name, email, password) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      if (response.data.success) {
        return true;
      }
      throw new Error(response.data.message || 'Signup failed');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  },

  // Logout user
  logout: async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/auth/logout`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.log('Logout error:', error);
    }
  }
};