import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.scss";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>NEWSIFY</h1>
        <p>Your AI-powered assistant to explore the latest news</p>
      </header>
      <main className="landing-main">
        <img
  src="/chat-bot.png"
  alt="Chatbot Illustration"
  className="landing-image"
/>
        <p className="landing-description">
          Ask anything about the latest news, trends, or topics — our chatbot
          will keep you updated in real time.
        </p>
        <Link to="/chat" className="start-button">
          Chatbot
        </Link>
      </main>
      <footer className="landing-footer">
        <p>© 2025 News Chatbot. Powered by AI.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
