// LandingPage.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LandingPage.scss";

const categories = ["General", "Technology", "Sports", "Business", "Health", "Entertainment"];

const LandingPage = () => {
  const [headlines, setHeadlines] = useState([]);
  const [category, setCategory] = useState("General");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [error, setError] = useState(null); // Add state for errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://news-chatbot-backend-new.onrender.com/api/headlines?category=${category.toLowerCase()}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Body: ${text.slice(0, 100)}`);
        }
        const data = await response.json();
        if (!data.headlines) {
          throw new Error("No headlines in response");
        }
        console.log("Headlines:", data.headlines);
        setHeadlines(data.headlines); // Update state with fetched headlines
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error("Error fetching news:", error);
        setError(error.message); // Set error state
        setHeadlines([]); // Clear headlines on error
      }
    };
    fetchNews();
  }, [category]);

  const handleHeadlineClick = (headline) => {
    navigate(`/chat?query=${encodeURIComponent(headline)}`);
  };

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>NEWSIFY</h1>
        <p>Your AI-powered assistant to explore the latest news</p>

        {/* Category Filters */}
        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={cat === category ? "active" : ""}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Ticker */}
        <div className="news-ticker">
          <div className="ticker-content">
            {error ? (
              <span className="ticker-item error">Error: {error}</span>
            ) : headlines.length > 0 ? (
              headlines.map((item, index) => (
                <span
                  key={index}
                  className="ticker-item"
                  onClick={() => handleHeadlineClick(item.title)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {item.title}
                  {hoveredIndex === index && (
                    <span className="tooltip">{item.description}</span>
                  )}
                  <span className="ask-overlay">Ask Newsify</span>
                </span>
              ))
            ) : (
              <span className="ticker-item">Loading latest headlines...</span>
            )}
          </div>
        </div>
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