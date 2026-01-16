import React, { useState, useEffect, useRef } from 'react';
import { Message, User } from '../types';
import UserList from './UserList';

interface ChatRoomProps {
  room: string;
  username: string;
  messages: Message[];
  users: User[];
  typingUsers: string[];
  onSendMessage: (msg: string) => void;
  onTyping: () => void;
  onStopTyping: () => void;
  onLeave: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ 
  room, 
  username, 
  messages, 
  users, 
  typingUsers, 
  onSendMessage, 
  onTyping, 
  onStopTyping, 
  onLeave 
}) => {
  const [inputText, setInputText] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]); // Scroll when messages arrive or typing indicator appears

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    // Emit typing event only once when starting to type
    if (!isTypingRef.current) {
        onTyping();
        isTypingRef.current = true;
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
        onStopTyping();
        isTypingRef.current = false;
    }, 2000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
      
      // Stop typing immediately upon send
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      onStopTyping();
      isTypingRef.current = false;
    }
  };

  return (
    <div className="flex h-full w-full bg-dark-900">
      {/* Sidebar - Hidden on mobile unless toggled */}
      <UserList users={users} room={room} currentUsername={username} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 bg-dark-800 border-b border-dark-700 shadow-sm z-10">
            <div className="flex items-center gap-3">
                 <div className="md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-400 hover:text-white">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                    </button>
                 </div>
                 <h2 className="font-bold text-white text-lg">#{room}</h2>
            </div>
          <button
            onClick={onLeave}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
          >
            Leave Room
          </button>
        </header>

         {/* Mobile User List Overlay */}
         {isMobileMenuOpen && (
            <div className="absolute top-16 left-0 w-64 h-[calc(100%-4rem)] bg-dark-800 z-20 border-r border-dark-700 md:hidden">
                 <div className="p-4">
                    <h3 className="text-slate-400 font-bold uppercase text-xs mb-4">Online Users</h3>
                    <ul className="space-y-2">
                        {users.map(u => (
                            <li key={u.id} className="text-slate-300 py-1">{u.username}</li>
                        ))}
                    </ul>
                 </div>
            </div>
         )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg) => {
            const isMe = msg.username === username;
            
            if (msg.isSystem) {
                return (
                    <div key={msg.id} className="flex justify-center my-4">
                        <span className="px-3 py-1 rounded-full bg-dark-700/50 text-slate-400 text-xs border border-dark-700">
                            {msg.text} <span className="text-dark-600 ml-1">{msg.time}</span>
                        </span>
                    </div>
                )
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${isMe ? 'bg-accent-600 text-white' : 'bg-dark-600 text-slate-300'}`}>
                        {msg.username.charAt(0).toUpperCase()}
                    </div>
                    
                    <div
                    className={`px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm break-words ${
                        isMe
                        ? 'bg-accent-600 text-white rounded-tr-none'
                        : 'bg-dark-700 text-slate-200 rounded-tl-none'
                    }`}
                    >
                    {msg.text}
                    </div>
                </div>
                <div className={`mt-1 text-[10px] text-slate-500 ${isMe ? 'mr-10' : 'ml-10'}`}>
                  {msg.username} • {msg.time}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area & Typing Indicator */}
        <div className="bg-dark-800 border-t border-dark-700">
            {/* Typing Indicator */}
            <div className="h-6 px-6 pt-2">
                {typingUsers.length > 0 && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-accent-500 animate-pulse">
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-bounce"></span>
                        </div>
                        <span>
                            {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
                        </span>
                    </div>
                )}
            </div>

          <form onSubmit={handleSend} className="p-4 pt-2 flex gap-3 max-w-4xl mx-auto">
            <input
              type="text"
              className="flex-1 bg-dark-900 text-white border border-dark-600 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent placeholder-dark-600 transition-all"
              placeholder="Type a message..."
              value={inputText}
              onChange={handleInputChange}
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-accent-600 hover:bg-accent-500 disabled:opacity-50 disabled:bg-dark-600 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all shadow-lg hover:shadow-accent-500/20"
            >
              <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;