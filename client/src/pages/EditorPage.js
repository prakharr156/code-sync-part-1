// // import React, { useEffect, useRef, useState } from 'react';
// // import { useLocation, useParams } from 'react-router-dom';
// // import Editor from '../components/Editor';
// // import { initSocket } from '../socket';
// // import ACTIONS from '../Actions';

// // const EditorPage = () => {
// //   const socketRef = useRef(null);
// //   const { roomId } = useParams();
// //   const location = useLocation();
// //   const username = location.state?.username;
// //   const [clients, setClients] = useState([]);
// //   const codeRef = useRef("");

// //   useEffect(() => {
// //     const init = async () => {
// //       socketRef.current = await initSocket();

// //       socketRef.current.emit(ACTIONS.JOIN, {
// //         roomId,
// //         username,
// //       });

// //       socketRef.current.on(ACTIONS.JOINED, ({ clients }) => {
// //         setClients(clients);
// //       });

// //       socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
// //         if (code !== null) codeRef.current = code;
// //       });
// //     };
// //     init();
// //     return () => socketRef.current.disconnect();
// //   }, []);

// //   const handleCodeChange = (code) => {
// //     codeRef.current = code;
// //     socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code });
// //   };

// //   return (
// //     <div>
// //       <h3>Room: {roomId}</h3>
// //       <Editor onChange={handleCodeChange} />
// //     </div>
// //   );
// // };

// // export default EditorPage;



// import React, { useState, useRef, useEffect } from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { io } from 'socket.io-client';
// import toast from 'react-hot-toast';

// const ACTIONS = {
//     JOIN: 'join',
//     JOINED: 'joined',
//     DISCONNECTED: 'disconnected',
//     CODE_CHANGE: 'code-change',
//     SYNC_CODE: 'sync-code',
//     LEAVE: 'leave',
// };

// const EditorPage = () => {
//     const socketRef = useRef(null);
//     const codeRef = useRef(null);
//     const location = useLocation();
//     const { roomId } = useParams();
//     const navigate = useNavigate();

//     const [clients, setClients] = useState([]);
//     const [code, setCode] = useState('// Welcome to the collaborative editor!\n\n');

//     useEffect(() => {
//         const init = async () => {
//             // Initialize socket connection
//             socketRef.current = io(process.env.REACT_APP_SOCKET_URL || window.location.origin); // Your server URL
            
//             socketRef.current.on('connect_error', (err) => handleErrors(err));
            
//             socketRef.current.emit(ACTIONS.JOIN, {
//                 roomId,
//                 username: location.state?.username,
//             });

//             // Listen for new users joining
//             socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
//                 if (username !== location.state?.username) {
//                     toast.success(`${username} joined the room.`);
//                     console.log(`${username} joined`);
//                 }
//                 setClients(clients);
                
//                 // Sync code to new user
//                 socketRef.current.emit(ACTIONS.SYNC_CODE, {
//                     code: codeRef.current,
//                     socketId,
//                 });
//             });

//             // Listen for users disconnecting
//             socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
//                 toast.success(`${username} left the room.`);
//                 setClients((prev) => {
//                     return prev.filter(client => client.socketId !== socketId);
//                 });
//             });

//             // Listen for code changes
//             socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//                 if (code !== null) {
//                     setCode(code);
//                     codeRef.current = code;
//                 }
//             });
//         };

//         init();

//         return () => {
//             socketRef.current.disconnect();
//             socketRef.current.off(ACTIONS.JOINED);
//             socketRef.current.off(ACTIONS.DISCONNECTED);
//             socketRef.current.off(ACTIONS.CODE_CHANGE);
//         };
//     }, [roomId, location.state?.username]);

//     const handleErrors = (e) => {
//         console.log('Socket error:', e);
//         toast.error('Socket connection failed, try again later.');
//         navigate('/');
//     };

//     const handleCodeChange = (newCode) => {
//         setCode(newCode);
//         codeRef.current = newCode;
        
//         // Emit code change to other users
//         socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//             roomId,
//             code: newCode,
//         });
//     };

//     const copyRoomId = async () => {
//         try {
//             await navigator.clipboard.writeText(roomId);
//             toast.success('Room ID has been copied to your clipboard');
//         } catch (err) {
//             toast.error('Could not copy the Room ID');
//             console.error(err);
//         }
//     };

//     const leaveRoom = () => {
//         navigate('/');
//     };

//     if (!location.state) {
//         navigate('/');
//         return null;
//     }

//     return (
//         <div className="mainWrap">
//             <div className="aside">
//                 <div className="asideInner">
//                     <div className="logo">
//                         <img className="logoImage" src="/code-sync.png" alt="logo" />
//                     </div>
//                     <h3>Connected</h3>
//                     <div className="clientsList">
//                         {clients.map((client) => (
//                             <div key={client.socketId} className="client">
//                                 <span className="userName">{client.username}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//                 <button className="btn copyBtn" onClick={copyRoomId}>
//                     Copy ROOM ID
//                 </button>
//                 <button className="btn leaveBtn" onClick={leaveRoom}>
//                     Leave
//                 </button>
//             </div>
//             <div className="editorWrap">
//                 <textarea
//                     value={code}
//                     onChange={(e) => handleCodeChange(e.target.value)}
//                     placeholder="Start typing your code here..."
//                     style={{
//                         width: '100%',
//                         height: '100%',
//                         border: 'none',
//                         outline: 'none',
//                         fontSize: '16px',
//                         fontFamily: 'monospace',
//                         padding: '20px',
//                         backgroundColor: '#1e1e1e',
//                         color: '#fff',
//                         resize: 'none'
//                     }}
//                 />
//             </div>
//         </div>
//     );
// };

// export default EditorPage;
// 📄 src/pages/EditorPage.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const ACTIONS = {
    JOIN: 'join',
    JOINED: 'joined',
    DISCONNECTED: 'disconnected',
    CODE_CHANGE: 'code-change',
    SYNC_CODE: 'sync-code',
    LEAVE: 'leave',
};

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [clients, setClients] = useState([]);
    const [code, setCode] = useState('// Welcome to the collaborative editor!\n\n');

    useEffect(() => {
        if (!user) return;

        const init = async () => {
            socketRef.current = io(process.env.REACT_APP_SOCKET_URL || window.location.origin);
            
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: user.name || user.email,
            });

            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== (user.name || user.email)) {
                    toast.success(`${username} joined the room.`);
                }
                setClients(clients);
                
                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    code: codeRef.current,
                    socketId,
                });
            });

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) => prev.filter(client => client.socketId !== socketId));
            });

            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    setCode(code);
                    codeRef.current = code;
                }
            });
        };

        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
                socketRef.current.off(ACTIONS.CODE_CHANGE);
            }
        };
    }, [roomId, user]);

    const handleErrors = (e) => {
        console.log('Socket error:', e);
        toast.error('Socket connection failed, try again later.');
        navigate('/home');
    };

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        codeRef.current = newCode;
        
        if (socketRef.current) {
            socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                roomId,
                code: newCode,
            });
        }
    };

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID copied to clipboard');
        } catch (err) {
            toast.error('Could not copy Room ID');
        }
    };

    const leaveRoom = () => {
        navigate('/home');
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <h3>DevRoom</h3>
                    </div>
                    <div className="userInfo">
                        <p>Welcome, {user.name || user.email}</p>
                    </div>
                    <h4>Connected Users</h4>
                    <div className="clientsList">
                        {clients.map((client) => (
                            <div key={client.socketId} className="client">
                                <span className="userName">{client.username}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="buttonGroup">
                    <button className="btn copyBtn" onClick={copyRoomId}>
                        Copy Room ID
                    </button>
                    <button className="btn leaveBtn" onClick={leaveRoom}>
                        Leave Room
                    </button>
                    <button className="btn logoutBtn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
            <div className="editorWrap">
                <textarea
                    value={code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    placeholder="Start typing your code here..."
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        outline: 'none',
                        fontSize: '16px',
                        fontFamily: 'monospace',
                        padding: '20px',
                        backgroundColor: '#1e1e1e',
                        color: '#fff',
                        resize: 'none'
                    }}
                />
            </div>
        </div>
    );
};

export default EditorPage;