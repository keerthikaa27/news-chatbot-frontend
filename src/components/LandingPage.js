import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LandingPage.scss";

const categories = ["General", "Technology", "Sports", "Business", "Health", "Entertainment"];

const LandingPage = () => {
  const [headlines, setHeadlines] = useState([]);
  const [category, setCategory] = useState("General");
  const [hoveredIndex, setHoveredIndex] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("https://news-chatbot-backend-new.onrender.com/news?category=general");
        const data = await response.json();
        if (data.articles) {
          setHeadlines(
            data.articles.map((article) => ({
              title: article.title,
              description: article.description || "No description available.",
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching news:", error);
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
            {headlines.length > 0 ? (
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
