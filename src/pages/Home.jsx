import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PenTool, Users, Zap, ArrowRight, LayoutDashboard } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, login, user } = useAuth();
  const navigate = useNavigate();

  // Generates a random URL so users can jump right into testing
  const handleQuickStart = () => {
    const randomRoomId = Math.random().toString(36).substring(2, 8);
    navigate(`/board/${randomRoomId}`);
  };

  const handleGuestLogin = async () => {
    await login({ username: 'Guest_' + Math.floor(Math.random() * 1000) });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-2xl text-gray-800">
          <div className="bg-blue-600 p-2 rounded-lg">
            <PenTool className="text-white" size={24} />
          </div>
          SyncBoard
        </div>
        
        <div>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium hidden sm:block">
                Welcome back, {user?.name}
              </span>
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            </div>
          ) : (
            <button 
              onClick={handleGuestLogin}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Log In
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
          Create, collaborate, and <br className="hidden md:block" />
          <span className="text-blue-600">ideate in real-time.</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          A lightning-fast, infinite whiteboard for remote teams. Draw, plan, and wireframe together without lag. No sign-up required to start sketching.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={handleQuickStart}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-200"
          >
            Start a Free Board
            <ArrowRight size={20} />
          </button>
          
          {!isAuthenticated && (
            <button 
              onClick={handleGuestLogin}
              className="bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Sign up free
            </button>
          )}
        </div>
      </main>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="bg-blue-100 p-4 rounded-full mb-6">
            <Zap className="text-blue-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Zero Latency</h3>
          <p className="text-gray-600">Powered by WebSockets. See your team's cursors and drawings instantly as they happen.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="bg-green-100 p-4 rounded-full mb-6">
            <Users className="text-green-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Multiplayer</h3>
          <p className="text-gray-600">Invite unlimited guests to your board with a single click. Just share the URL.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="bg-purple-100 p-4 rounded-full mb-6">
            <PenTool className="text-purple-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Infinite Canvas</h3>
          <p className="text-gray-600">Never run out of space. Zoom, pan, and expand your ideas without borders.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
