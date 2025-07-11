import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Users, UserPlus, MessageCircle, Eye, Edit, Share2, Clock, Wifi, WifiOff, Crown, Shield, AlertCircle } from 'lucide-react';

// Define WebSocket URL - in production this would be a real backend
const WS_URL = 'wss://qrloop-collaboration.example.com'; // For production
const DEMO_MODE = true; // Set to false when connecting to a real backend

// Memoized collaborative workspace component for performance
const CollaborativeWorkspace = memo(({ qrCode, onQRUpdate }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [permissions, setPermissions] = useState('viewer'); // viewer, editor, admin
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [isJoining, setIsJoining] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [username, setUsername] = useState('');
  
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);
  const simulatedWSRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Generate a unique session ID for this user
  const sessionIdRef = useRef(`user_${Date.now()}_${Math.floor(Math.random() * 1000000)}`);
  
  // Initialize WebSocket connection
  const initializeWebSocket = useCallback(() => {
    if (!DEMO_MODE) {
      try {
        // Real WebSocket implementation
        const ws = new WebSocket(`${WS_URL}/collaborate/${roomId}`);
        
        ws.onopen = () => {
          setIsConnected(true);
          setConnectionAttempts(0);
          console.log('WebSocket connected');
          
          // Send join message
          if (currentUser) {
            ws.send(JSON.stringify({
              type: 'join',
              user: currentUser,
              roomId,
              timestamp: new Date().toISOString()
            }));
          }
        };
        
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        };
        
        ws.onclose = () => {
          setIsConnected(false);
          handleDisconnect();
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
          handleDisconnect();
        };
        
        wsRef.current = ws;
      } catch (error) {
        console.error('WebSocket initialization error:', error);
        setIsConnected(false);
        handleDisconnect();
      }
    } else {
      // Demo mode - simulate WebSocket connection
      simulateWebSocketConnection();
    }
    
    return () => {
      cleanupWebSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, currentUser]);
  
  // Handle WebSocket messages
  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'join':
        handleUserJoin(data.user);
        break;
      case 'leave':
        handleUserLeave(data.userId);
        break;
      case 'message':
        handleIncomingMessage(data);
        break;
      case 'qr_update':
        if (onQRUpdate && data.qrOptions) {
          onQRUpdate(data.qrOptions);
        }
        break;
      case 'permission_change':
        handlePermissionUpdate(data);
        break;
      case 'users_list':
        setCollaborators(data.users);
        setActiveUsers(data.users.filter(u => u.isActive));
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  };
  
  // Handle disconnection with automatic reconnect
  const handleDisconnect = () => {
    if (connectionAttempts < 5) {
      // Exponential backoff for reconnect
      const timeout = Math.min(1000 * Math.pow(2, connectionAttempts), 30000);
      
      console.log(`Attempting to reconnect in ${timeout/1000} seconds...`);
      
      reconnectTimeoutRef.current = setTimeout(() => {
        setConnectionAttempts(prev => prev + 1);
        initializeWebSocket();
      }, timeout);
    } else {
      // Too many attempts, stop trying
      const systemMessage = {
        id: Date.now(),
        user: { name: 'System', role: 'system' },
        text: 'Unable to connect to collaboration server. Please try again later.',
        timestamp: new Date(),
        type: 'system',
        status: 'error'
      };
      setMessages(prev => [...prev, systemMessage]);
    }
  };
  
  // Clean up WebSocket and timeouts
  const cleanupWebSocket = () => {
    if (wsRef.current && !DEMO_MODE) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (simulatedWSRef.current) {
      clearInterval(simulatedWSRef.current);
      simulatedWSRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };
  
  useEffect(() => {
    return () => {
      cleanupWebSocket();
    };
  }, []);
  
  // Initialize when room is joined
  useEffect(() => {
    if (roomId && currentUser) {
      initializeWebSocket();
    }
    
    return () => {
      cleanupWebSocket();
    };
  }, [roomId, currentUser, initializeWebSocket]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Simulate WebSocket for demo mode
  const simulateWebSocketConnection = () => {
    setIsConnected(true);
    
    // Send a system message indicating demo mode
    const systemMessage = {
      id: Date.now(),
      user: { name: 'System', role: 'system' },
      text: 'Connected to demo collaboration mode. Changes are not saved to a server.',
      timestamp: new Date(),
      type: 'system',
      status: 'info'
    };
    setMessages(prev => [...prev, systemMessage]);
    
    // Simulate periodic updates from other users
    simulatedWSRef.current = setInterval(() => {
      // Randomly add/remove collaborators
      if (Math.random() > 0.8) {
        addRandomCollaborator();
      }
      
      // Simulate real-time messages
      if (Math.random() > 0.9) {
        addRandomMessage();
      }
      
      // Update active users
      updateActiveUsers();
    }, 5000);
  };
  
  const addRandomCollaborator = () => {
    const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
    const roles = ['viewer', 'editor'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    const newCollaborator = {
      id: Date.now() + Math.random(),
      name: randomName,
      avatar: `https://ui-avatars.com/api/?name=${randomName}&background=random`,
      role: roles[Math.floor(Math.random() * roles.length)],
      joinedAt: new Date(),
      isActive: Math.random() > 0.3,
      sessionId: `demo_${Date.now()}`
    };

    setCollaborators(prev => {
      if (prev.length < 5 && !prev.find(c => c.name === randomName)) {
        return [...prev, newCollaborator];
      }
      return prev;
    });
  };

  const addRandomMessage = () => {
    const messages = [
      "Great QR code design!",
      "Should we change the color scheme?",
      "The logo looks perfect",
      "Can we make it larger?",
      "This will work well for our campaign",
      "Nice work team!"
    ];
    
    if (collaborators.length > 0) {
      const randomCollaborator = collaborators[Math.floor(Math.random() * collaborators.length)];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      addMessage(randomCollaborator, randomMessage);
    }
  };

  const updateActiveUsers = () => {
    setActiveUsers(collaborators.filter(c => c.isActive));
  };

  const handleUserJoin = (user) => {
    setCollaborators(prev => {
      // Add user if not already in the list
      if (!prev.find(u => u.sessionId === user.sessionId)) {
        const systemMessage = {
          id: Date.now(),
          user: { name: 'System', role: 'system' },
          text: `${user.name} has joined the room`,
          timestamp: new Date(),
          type: 'system',
          status: 'success'
        };
        setMessages(prev => [...prev, systemMessage]);
        return [...prev, { ...user, isActive: true }];
      }
      return prev;
    });
  };
  
  const handleUserLeave = (sessionId) => {
    setCollaborators(prev => {
      const user = prev.find(u => u.sessionId === sessionId);
      if (user) {
        const systemMessage = {
          id: Date.now(),
          user: { name: 'System', role: 'system' },
          text: `${user.name} has left the room`,
          timestamp: new Date(),
          type: 'system',
          status: 'info'
        };
        setMessages(prev => [...prev, systemMessage]);
      }
      return prev.filter(u => u.sessionId !== sessionId);
    });
  };
  
  const handleIncomingMessage = (data) => {
    addMessage(data.user, data.text);
  };
  
  const handlePermissionUpdate = (data) => {
    if (data.sessionId === sessionIdRef.current) {
      setPermissions(data.permission);
      
      const systemMessage = {
        id: Date.now(),
        user: { name: 'System', role: 'system' },
        text: `Your role has been changed to: ${data.permission}`,
        timestamp: new Date(),
        type: 'system',
        status: 'info'
      };
      setMessages(prev => [...prev, systemMessage]);
    }
    
    setCollaborators(prev => 
      prev.map(c => 
        c.sessionId === data.sessionId ? { ...c, role: data.permission } : c
      )
    );
  };

  const addMessage = (user, text) => {
    const message = {
      id: Date.now() + Math.random(),
      user,
      text,
      timestamp: new Date(),
      type: 'message'
    };
    setMessages(prev => [...prev, message]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && currentUser) {
      // Create message object
      const messageData = {
        type: 'message',
        user: currentUser,
        text: newMessage,
        roomId,
        timestamp: new Date().toISOString()
      };
      
      // Send via WebSocket if connected
      if (!DEMO_MODE && wsRef.current && isConnected) {
        wsRef.current.send(JSON.stringify(messageData));
      }
      
      // Add to local messages
      addMessage(currentUser, newMessage);
      setNewMessage('');
    }
  };

  const handleQRUpdate = (updatedOptions) => {
    if (!DEMO_MODE && wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify({
        type: 'qr_update',
        qrOptions: updatedOptions,
        user: currentUser,
        roomId,
        timestamp: new Date().toISOString()
      }));
    }
    
    // In demo mode, just notify locally
    if (DEMO_MODE) {
      const systemMessage = {
        id: Date.now(),
        user: { name: 'System', role: 'system' },
        text: `${currentUser.name} has updated the QR code`,
        timestamp: new Date(),
        type: 'system',
        status: 'info'
      };
      setMessages(prev => [...prev, systemMessage]);
    }
  };

  const handleInviteUser = () => {
    const inviteLink = `${window.location.origin}/collaborate/${roomId || 'demo-room'}`;
    navigator.clipboard.writeText(inviteLink);
    
    // Add system message
    const systemMessage = {
      id: Date.now(),
      user: { name: 'System', role: 'system' },
      text: `Invite link copied to clipboard: ${inviteLink}`,
      timestamp: new Date(),
      type: 'system',
      status: 'success'
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handlePermissionChange = (sessionId, newPermission) => {
    if (!DEMO_MODE && wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify({
        type: 'permission_change',
        sessionId,
        permission: newPermission,
        by: currentUser,
        roomId,
        timestamp: new Date().toISOString()
      }));
    }
    
    // Update locally as well
    setCollaborators(prev => 
      prev.map(c => 
        c.sessionId === sessionId ? { ...c, role: newPermission } : c
      )
    );
  };
  
  // Join a room 
  const handleJoinRoom = () => {
    if (!roomName.trim() || !username.trim()) return;
    
    setIsJoining(true);
    
    // Create user profile
    const user = {
      id: Date.now(),
      sessionId: sessionIdRef.current,
      name: username,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`,
      role: 'admin', // First joiner is admin
      joinedAt: new Date()
    };
    
    setCurrentUser(user);
    setPermissions('admin');
    setRoomId(roomName.toLowerCase().replace(/[^a-z0-9]/g, '-'));
    
    setTimeout(() => {
      setIsJoining(false);
    }, 1000);
  };

  // Render join room interface if not yet connected
  if (!currentUser || !roomId) {
    return (
      <div className="card space-y-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Collaborative Workspace
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Work together with others on QR code design in real-time
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800 dark:text-blue-300 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Enter a room name and your display name to start or join a collaboration session.</span>
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Name
            </label>
            <input
              type="text"
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name (e.g., project-qr)"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-800"
              aria-label="Room name"
            />
          </div>
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Display Name
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-800"
              aria-label="Your display name"
            />
          </div>
          
          <button
            onClick={handleJoinRoom}
            disabled={isJoining || !roomName.trim() || !username.trim()}
            className={`w-full px-4 py-3 rounded-lg flex items-center justify-center space-x-2 ${
              isJoining || !roomName.trim() || !username.trim()
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
            }`}
            aria-label="Join collaboration room"
          >
            {isJoining ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Joining...</span>
              </>
            ) : (
              <>
                <Users className="w-5 h-5" />
                <span>Join Collaboration Room</span>
              </>
            )}
          </button>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {DEMO_MODE ? 
              "This is a demo mode. Collaboration data is not saved to a server." : 
              "Your session will be saved on our secure servers while you collaborate."}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <span>Collaboration Room: {roomId}</span>
                {isConnected ? (
                  <span className="ml-2 flex items-center text-green-600 dark:text-green-400 text-sm font-normal">
                    <Wifi className="w-4 h-4 mr-1" />
                    Connected
                  </span>
                ) : (
                  <span className="ml-2 flex items-center text-red-600 dark:text-red-400 text-sm font-normal">
                    <WifiOff className="w-4 h-4 mr-1" />
                    Disconnected
                  </span>
                )}
              </h3>
            </div>
          </div>
          
          <button
            onClick={handleInviteUser}
            className="px-3 py-1.5 rounded-lg flex items-center space-x-1 text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            aria-label="Invite collaborators"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite</span>
          </button>
        </div>
        
        {/* Users List */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            <span>Active Collaborators ({activeUsers.length})</span>
          </h4>
          
          <div className="flex flex-wrap gap-2">
            {/* Current User */}
            <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-900 dark:text-white font-medium">
                {currentUser.name} (You)
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 font-medium">
                {currentUser.role}
              </span>
            </div>
            
            {/* Other Users */}
            {activeUsers.filter(user => user.id !== currentUser.id).map(user => (
              <div 
                key={user.id}
                className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2"
              >
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-gray-900 dark:text-white">
                  {user.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 font-medium">
                  {user.role}
                </span>
                
                {/* Permission controls (only shown to admins) */}
                {currentUser.role === 'admin' && (
                  <div className="relative group">
                    <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <Shield className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 hidden group-hover:block z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handlePermissionChange(user.sessionId, 'viewer')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Make Viewer
                        </button>
                        <button
                          onClick={() => handlePermissionChange(user.sessionId, 'editor')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Make Editor
                        </button>
                        <button
                          onClick={() => handlePermissionChange(user.sessionId, 'admin')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Make Admin
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {activeUsers.length === 1 && (
              <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                No other collaborators yet. Use the Invite button to share this room.
              </div>
            )}
          </div>
        </div>
        
        {/* Permissions Info */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            <span>Your Role: {permissions}</span>
          </h4>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <p><strong>Viewer:</strong> Can only view the QR code and chat</p>
            <p><strong>Editor:</strong> Can modify the QR code and chat</p>
            <p><strong>Admin:</strong> Can modify permissions and manage the room</p>
          </div>
        </div>
      </div>
      
      {/* Chat Section */}
      <div className="card">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          <span>Team Chat</span>
        </h4>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
          {/* Messages Container */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 h-full flex items-center justify-center flex-col">
                <MessageCircle className="w-10 h-10 mb-2 opacity-30" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map(message => (
                <div key={message.id} className={`flex ${message.type === 'system' ? 'justify-center' : message.user.id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'system' ? (
                    <div className={`text-xs py-1.5 px-3 rounded-lg inline-block max-w-[85%] ${
                      message.status === 'error' ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                      message.status === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {message.text}
                    </div>
                  ) : message.user.id === currentUser.id ? (
                    <div className="bg-blue-600 text-white py-2 px-4 rounded-xl rounded-tr-none max-w-[85%]">
                      <div className="text-sm">{message.text}</div>
                      <div className="text-right mt-1">
                        <span className="text-xs text-blue-100">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex space-x-2 max-w-[85%]">
                      <img src={message.user.avatar} alt={message.user.name} className="w-8 h-8 rounded-full mt-1" />
                      <div>
                        <div className="bg-gray-100 dark:bg-gray-800 py-2 px-4 rounded-xl rounded-tl-none">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {message.user.name}
                          </div>
                          <div className="text-sm text-gray-900 dark:text-white">{message.text}</div>
                        </div>
                        <div className="ml-2 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-800"
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                aria-label="Chat message"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={`px-4 py-2 rounded-lg ${
                  !newMessage.trim()
                    ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                aria-label="Send message"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* QR Editing Controls - Only shown to editors and admins */}
      {(permissions === 'editor' || permissions === 'admin') && (
        <div className="card">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <Edit className="w-5 h-5 mr-2" />
            <span>Collaborative Editing</span>
          </h4>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Any changes you make to the QR code will be visible to all collaborators in real-time.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleQRUpdate(qrCode?._options)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center space-x-2"
                aria-label="Share current QR design"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Current Design</span>
              </button>
              
              <button
                onClick={() => onQRUpdate?.(qrCode?._options)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2"
                aria-label="Apply team design"
              >
                <Eye className="w-4 h-4" />
                <span>Apply Team Design</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default CollaborativeWorkspace;
