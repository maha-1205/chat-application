import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Connect to the NestJS backend WebSocket server
const socket = io('http://localhost:3000');

function Chat() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    
    socket.on('receiveMessage', (data) => {
      console.log('Message received:', data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    if (username && message) {
      const data = { user: username, message };
      socket.emit('sendMessage', data); 
      setMessage(''); 
    }
  };

  return (
    <div style={{ margin: '2rem', fontFamily: 'Arial' }}>
      <h1>Chat Application</h1>
      <div>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '1rem' }}
        />
      </div>
      <div
        style={{
          border: '1px solid #ccc',
          height: '300px',
          overflowY: 'scroll',
          margin: '1rem 0',
          padding: '1rem',
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}: </strong>
            {msg.message}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '1rem' }}
        />
        <button onClick={sendMessage} style={{ padding: '0.5rem' }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
