import { useState } from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';

export default function Login({ onLogin }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="login-container">
      <MessageCircle className="login-icon" />
      <h1 className="login-title">PulseChat</h1>
      <p className="login-subtitle">Connect with everyone in real-time.</p>
      
      <form className="login-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          className="input-field"
          placeholder="Enter your display name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <button type="submit" className="btn-primary" disabled={!name.trim()}>
          Join the Space <ArrowRight size={20} />
        </button>
      </form>
    </div>
  );
}
