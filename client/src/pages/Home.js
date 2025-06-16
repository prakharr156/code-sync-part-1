// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import '../styles/App.css';

// const Home = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const loginHandler = async () => {
//     try {
//       const res = await axios.post('http://localhost:4000/api/v1/auth/login', { email, password }, { withCredentials: true });
//       localStorage.setItem('token', res.data.token);
//       localStorage.setItem('role', res.data.user.role);
//       navigate('/dashboard');
//     } catch (err) {
//       alert(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="authPageWrapper">
//       <div className="authFormWrapper">
//         <h2 className="authTitle">Login to Collaborative Editor</h2>
//         <form className="authForm">
//           <input 
//             type="email" 
//             placeholder="Email" 
//             value={email} 
//             onChange={e => setEmail(e.target.value)}
//             className="inputBox"
//           />
//           <input 
//             type="password" 
//             placeholder="Password" 
//             value={password} 
//             onChange={e => setPassword(e.target.value)}
//             className="inputBox"
//           />
//           <button 
//             type="button"
//             onClick={loginHandler}
//             className="btn authBtn"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Home;
import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';
import axios from 'axios';



const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
      
      await axios.post(
        `${backendUrl}/api/v1/auth/logout`,
        {},
        { withCredentials: true }
      );
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on backend, redirect to login
      navigate('/login');
    }
  };

  return (
    <button 
      onClick={handleLogout}
      style={{
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Logout
    </button>
  );
};



const Home = () => {
    const navigate = useNavigate();
    
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('ROOM ID & username is required');
            return;
        }

        // Redirect to editor with room ID and username
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };

    return (
        <div className="homePageWrapper">
            <div className="formWrapper">
                <img
                    className="homePageLogo"
                    src="/code-sync.png"
                    alt="code-sync-logo"
                />
                <h4 className="mainLabel">Collaborative Code Editor</h4>
                <div className="inputGroup">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="ROOM ID"
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                        onKeyUp={handleInputEnter}
                    />
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="USERNAME"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        onKeyUp={handleInputEnter}
                    />
                    <button className="btn joinBtn" onClick={joinRoom}>
                        Join Room
                    </button>
                    <span className="createInfo">
                        If you don't have a room ID, create &nbsp;
                        <a
                            onClick={createNewRoom}
                            href="#"
                            className="createNewBtn"
                        >
                            new room
                        </a>
                    </span>



                    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
        <h1>Welcome to Home</h1>
        <LogoutButton />
      </header>



                </div>
            </div>
        </div>
    );
};

export default Home;