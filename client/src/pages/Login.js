// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
//       console.log('Backend URL:', backendUrl); // For debugging
      
//       const res = await axios.post(
//         `${backendUrl}/api/v1/auth/login`, { email, password }, { withCredentials: true });
//       if (res.data.success) {
//         navigate('/home');
//       }
//     } catch (err) {
//       alert('Login failed');
//     }
//   };

//   return (
//     <div className="authForm">
//       <h2>Login</h2>
//       <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
//       <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// };

// export default Login;
// src/pages/Login.js - Enhanced version
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
      console.log('Backend URL:', backendUrl); // For debugging
      
      const res = await axios.post(
        `${backendUrl}/api/v1/auth/login`, 
        { email, password }, 
        { withCredentials: true }
      );
      
      if (res.data.success) {
        // Get redirect URL from query params or default to home
        const redirectTo = new URLSearchParams(location.search).get('redirect') || '/home';
        navigate(redirectTo);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="authForm">
      <h2>Login</h2>
      
      {error && (
        <div style={{
          color: 'red',
          marginBottom: '10px',
          padding: '10px',
          border: '1px solid red',
          borderRadius: '4px',
          backgroundColor: '#ffe6e6'
        }}>
          {error}
        </div>
      )}
      
      <input 
        type="email" 
        placeholder="Email" 
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
      />
      
      <input 
        type="password" 
        placeholder="Password" 
        value={password}
        onChange={e => setPassword(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
      />
      
      <button 
        onClick={handleLogin}
        disabled={loading || !email || !password}
        style={{
          opacity: loading ? 0.6 : 1,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
};

export default Login;