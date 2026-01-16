import React, { useState, useEffect } from 'react';
import JoinRoom from './components/JoinRoom';
import ChatRoom from './components/ChatRoom';
import { socket } from './services/socketService';
import { Message, User, JoinData, RoomData, ServerResponse } from './types';

const App: React.FC = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [room, setRoom] = useState('');
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Setup Socket Listeners
    socket.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('roomUsers', ({ users }: RoomData) => {
      setUsers(users);
    });

    socket.on('typing', (user: string) => {
      setTypingUsers((prev) => {
        if (!prev.includes(user)) return [...prev, user];
        return prev;
      });
    });

    socket.on('stopTyping', (user: string) => {
      setTypingUsers((prev) => prev.filter((u) => u !== user));
    });

    // Cleanup on unmount
    return () => {
      socket.off('message');
      socket.off('roomUsers');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, []);

  const joinRoom = async (data: JoinData): Promise<string | null> => {
    setIsLoading(true);
    socket.connect();

    return new Promise((resolve) => {
      socket.emit('joinRoom', data, (response: ServerResponse) => {
        setIsLoading(false);
        if (response.error) {
          socket.disconnect();
          resolve(response.error);
        } else {
          setRoom(data.room);
          setUsername(data.username);
          setIsJoined(true);
          resolve(null);
        }
      });
    });
  };

  const sendMessage = (text: string) => {
    socket.emit('chatMessage', text);
  };

  const notifyTyping = () => {
    socket.emit('typing');
  };

  const notifyStopTyping = () => {
    socket.emit('stopTyping');
  };

  const leaveRoom = () => {
    socket.disconnect();
    setIsJoined(false);
    setMessages([]);
    setUsers([]);
    setTypingUsers([]);
    setRoom('');
    setUsername('');
  };

  return (
    <div className="h-full w-full">
      {!isJoined ? (
        <JoinRoom onJoin={joinRoom} isLoading={isLoading} />
      ) : (
        <ChatRoom
          room={room}
          username={username}
          messages={messages}
          users={users}
          typingUsers={typingUsers}
          onSendMessage={sendMessage}
          onTyping={notifyTyping}
          onStopTyping={notifyStopTyping}
          onLeave={leaveRoom}
        />
      )}
    </div>
  );
};

export default App;