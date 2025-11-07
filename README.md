# Zen-AI

> **Modern AI Chat Platform** — Real-time, full-stack, production-ready chat app with advanced features, beautiful UI, and robust backend. Powered by Node.js, Express, React, Socket.IO, Gemini API, MongoDB, and Pinecone.

![Zen-AI Screenshot](https://res.cloudinary.com/dyibkikle/image/upload/v1762537502/Screenshot_2025-11-07_222310_jjf5lh.png)


---

## 🚀 Project Overview

Zen-AI is a full-stack conversational AI platform designed for modern web users and teams. It features real-time chat, persistent conversations, semantic memory, and a rich set of user actions. The backend leverages Node.js, Express, MongoDB, and Pinecone for scalable, secure, and fast operations. The frontend is built with React, Vite, Redux Toolkit, and TailwindCSS for a beautiful, responsive, and interactive experience.

**Why Zen-AI stands out:**

- Real-time, low-latency chat with AI (Socket.IO + Gemini API)
- Semantic memory: context-aware replies using Pinecone vector search
- Secure JWT authentication with cookie-based sessions
- Advanced message actions: love, share, screenshot, read-aloud, copy
- Sandbox mode for guest/temporary chats
- Pagination, optimistic UI, and accessibility features
- Clean codebase, modular structure, and production-grade logging

---

## ✨ Main Features

- **Register & Login:** Secure JWT auth, cookie-based sessions, password hashing
- **Home & Sidebar:** Persistent chat history, quick navigation, user info
- **Sandbox Chat:** Temporary, non-persistent chat for guests and quick tests
- **Real-time Messaging:** Socket.IO for instant send/receive, streaming AI responses
- **Message Actions:**
  - Love (like) messages
  - Share chat/messages
  - Screenshot any message (styled, dark/light)
  - Read aloud (browser TTS)
  - Copy message text
- **Markdown & Code Highlighting:** Beautiful rendering of AI/code responses
- **Pagination & Infinite Scroll:** Efficient loading for long chats
- **Optimistic UI:** Fast, responsive user experience
- **Accessibility:** Dark mode, keyboard navigation, toast notifications

---

## 🛠️ Backend Deep Dive

### Tech Stack

- Node.js, Express, MongoDB (Mongoose)
- Gemini API (Google GenAI)
- Pinecone (vector DB)
- Socket.IO (WebSockets)
- JWT, bcrypt, cookie-parser
- Pino (logging), rotating-file-stream
- Express-rate-limit, express-validator

### Key Backend Features

- RESTful APIs for auth, chat, message management
- Socket.IO namespaces for `/user` (auth) and `/sandbox` (guest)
- Gemini API for AI responses and auto-title generation
- Pinecone vector search for semantic context and memory
- MongoDB for persistent storage (users, chats, messages)
- JWT authentication via cookies, secure middleware
- Rate limiting (API + socket)
- Request validation and error handling
- Structured logging (Pino, rotating logs in production)

### Backend Packages

- `@google/genai` — Gemini/GenAI client for AI responses
- `@pinecone-database/pinecone` — Pinecone vector DB client
- `bcrypt` — Password hashing
- `cookie`, `cookie-parser` — Cookie management
- `cors` — Cross-origin resource sharing
- `dotenv` — Environment variable management
- `express` — HTTP server framework
- `express-rate-limit` — API rate limiting
- `express-validator` — Request validation
- `jsonwebtoken` — JWT creation/verification
- `mongoose` — MongoDB ODM
- `nanoid` — Unique ID generation (sandbox)
- `pino`, `pino-http`, `pino-pretty` — Logging
- `rotating-file-stream` — Log rotation
- `socket.io` — WebSocket server
- `nodemon` — Dev server reloader

### Backend File Map

- `server.js` — Entry point, sets up Express, Socket.IO, DB
- `src/app.js` — Express app, middleware, routers, error handling
- `src/controllers/` — Auth & chat logic, Gemini integration
- `src/models/` — Mongoose models: User, Chat, Message, SandboxLog, DeleteLog
- `src/routes/` — Auth & chat route definitions
- `src/services/` — Gemini, Pinecone, DB helpers
- `src/sockets/` — Socket.IO namespaces, message handling
- `src/middlewares/` — Auth, rate limit, validation, logging
- `src/utils/` — JWT, token extraction, error helpers, logger
- `src/validators/` — Request validation schemas

### Backend Setup & Run

```powershell
cd backend
copy .env.example .env
# Edit .env for MongoDB, Gemini, Pinecone, JWT_SECRET
npm install
npm run dev
# API: http://localhost:3000/api/v1
```

---

## 🎨 Frontend Deep Dive

### Tech Stack

- React 19, Vite, Redux Toolkit
- TailwindCSS, Framer Motion
- Socket.IO client, Axios
- React Toastify, Markdown/Code highlighting

### Key Frontend Features

- Auth flows: register, login, logout
- Home page: chat list, sidebar, user info
- Chat UI: message list, input, top bar
- Real-time messaging: Socket.IO client
- Message actions: love, share, screenshot, read-aloud, copy
- Sandbox mode: guest/temporary chat
- Markdown/code rendering, syntax highlight
- Pagination, infinite scroll, optimistic UI
- Accessibility: dark mode, keyboard, toasts

![Zen-AI Screenshot](https://res.cloudinary.com/dyibkikle/image/upload/v1762537502/Screenshot_2025-11-07_222534_zorpsd.png)

---

### Frontend Packages

- `react`, `react-dom` — UI framework
- `redux`, `@reduxjs/toolkit` — State management
- `axios` — API requests
- `socket.io-client` — Real-time messaging
- `tailwindcss` — Styling
- `framer-motion` — Animations
- `react-toastify` — Notifications
- `react-markdown`, `remark-gfm`, `rehype-highlight` — Markdown/code rendering
- `html-to-image` — Screenshot utility

### Frontend File Map

- `src/App.jsx` — App root, theme, toasts
- `src/main.jsx` — Entry, Redux provider
- `src/routes/App.routes.jsx` — Routing
- `src/services/axios.service.js` — Central Axios instance
- `src/sockets/client.socket.js` — Socket.IO client setup
- `src/features/` — Redux slices: chats, messages, ui, user
- `src/components/` — UI: AuthPage, Chat, Home, MessagesList, ResponseActions, etc.
- `src/utils/` — Screenshot, auto-scroll, markdown helpers

### Frontend Setup & Run

```powershell
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

---

## 📄 License

MIT License — see LICENSE file.


## 👨‍💻 Developer

<div align="center">
  
**Asad Ali**  
*Full Stack Web Developer*

[![Email](https://img.shields.io/badge/Email-message.asadali@gmail.com-blue.svg)](mailto:message.asadali@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue.svg)](https://www.linkedin.com/in/asadaliofficials/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black.svg)](https://github.com/asadaliofficials)

</div>
