import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { LoadingSpinner } from './LoadingSpinner';

export const ProtectedLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // If AuthContext is checking for local JWT session, display the spinner
  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  // Redirect to sign-in page if user session is not available
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-dark-950 text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{
          marginLeft: collapsed ? '80px' : '260px',
        }}
        // Handled styling fallback for mobile devices
        data-collapsed={collapsed}
      >
        {/* Style injection directly for mobile/desktop margins override */}
        <style>{`
          @media (max-width: 768px) {
            div[data-collapsed] {
              margin-left: 0px !important;
            }
          }
        `}</style>

        {/* Top Navbar */}
        <Navbar setMobileOpen={setMobileOpen} />

        {/* Route pages loaded inside Dashboard Shell */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default ProtectedLayout;
