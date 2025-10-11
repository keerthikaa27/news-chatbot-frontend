import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./Chat.scss";

const BASE_URL = "https://news-chatbot-backend-new.onrender.com";

const TypingText = ({ text, isNew }) => {
  const [displayedText, setDisplayedText] = useState(isNew ? "" : text);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!isNew) {
      setDisplayedText(text);
      return;
    }

    let i = 0;
    const animate = () => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayedText(text);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [text, isNew]);

  return <span className="message-text typing">{displayedText}</span>;
};

const Chat = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newMessageId, setNewMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const currentSessionRef = useRef(sessionId);

  const location = useLocation(); // ✅ added
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("query"); // ✅ headline from ticker

  useEffect(() => {
    currentSessionRef.current = sessionId;
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/history/${sessionId}`);
        if (sessionId === currentSessionRef.current) {
          setMessages(
            res.data.history
              .map((item, index) => [
                {
                  role: "user",
                  content: item.user,
                  timestamp: new Date().toLocaleTimeString(),
                  id: `user-${index}`,
                  read: false,
                },
                {
                  role: "bot",
                  content: item.bot,
                  isNew: false,
                  timestamp: new Date().toLocaleTimeString(),
                  id: `bot-${index}`,
                  reactions: {},
                },
              ])
              .flat()
          );
        }
      } catch (err) {
        console.error("History fetch error:", err);
      }
    };
    fetchHistory();
  }, [sessionId]);

  useEffect(() => {
    const timers = messages
      .filter((msg) => msg.role === "user" && !msg.read)
      .map((msg) =>
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
          );
        }, 2000)
      );
    return () => timers.forEach(clearTimeout);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (customMessage) => {
    const messageToSend = customMessage || input;
    if (!messageToSend.trim()) return;
    const userMessage = {
      role: "user",
      content: messageToSend,
      timestamp: new Date().toLocaleTimeString(),
      id: `user-${Date.now()}`,
      read: false,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/chat`, {
        message: messageToSend,
        sessionId,
      });
      const botMessage = {
        role: "bot",
        content: res.data.reply,
        isNew: true,
        timestamp: new Date().toLocaleTimeString(),
        id: `bot-${Date.now()}`,
        reactions: {},
      };
      if (sessionId === currentSessionRef.current) {
        setMessages((prev) => [...prev, botMessage]);
        setNewMessageId(botMessage.content);
        setTimeout(() => setNewMessageId(null), 5000);
      }
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
      const errorMessage = {
        role: "bot",
        content:
          err.response?.data?.error ||
          err.response?.data?.details ||
          "Error fetching response",
        isNew: true,
        timestamp: new Date().toLocaleTimeString(),
        id: `bot-${Date.now()}`,
        reactions: {},
      };
      if (sessionId === currentSessionRef.current) {
        setMessages((prev) => [...prev, errorMessage]);
        setNewMessageId(errorMessage.content);
        setTimeout(() => setNewMessageId(null), 5000);
      }
    }

    setIsLoading(false);
    setInput("");
  }, [sessionId, input]); 

  const hasSentInitialQuery = useRef(false);

  useEffect(() => {
    if (initialQuery && !hasSentInitialQuery.current) {
      hasSentInitialQuery.current = true; 
      setInput(initialQuery);
      sendMessage(initialQuery); 
    }
  }, [initialQuery, sendMessage]);

  const resetSession = async () => {
    try {
      await axios.delete(`${BASE_URL}/history/${sessionId}`);
      if (sessionId === currentSessionRef.current) {
        setMessages([]);
        setInput("");
      }
    } catch (err) {
      console.error("Reset session error:", err);
      if (sessionId === currentSessionRef.current) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: "Error clearing session",
            isNew: true,
            timestamp: new Date().toLocaleTimeString(),
            id: `bot-${Date.now()}`,
            reactions: {},
          },
        ]);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      sendMessage();
    }
  };

  const addReaction = (messageId, emoji) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: {
                ...msg.reactions,
                [emoji]: (msg.reactions[emoji] || 0) + 1,
              },
            }
          : msg
      )
    );
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.length === 0 && !isLoading && (
          <div className="welcome-message">Dive into the latest news!</div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            <div className="message-content">
              <span className="message-role">
                {msg.role === "user" ? "You" : "Bot"}
              </span>
              {msg.role === "bot" ? (
                <TypingText
                  text={msg.content}
                  isNew={msg.isNew && msg.content === newMessageId}
                />
              ) : (
                <span className="message-text">{msg.content}</span>
              )}
              <div className="message-meta">
                <span className="timestamp">{msg.timestamp}</span>
                {msg.role === "user" && (
                  <span
                    className={`read-receipt ${msg.read ? "read" : "unread"}`}
                  >
                    {msg.read ? "✓✓" : "✓"}
                  </span>
                )}
              </div>
              {msg.role === "bot" && (
                <div className="reactions">
                  <button
                    className="reaction-button"
                    onClick={() => addReaction(msg.id, "👍")}
                    aria-label="Like reaction"
                  >
                    👍 {msg.reactions["👍"] || 0}
                  </button>
                  <button
                    className="reaction-button"
                    onClick={() => addReaction(msg.id, "👎")}
                    aria-label="Dislike reaction"
                  >
                    👎 {msg.reactions["👎"] || 0}
                  </button>
                </div>
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
        <button onClick={() => sendMessage()} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
        <button onClick={resetSession} disabled={isLoading}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Chat;