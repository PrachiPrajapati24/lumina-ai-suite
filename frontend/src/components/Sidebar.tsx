import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Sparkles,
  FileText,
  BookOpen,
  Layers,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Caption Generator', path: '/caption', icon: Sparkles, color: 'text-neon-cyan' },
    { name: 'AI Blog Generator', path: '/blog', icon: FileText, color: 'text-neon-blue' },
    { name: 'AI Study Notes', path: '/notes', icon: BookOpen, color: 'text-neon-violet' },
    { name: 'Templates', path: '/templates', icon: Layers },
    { name: 'History Logs', path: '/history', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const sidebarVariants = {
    expanded: { width: '260px' },
    collapsed: { width: '80px' },
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
      isActive
        ? 'bg-gradient-to-r from-dark-700/80 to-dark-700/30 text-white border-l-2 border-neon-cyan shadow-sm shadow-neon-cyan/10'
        : 'text-slate-400 hover:text-slate-100 hover:bg-dark-800/30'
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full py-6">
      {/* Brand Logo */}
      <div className="px-6 flex items-center gap-3 shrink-0">
        <div className="p-2 bg-gradient-to-br from-neon-cyan to-neon-violet rounded-xl shadow-neon-cyan/20 shadow-md">
          <Zap className="w-6 h-6 text-dark-950 fill-dark-950 shrink-0" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-bold text-xl tracking-tight Outfit bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-violet bg-clip-text text-transparent"
            >
              Lumina AI
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 mt-8 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={navItemClass}
          >
            <item.icon className={`w-5 h-5 shrink-0 ${item.color || 'text-slate-400 group-hover:text-slate-200'}`} />
            
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium tracking-wide"
              >
                {item.name}
              </motion.span>
            )}

            {/* Collapsed Tooltip */}
            {collapsed && (
              <div className="absolute left-20 scale-0 group-hover:scale-100 bg-dark-900 border border-dark-700 text-slate-100 text-xs px-3 py-2 rounded-lg font-medium shadow-glass transition-all duration-150 z-50 whitespace-nowrap">
                {item.name}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle Switch */}
      <div className="px-4 shrink-0 hidden md:block">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-3 rounded-xl bg-dark-800/40 border border-dark-700/60 text-slate-400 hover:text-slate-200 hover:bg-dark-800/80 transition-all duration-200"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : (
            <div className="flex items-center gap-2 text-sm font-medium">
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse Menu</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={collapsed ? 'collapsed' : 'expanded'}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:block glass-panel h-screen fixed left-0 top-0 z-30 overflow-hidden shrink-0"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="md:hidden glass-panel h-screen fixed left-0 top-0 w-[260px] z-50 overflow-hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
