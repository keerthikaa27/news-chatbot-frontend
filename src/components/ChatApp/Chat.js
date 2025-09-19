import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Chat.scss";

const BASE_URL = "https://news-chatbot-backend-new.onrender.com";

const TypingText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return <span className="message-text typing">{displayedText}</span>;
};

const Chat = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/history/${sessionId}`);
        setMessages(
          res.data.history
            .map((item) => [
              { role: "user", content: item.user },
              { role: "bot", content: item.bot },
            ])
            .flat()
        );
      } catch (err) {
        console.error("History fetch error:", err);
      }
    };
    fetchHistory();
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/chat`, {
        message: input,
        sessionId,
      });
      const botMessage = { role: "bot", content: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
      const errorMessage = {
        role: "bot",
        content:
          err.response?.data?.error ||
          err.response?.data?.details ||
          "Error fetching response",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
    setInput("");
  };

  const resetSession = async () => {
    try {
      await axios.delete(`${BASE_URL}/history/${sessionId}`);
      setMessages([]);
      setInput("");
    } catch (err) {
      console.error("Reset session error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error clearing session" },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.length === 0 && !isLoading && (
          <div className="welcome-message">Dive into the latest news!</div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="message-content">
              <span className="message-role">
                {msg.role === "user" ? "You" : "Bot"}
              </span>
              {msg.role === "bot" ? (
                <TypingText text={msg.content} />
              ) : (
                <span className="message-text">{msg.content}</span>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message bot">
            <div className="message-content">
              <span className="message-role">Bot</span>
              <span className="message-text loading">Typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about the latest news..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
        <button onClick={resetSession} disabled={isLoading}>
          Reset Chat
        </button>
      </div>
    </div>
  );
};

export default Chat;
