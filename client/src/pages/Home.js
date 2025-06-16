
// import React, { useState , useEffect} from 'react';
// import { v4 as uuidV4 } from 'uuid';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// import '../styles/App.css';
// import axios from 'axios';






// const Home = () => {
//     const navigate = useNavigate();
    
// //   useEffect(() => {
// //     const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
// //     // const navigate = useNavigate();
// //     axios.get(`${backendUrl}/api/v1/auth/verify`, {
// //       withCredentials: true
// //     })
// //     .then(res => {
// //       console.log("User verified", res.data.user);
// //     })
// //     .catch(err => {
// //       console.error("Auth failed", err.response?.data);
// //       navigate('/login'); // redirect to login if not verified
// //     });
// //   }, []);
//     const [roomId, setRoomId] = useState('');
//     const [username, setUsername] = useState('');

//     const createNewRoom = (e) => {
//         e.preventDefault();
//         const id = uuidV4();
//         setRoomId(id);
//         toast.success('Created a new room');
//     };

//     const joinRoom = () => {
//         if (!roomId || !username) {
//             toast.error('ROOM ID & username is required');
//             return;
//         }

//         // Redirect to editor with room ID and username
//         navigate(`/editor/${roomId}`, {
//             state: {
//                 username,
//             },
//         });
//     };

//     const handleInputEnter = (e) => {
//         if (e.code === 'Enter') {
//             joinRoom();
//         }
//     };

//     return (
//         <div className="homePageWrapper">
//             <div className="formWrapper">
//                 <img
//                     className="homePageLogo"
//                     src="/code-sync.png"
//                     alt="code-sync-logo"
//                 />
//                 <h4 className="mainLabel">Collaborative Code Editor</h4>
//                 <div className="inputGroup">
//                     <input
//                         type="text"
//                         className="inputBox"
//                         placeholder="ROOM ID"
//                         onChange={(e) => setRoomId(e.target.value)}
//                         value={roomId}
//                         onKeyUp={handleInputEnter}
//                     />
//                     <input
//                         type="text"
//                         className="inputBox"
//                         placeholder="USERNAME"
//                         onChange={(e) => setUsername(e.target.value)}
//                         value={username}
//                         onKeyUp={handleInputEnter}
//                     />
//                     <button className="btn joinBtn" onClick={joinRoom}>
//                         Join Room
//                     </button>
//                     <span className="createInfo">
//                         If you don't have a room ID, create &nbsp;
//                         <a
//                             onClick={createNewRoom}
//                             href="#"
//                             className="createNewBtn"
//                         >
//                             new room
//                         </a>
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Home;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { v4 as uuidV4 } from 'uuid';

const Home = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const createNewRoom = () => {
    const id = uuidV4();
    setRoomId(id);
  };

  const joinRoom = () => {
    if (!roomId) {
      alert('Please enter a room ID');
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: { username: user?.name || user?.email }
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="homeContainer">
      <div className="userInfo">
        <h2>Welcome, {user?.name || user?.email}!</h2>
        <button onClick={handleLogout} className="logoutBtn">
          Logout
        </button>
      </div>
      
      <div className="roomSection">
        <h3>Join a Coding Room</h3>
        <div className="inputGroup">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
        
        <div className="divider">OR</div>
        
        <button onClick={createNewRoom} className="createRoomBtn">
          Create New Room
        </button>
      </div>
    </div>
  );
};

export default Home;