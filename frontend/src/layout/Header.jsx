import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown, User, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logout successful!');
    navigate('/login'); 
  };

  return (
    <header className="py-5 bg-[#070707] border-b border-[#282828] flex items-center justify-between px-6 sticky top-0 z-50">
      {/* 1. Logo Section (Untouched) */}
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
            
            {/* 2. STABLE PROFILE SECTION */}
            <div className="relative">
              
              {/* Trigger Pill */}
              <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 bg-black hover:bg-[#282828] p-1 pr-3 rounded-full cursor-pointer transition border border-transparent hover:border-[#333] ${isOpen ? 'bg-[#282828] border-[#333]' : ''}`}
              >
                <img 
                  src={user.profilePicture} 
                  alt="avatar" 
                  className="w-7 h-7 rounded-full object-cover" 
                />
                <span className="text-white text-sm font-bold hidden md:block">
                  {user.username}
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : ''}`} 
                />
              </div>

              {/* Backdrop: Closes the menu when you click anywhere else */}
              {isOpen && (
                <div 
                  className="fixed inset-0 z-40 bg-transparent" 
                  onClick={() => setIsOpen(false)}
                />
              )}

              {/* Dropdown Menu: Positioned strictly to the right edge of the pill */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    // 'absolute right-0' forces it to stay on the right side
                    className="absolute right-0 mt-3 w-48 bg-[#282828] shadow-2xl rounded-md p-1 border border-white/10 z-50 origin-top-right overflow-hidden"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/10 rounded-sm text-sm text-gray-200 transition"
                    >
                      <span>Profile</span>
                      <User size={16} className="text-gray-400" />
                    </Link>
                    
                    <Link
                      to="/settings"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/10 rounded-sm text-sm text-gray-200 transition"
                    >
                      <span>Settings</span>
                      <Settings size={16} className="text-gray-400" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Logout Section (Untouched) */}
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