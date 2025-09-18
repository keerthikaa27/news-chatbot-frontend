Newsify - Frontend

This is the frontend for a RAG-powered news chatbot, built with React and SCSS. It provides a modern, interactive UI to query news (powered by Gemini and ChromaDB with 12k+ articles), view session history, and reset sessions.

Tech Stack

React: Core framework for dynamic UI rendering.
SCSS: Styling for a responsive, dark-themed interface with animations.
Axios: Handles API requests to the backend (/chat, /history).
UUID: Generates unique session IDs for new users.
Google Fonts (Roboto): Clean typography for readability.

Features

Chat Screen: Displays message history with user messages in #5c1414 gradient (white text) and bot messages in black gradient (white text, typing animation for dynamic feel).
Welcome Message: Centered "Dive into the latest news" with pulsing animation, hides after first user message.
Input Area: Text input with #5c1414 border, Send/Reset buttons in #5c1414 with glow hover effects.
Session Management: Unique UUID-based session IDs, persisted in localStorage, with reset buttons in header (New Session) and chat (Reset Chat).
Theme Toggle: Light/dark mode switch for accessibility (dark default: black #000000 background).
Responsive Design: Desktop-optimized (1200px max-width), scales for smaller screens.
Animations: Fade-in messages, pulsing welcome text, slide-in header, and typing cursor for bot responses.

Setup Instructions

Clone Repository:git clone <frontend-repo-url>
cd <frontend-repo>


Install Dependencies:npm install axios uuid sass


Add Google Fonts:In src/index.html:<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">


Configure Backend URL:Update src/components/Chat.js with your backend URL. 

Run Locally:npm start

Opens at http://localhost:3000.

Project Structure
src/
 components/
   Chat.js        # Main chat component with input, history, and reset
   Chat.scss      # SCSS for chat styling (black theme, #5c1414 buttons)
App.js            # Root component with header, theme toggle, session management
App.scss          # SCSS for app-level styling (header, container)
index.html        # Includes Roboto font

How It Works

Session Management: On load, App.js generates or retrieves a UUID session ID from localStorage. Resetting via New Session or Reset Chat buttons creates a new UUID and clears Redis history via /history/:sessionId DELETE.
Chat Flow: Chat.js sends queries to /chat endpoint, displays responses with typing animation, and fetches history from /history/:sessionId. The welcome message ("Dive into the latest news") appears when no messages exist.
Styling: SCSS delivers a black #000000 chatbox, #5c1414 user messages/buttons, black bot messages, and a dark gray header. Light mode switches to white background for accessibility.
Performance: Smooth animations (fade-in, pulse, slide-in) and glow effects enhance UX without impacting load times.

Caching & Performance

Session History: The frontend fetches chat history from Redis (in-memory database) via the /history/:sessionId endpoint, displaying cached user/bot messages instantly on page load or refresh.

Integration with Backend Caching: The backend stores session history in Redis with a 3600-second (1-hour) TTL, ensuring efficient retrieval and automatic cleanup of inactive sessions. Cache warming (pre-querying popular terms like "latest news on india", "india economy") runs on backend startup to reduce latency for common queries, benefiting frontend response times.

Frontend Optimization: Minimal state updates and efficient Axios calls ensure fast rendering. The typing animation and glow effects are CSS-driven, avoiding JavaScript overhead.
