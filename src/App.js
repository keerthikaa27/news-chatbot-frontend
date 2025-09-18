import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Chat from './components/Chat';
import './App.scss';

function App() {
  const [sessionId, setSessionId] = useState(() => {
    const stored = localStorage.getItem('chatSessionId');
    return stored || uuidv4();
  });

  useEffect(() => {
    localStorage.setItem('chatSessionId', sessionId);
  }, [sessionId]);

  const resetSession = () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    localStorage.setItem('chatSessionId', newSessionId);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Newsify</h1>
          <p>Ask about the latest news, powered by AI</p>
        </div>
        <button onClick={resetSession} className="reset-session-btn">
          New Session
        </button>
      </header>
      <main className="app-main">
        <Chat sessionId={sessionId} />
      </main>
    </div>
  );
}

export default App;