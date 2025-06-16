// import axios from 'axios';

// const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

// export const authUtils = {
//   // Verify if user is authenticated
//   verifyAuth: async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/api/v1/auth/verify`, {
//         withCredentials: true
//       });
//       return response.data.success ? response.data.user : null;
//     } catch (error) {
//       return null;
//     }
//   },

//   // Login user
//   login: async (email, password) => {
//     try {
//       const response = await axios.post(
//         `${backendUrl}/api/v1/auth/login`,
//         { email, password },
//         { withCredentials: true }
//       );
//       if (response.data.success) {
//         return response.data.user;
//       }
//       throw new Error(response.data.message || 'Login failed');
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Login failed');
//     }
//   },

//   // Signup user
//   signup: async (name, email, password) => {
//     try {
//       const response = await axios.post(
//         `${backendUrl}/api/v1/auth/signup`,
//         { name, email, password },
//         { withCredentials: true }
//       );
//       if (response.data.success) {
//         return true;
//       }
//       throw new Error(response.data.message || 'Signup failed');
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Signup failed');
//     }
//   },

//   // Logout user
//   logout: async () => {
//     try {
//       await axios.post(`${backendUrl}/api/v1/auth/logout`, {}, {
//         withCredentials: true
//       });
//     } catch (error) {
//       console.log('Logout error:', error);
//     }
//   }
// };
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

// Create axios instance with default config
const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const authUtils = {
  /**
   * Verify if user is authenticated
   * @returns {Promise<object|null>} User object if authenticated, null otherwise
   */
  // Enhanced verifyAuth function
verifyAuth: async () => {
  try {
    const response = await api.get('/api/v1/auth/verify');
    
    if (response.status === 401) {
      // Clear any invalid tokens
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      return null;
    }
    
    if (!response.data?.success) {
      throw new Error('Verification failed');
    }
    
    return response.data.user;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
},

  /**
   * Login user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<object>} User data
   * @throws {Error} If login fails
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/api/v1/auth/login', { email, password });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Authentication failed');
      }
      
      // Validate response contains user data
      if (!response.data.user) {
        throw new Error('Invalid server response: missing user data');
      }
      
      return response.data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Login failed. Please try again.'
      );
    }
  },

  /**
   * Signup new user
   * @param {string} name 
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<boolean>} True if successful
   * @throws {Error} If signup fails
   */
  signup: async (name, email, password) => {
    try {
      const response = await api.post('/api/v1/auth/signup', { name, email, password });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(
        error.response?.data?.message || 
        'Registration failed. Please try different credentials.'
      );
    }
  },

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      await api.post('/api/v1/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, we should proceed as if logged out
    }
  },

  /**
   * Utility to extract error message from any error object
   */
  getErrorMessage: (error) => {
    return error.response?.data?.message || 
           error.message || 
           'An unexpected error occurred';
  }
};