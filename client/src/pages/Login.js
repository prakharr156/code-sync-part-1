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
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, connectionError, retryConnection } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/home');
    } catch (error) {
      setError(error.message);
    }
    
    setLoading(false);
  };

  const handleRetryConnection = async () => {
    try {
      await retryConnection();
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  // Show connection error if server is unreachable
  if (connectionError) {
    return (
      <div className="authForm">
        <h2>Connection Error</h2>
        <div className="error" style={{color: 'red', margin: '10px 0', textAlign: 'center'}}>
          <p>Cannot connect to server:</p>
          <p>{connectionError}</p>
          <button 
            onClick={handleRetryConnection}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="authForm">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          required 
        />
        {error && <div className="error" style={{color: 'red', margin: '10px 0'}}>{error}</div>}
        <button type="submit" disabled={loading} >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;