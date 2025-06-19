

import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

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
    const location = useLocation();
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [code, setCode] = useState('// Welcome to the collaborative editor!\n\n');

    useEffect(() => {
        const init = async () => {
            // Initialize socket connection
            socketRef.current = io(process.env.REACT_APP_SOCKET_URL || window.location.origin); // Your server URL
            
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // Listen for new users joining
            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room.`);
                    console.log(`${username} joined`);
                }
                setClients(clients);
                
                // Sync code to new user
                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    code: codeRef.current,
                    socketId,
                });
            });

            // Listen for users disconnecting
            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) => {
                    return prev.filter(client => client.socketId !== socketId);
                });
            });

            // Listen for code changes
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    setCode(code);
                    codeRef.current = code;
                }
            });
        };

        init();

        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [roomId, location.state?.username]);

    const handleErrors = (e) => {
        console.log('Socket error:', e);
        toast.error('Socket connection failed, try again later.');
        navigate('/');
    };

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        codeRef.current = newCode;
        
        // Emit code change to other users
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code: newCode,
        });
    };

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    };
    const [aiInput, setAiInput] = useState('');

    const handleAISuggestion = async () => {
    try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

        const fullPrompt = `${codeRef.current}\n\n// Instruction:\n${aiInput}`;

        const res = await fetch(`${backendUrl}/api/v1/ai/suggest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: fullPrompt }),
        });

        const data = await res.json();
        if (data.success) {
            const newCode = codeRef.current + '\n' + data.suggestion;
            setCode(newCode);
            codeRef.current = newCode;

            socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                roomId,
                code: newCode,
            });

            toast.success('AI suggestion added');
            setAiInput(''); // clear input
        } else {
            toast.error('AI failed: ' + data.message);
        }
    } catch (err) {
        console.error(err);
        toast.error('AI error occurred');
    }
};

    const leaveRoom = () => {
        navigate('/home');
    };

    if (!location.state) {
        navigate('/');
        return null;
    }

    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img className="logoImage" src="/code-sync.png" alt="logo" />
                    </div>
                    <h3>Connected</h3>
                    <div className="clientsList">
                        {clients.map((client) => (
                            <div key={client.socketId} className="client">
                                <span className="userName">{client.username}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="btn copyBtn" onClick={copyRoomId}>
                    Copy ROOM ID
                </button>
                <button className="btn leaveBtn" onClick={leaveRoom}>
                    Leave
                </button>



                <button className="btn" onClick={handleAISuggestion}>💡 Get AI Suggestion</button>



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



                <div style={{ marginTop: '10px' }}>
        <textarea
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="Describe what you want the AI to help with..."
            style={{
                width: '100%',
                height: '80px',
                padding: '10px',
                fontSize: '14px',
                fontFamily: 'monospace',
                backgroundColor: '#2e2e2e',
                color: '#eee',
                border: '1px solid #444',
                borderRadius: '4px'
            }}
        />
        <button onClick={handleAISuggestion} style={{
            marginTop: '8px',
            padding: '8px 16px',
            backgroundColor: '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        }}>
            Get AI Suggestion
        </button>
    </div>



            </div>
        </div>
    );
};

export default EditorPage;