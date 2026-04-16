import { useState } from 'react';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';

function App() {
  const [username, setUsername] = useState(null);

  const handleLogin = (name) => {
    setUsername(name);
  };

  const handleLogout = () => {
    setUsername(null);
  };

  return (
    <div className="app-container">
      {!username ? (
        <Login onLogin={handleLogin} />
      ) : (
        <ChatRoom username={username} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
