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


import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from query param
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/home';

  const handleLogin = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

      const res = await axios.post(
        `${backendUrl}/api/v1/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Redirect to original page or home
        navigate(redirectPath);
      } else {
        alert(res.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed. Check email or password.');
    }
  };

  return (
    <div className="authForm">
      <h2>Login</h2>
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
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
