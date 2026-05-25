import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Menu, User, LogOut, ChevronDown, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  setMobileOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setMobileOpen }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Overview Dashboard';
      case '/caption':
        return 'AI Caption Generator';
      case '/blog':
        return 'AI Blog Generator';
      case '/notes':
        return 'AI Study Notes';
      case '/templates':
        return 'Prompt Templates';
      case '/history':
        return 'Generation History';
      case '/settings':
        return 'Platform Settings';
      default:
        return 'Lumina AI';
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-dark-950/40 backdrop-blur-md border-b border-dark-700/40 px-6 py-4 flex items-center justify-between">
      {/* Left items: Mobile toggle + Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-lg bg-dark-800/60 border border-dark-700/60 text-slate-400 hover:text-slate-200"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white Outfit">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            Welcome back, {user?.username || 'Creator'}!
          </p>
        </div>
      </div>

      {/* Right items: Notifications + Profile Menu */}
      <div className="flex items-center gap-4">
      
        

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-dark-800/40 border border-dark-700/60 hover:bg-dark-800/80 transition-all duration-200"
          >
            {/* Custom Glowing Avatar */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center text-dark-950 font-bold text-sm shadow-sm shrink-0">
              {user?.username ? user.username.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            
            <span className="text-sm font-semibold text-slate-200 hidden md:block shrink-0">
              {user?.username}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <>
                {/* Backdrop overlay to close dropdown click-out */}
                <div onClick={() => setDropdownOpen(false)} className="fixed inset-0 z-10" />
                
                {/* Dropdown Menu */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2.5 w-56 glass-card border border-dark-700/80 py-2 shadow-2xl z-20"
                >
                  <div className="px-4 py-3 border-b border-dark-700/50">
                    <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-slate-200 truncate font-sans">{user?.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:text-slate-100 hover:bg-dark-700/30 flex items-center gap-3 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Account</span>
                  </button>

                  <div className="border-t border-dark-700/50 my-1"></div>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-dark-700/30 flex items-center gap-3 transition-colors font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
