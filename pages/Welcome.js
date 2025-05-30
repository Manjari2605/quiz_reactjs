import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  const history = useHistory();
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [username, setUsername] = useState('');

  const handleUsername = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('quizbolt_username', username.trim());
      history.push('/home');
    }
  };

  return (
    <div className="welcome-bg">
      <div className="welcome-card">
        <h1 className="welcome-title">Welcome to <span className="brand">QuizBolt</span></h1>
        <p className="welcome-desc">Challenge yourself. Track your progress. Have fun learning!</p>
        <button className="welcome-btn" onClick={() => setShowUsernameInput(true)} style={{ marginBottom: 16, background: '#1e3c72' }}>Enter with Username</button>
        {showUsernameInput && (
          <div className="username-modal-bg">
            <div className="username-modal">
              <form onSubmit={handleUsername} style={{ marginTop: 0 }}>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="auth-input"
                  style={{ marginBottom: 8 }}
                  autoFocus
                />
                <button className="welcome-btn" type="submit" style={{ width: '100%' }}>Continue</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Welcome;

