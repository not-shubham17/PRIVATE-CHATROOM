# SecureRoom Chat

A private, real-time chatroom application featuring instant messaging, live presence tracking, and dark-themed UI.

## Features

- **Real-time messaging** via WebSockets (Socket.IO)
- **Room-based chat** with unique room codes
- **User presence tracking** with live user lists
- **Typing indicators** - see when users are typing
- **Dark-themed UI** with modern, responsive design
- **Private and secure** room-based communication

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + Socket.IO
- **Styling**: Tailwind CSS

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Start the backend server:
   ```bash
   cd server
   npm start
   ```

4. Start the frontend development server (in a new terminal):
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
├── components/          # React components (ChatRoom, JoinRoom, UserList)
├── services/           # Socket service
├── server/             # Backend server files
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
└── index.tsx           # Entry point
```

## License

MIT License
