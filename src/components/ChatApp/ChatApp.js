import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import axios from "axios";
import "./ChatApp.scss";

const backendUrl = "https://news-chatbot-backend-new.onrender.com";

const ChatApp = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState("demo-session");

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${backendUrl}/sessions`);
      setSessions(res.data.sessions || []);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  const createNewSession = () => {
    const newSessionId = `session-${Date.now()}`;
    setSessions((prev) => [...prev, { id: newSessionId, preview: "New Chat" }]);
    setActiveSession(newSessionId);
  };

  return (
    <div className="chatapp-container">
      <Sidebar
        sessions={sessions}
        setSessions={setSessions}
        activeSession={activeSession}
        setActiveSession={setActiveSession}
        backendUrl={backendUrl}
        createNewSession={createNewSession}
      />
      <div className="chat-area">
        <Chat sessionId={activeSession} />
      </div>
    </div>
  );
};

export default ChatApp;