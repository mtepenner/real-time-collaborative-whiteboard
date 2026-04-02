import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import Canvas from '../components/Canvas/Canvas';
import Toolbar from '../components/Toolbar/Toolbar';
import { ArrowLeft, Share2, Users, Check } from 'lucide-react';

const Board = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const { user } = useAuth();
  
  const [copied, setCopied] = useState(false);
  const [activeUsers, setActiveUsers] = useState(1); // Assumes at least the current user is here

  useEffect(() => {
    if (!socket || !boardId) return;

    // 1. Tell the server we are joining this specific whiteboard room
    socket.emit('join-room', { 
      boardId, 
      userId: user?.id, 
      userName: user?.name 
    });

    // 2. Listen for user count updates (You will need to emit this from your Node backend)
    const handleUserUpdate = (count) => {
      setActiveUsers(count);
    };
    socket.on('room-users-update', handleUserUpdate);

    // 3. Cleanup: Tell the server we left when navigating away
    return () => {
      socket.emit('leave-room', boardId);
      socket.off('room-users-update', handleUserUpdate);
    };
  }, [socket, boardId, user]);

  const handleCopyLink = () => {
    // Copies the current URL so the user can paste it in Slack/Discord
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-50 flex flex-col">
      
      {/* --- WORKSPACE HEADER --- */}
      <header className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-20 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="h-6 w-px bg-gray-300"></div>
          
          <h1 className="font-semibold text-gray-800 truncate max-w-[150px] sm:max-w-xs">
            Board: {boardId}
          </h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          {/* Active Users Badge */}
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
            <Users size={16} className="text-blue-600" />
            <span className="hidden sm:inline">{activeUsers} Online</span>
            <span className="sm:hidden">{activeUsers}</span>
          </div>

          {/* Share Button */}
          <button 
            onClick={handleCopyLink}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              copied 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
            }`}
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            <span className="hidden sm:inline">{copied ? 'Copied Link!' : 'Share'}</span>
          </button>
        </div>
      </header>

      {/* --- MAIN DRAWING AREA --- */}
      <main className="flex-1 relative w-full h-full overflow-hidden">
        {/* The Toolbar is absolutely positioned on top of the canvas */}
        <div className="absolute top-4 left-4 z-10">
          <Toolbar />
        </div>
        
        {/* The Canvas fills the entire remaining area */}
        <div className="absolute inset-0">
          <Canvas />
        </div>
      </main>
      
    </div>
  );
};

export default Board;
