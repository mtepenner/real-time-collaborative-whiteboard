import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Clock, Users, LayoutDashboard, LogOut, PenTool } from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Mock data: In a real app, you would fetch this from your database
  const [recentBoards, setRecentBoards] = useState([
    { id: 'board_1a2b', title: 'Q3 Product Wireframes', updatedAt: '2 hours ago', members: 3 },
    { id: 'board_3c4d', title: 'Marketing Campaign Brainstorm', updatedAt: 'Yesterday', members: 5 },
    { id: 'board_5e6f', title: 'System Architecture', updatedAt: 'Oct 12', members: 2 },
  ]);

  // If a user tries to access /dashboard without logging in, send them to home
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleCreateBoard = () => {
    // Generate a secure-looking random string for the new board ID
    const newBoardId = Math.random().toString(36).substring(2, 10);
    navigate(`/board/${newBoardId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 font-bold text-xl text-gray-800">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <PenTool className="text-white" size={20} />
          </div>
          SyncBoard
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={user?.avatar} alt="Profile" className="w-9 h-9 rounded-full border border-gray-200" />
            <span className="font-medium text-gray-700 hidden sm:block">{user?.name}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <LogOut size={18} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <LayoutDashboard className="text-blue-600" />
              Your Workspaces
            </h1>
            <p className="text-gray-500 mt-1">Manage your boards and collaborate with your team.</p>
          </div>
          
          <button 
            onClick={handleCreateBoard}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus size={20} />
            New Board
          </button>
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-4 gap-6">
          
          {/* Create New Card (Alternative to the button) */}
          <div 
            onClick={handleCreateBoard}
            className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all min-h-[200px] group"
          >
            <div className="bg-white p-3 rounded-full mb-3 shadow-sm group-hover:scale-110 transition-transform">
              <Plus size={24} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Create New Board</h3>
            <p className="text-sm text-gray-500 mt-1">Start with a blank canvas</p>
          </div>

          {/* Map through existing boards */}
          {recentBoards.map((board) => (
            <Link 
              to={`/board/${board.id}`} 
              key={board.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-blue-300 transition-all flex flex-col group"
            >
              {/* Mock Board Preview Image (Empty gray space for now) */}
              <div className="h-32 bg-gray-100 border-b border-gray-100 w-full relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                {/* You could eventually generate a low-res base64 image of the canvas and save it to the DB to display here */}
              </div>
              
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                  {board.title}
                </h3>
                
                <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {board.updatedAt}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={14} />
                    {board.members}
                  </div>
                </div>
              </div>
            </Link>
          ))}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
