import React from "react";
import axios from "axios";
import "./Sidebar.scss";



const Sidebar = ({
  sessions,
  setSessions,
  activeSession,
  setActiveSession,
  backendUrl
}) => {
    

  const handleBackHome = () => {
    window.location.href = "/";
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to delete all chat history?")) return;
    try {
      await axios.delete(`${backendUrl}/sessions`);
      setSessions([]);
      setActiveSession("demo-session");
    } catch (err) {
      console.error("Failed to clear history:", err);
      alert("Error clearing history. Try again.");
    }
  };

  return (
    <div className="sidebar">
      <button className="back-home-button" onClick={handleBackHome}>
        ←  Back to Home
      </button>

    <h3 className="chats-heading">Chats</h3>

      <ul className="session-list">

        {sessions.map((s) => (
          <li
            key={s.id}
            className={s.id === activeSession ? "active" : ""}
            onClick={() => setActiveSession(s.id)}
          >
            {s.preview}
          </li>
        ))}
      </ul>

      {sessions.length > 0 && (
        <button className="clear-history-button" onClick={handleClearHistory}>
          Delete History
        </button>
      )}
    </div>
  );
};

export default Sidebar;
