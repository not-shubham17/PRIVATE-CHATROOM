import React from 'react';
import { User } from '../types';

interface UserListProps {
  users: User[];
  room: string;
  currentUsername: string;
}

const UserList: React.FC<UserListProps> = ({ users, room, currentUsername }) => {
  return (
    <div className="h-full flex flex-col bg-dark-800 border-r border-dark-700 w-64 hidden md:flex">
      <div className="p-4 border-b border-dark-700 bg-dark-900/50">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Room</h2>
        <div className="text-lg font-bold text-white truncate" title={room}>#{room}</div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Online ({users.length})</h3>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        </div>
        
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors p-2 rounded hover:bg-dark-700/50">
              <div className="w-8 h-8 rounded bg-dark-600 flex items-center justify-center text-sm font-bold text-slate-200">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className={`truncate ${user.username === currentUsername ? 'font-bold text-accent-500' : ''}`}>
                {user.username} {user.username === currentUsername && '(You)'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserList;