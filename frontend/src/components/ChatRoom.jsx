import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Send, LogOut } from 'lucide-react';

const SOCKET_SERVER_URL = 'http://localhost:5000';

export default function ChatRoom({ username, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 1. Fetch initial history
    axios.get(`${SOCKET_SERVER_URL}/api/messages`)
      .then(res => setMessages(res.data))
      .catch(err => console.error('Failed to fetch messages', err));

    // 2. Connect via WebSockets
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // 3. Listen for new messages
    newSocket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !socket) return;

    socket.emit('sendMessage', {
      sender: username,
      text: inputValue.trim()
    });

    setInputValue('');
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString || Date.now());
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-title">
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }} />
          Global Space
        </div>
        <div className="header-actions">
          <span style={{color: 'var(--text-muted)'}}>{username}</span>
          <button onClick={onLogout} className="exit-btn" title="Leave">
            <LogOut size={20} />
          </button>
        </div>
      </div>
      
      <div className="messages-area">
        {messages.map((msg, index) => {
          const isOwn = msg.sender === username;
          return (
            <div key={msg._id || index} className={`message-wrapper ${isOwn ? 'own' : 'other'}`}>
              <div className="message-sender">{msg.sender}</div>
              <div className="message-bubble">
                {msg.text}
                <span className="message-time">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <form className="input-form" onSubmit={handleSendMessage}>
          <input 
            type="text" 
            className="message-input"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
          />
          <button type="submit" className="send-btn" disabled={!inputValue.trim()}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
