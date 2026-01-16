import { io, Socket } from "socket.io-client";

// In a real app, use environment variables. 
// For this standalone setup, we assume the server runs on localhost:3001
const SOCKET_URL = "http://localhost:3001"; 

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
});