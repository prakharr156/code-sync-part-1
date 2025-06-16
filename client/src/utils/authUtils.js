import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - server might be down');
    }
    
    if (error.response?.status === 502) {
      throw new Error('Server is currently unavailable (502)');
    }
    
    if (error.response?.status === 0 || !error.response) {
      throw new Error('Network error - cannot connect to server');
    }
    
    throw error;
  }
);

export const authUtils = {
  // Test server connectivity
  testConnection: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Connection test failed:', error);
      throw new Error('Cannot connect to server');
    }
  },

  // Verify if user is authenticated
  verifyAuth: async () => {
    try {
      const response = await apiClient.get('/api/v1/auth/verify');
      return response.data.success ? response.data.user : null;
    } catch (error) {
      if (error.response?.status === 401) {
        return null; // User not authenticated
      }
      throw error;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/api/v1/auth/login', {
        email,
        password
      });
      
      if (response.data.success) {
        return response.data.user;
      }
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Login failed');
    }
  },

  // Signup user
  signup: async (name, email, password) => {
    try {
      const response = await apiClient.post('/api/v1/auth/signup', {
        name,
        email,
        password
      });
      
      if (response.data.success) {
        return true;
      }
      throw new Error(response.data.message || 'Signup failed');
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Signup failed');
    }
  },

  // Logout user
  logout: async () => {
    try {
      await apiClient.post('/api/v1/auth/logout');
    } catch (error) {
      console.log('Logout error:', error);
      // Don't throw error for logout as we want to clear local state anyway
    }
  }
};