export interface User {
  id: string;
  username: string;
  room: string;
}

export interface Message {
  id: string;
  username: string;
  text: string;
  time: string;
  isSystem: boolean;
}

export interface JoinData {
  username: string;
  room: string;
}

export interface RoomData {
  room: string;
  users: User[];
}

export interface ServerResponse {
  error?: string;
  success?: boolean;
}