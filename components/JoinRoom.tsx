import React, { useState } from 'react';
import { JoinData } from '../types';

interface JoinRoomProps {
  onJoin: (data: JoinData) => Promise<string | null>;
  isLoading: boolean;
}

const JoinRoom: React.FC<JoinRoomProps> = ({ onJoin, isLoading }) => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !room.trim()) {
      setError("Both fields are required.");
      return;
    }
    setError(null);
    const err = await onJoin({ username: username.trim(), room: room.trim() });
    if (err) {
      setError(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-dark-900 px-4">
      <div className="w-full max-w-md bg-dark-800 p-8 rounded-xl shadow-2xl border border-dark-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">SecureRoom</h1>
          <p className="text-slate-400">Join a private channel instantly.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-white placeholder-dark-600 transition-all"
              placeholder="e.g. Maverick"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={15}
            />
          </div>

          <div>
            <label htmlFor="room" className="block text-sm font-medium text-slate-300 mb-1">
              Room Code
            </label>
            <input
              type="text"
              id="room"
              className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-white placeholder-dark-600 transition-all"
              placeholder="e.g. confidential-1"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              maxLength={20}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-accent-600 hover:bg-accent-500 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connecting...' : 'Join Room'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;