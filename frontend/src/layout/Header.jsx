import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logout successful!');
    navigate('/login'); // Send them back to login page
  };

  return (
    <header className="h-16 bg-[#070707] border-b border-[#282828] flex items-center justify-between px-6 sticky top-0 z-50">
      <Link to="/" className="text-white hover:text-spotify-green transition-colors font-bold text-2xl flex items-center gap-2">
        <div className="bg-spotify-green w-8 h-8 rounded-full flex items-center justify-center">
            <div className="w-1 h-4 bg-black rotate-[25deg] ml-1"></div>
            <div className="w-1 h-5 bg-black rotate-[25deg] ml-0.5"></div>
            <div className="w-1 h-4 bg-black rotate-[25deg] ml-0.5"></div>
        </div>
        Spotify
      </Link>
      
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            {/* User Profile "Pill" */}
            <div className="flex items-center gap-2 bg-black hover:bg-[#282828] p-1 pr-3 rounded-full cursor-pointer transition border border-transparent hover:border-[#333]">
              <img 
                src={user.profilePicture} 
                alt="avatar" 
                className="w-7 h-7 rounded-full object-cover" 
              />
              <span className="text-white text-sm font-bold hidden md:block">
                {user.username}
              </span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>

            {/* Logout Trigger */}
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-white transition-all p-2 flex items-center gap-2 text-sm font-bold border-l border-[#333] ml-2 pl-4"
            >
              <LogOut size={18} />
              <span className="hidden lg:block">Log out</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link to="/register" className="text-gray-400 font-bold hover:text-white transition hover:scale-105">
              Sign up
            </Link>
            <Link to="/login" className="bg-white text-black px-8 py-2.5 rounded-full font-bold hover:scale-105 transition active:scale-95">
              Log in
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;