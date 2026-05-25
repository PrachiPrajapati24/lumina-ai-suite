import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import { ProtectedLayout } from './components/ProtectedLayout';

// Public Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Protected Pages
import { Dashboard } from './pages/Dashboard';
import { CaptionGenerator } from './pages/CaptionGenerator';
import { BlogGenerator } from './pages/BlogGenerator';
import { StudyNotesGenerator } from './pages/StudyNotesGenerator';
import { HistoryPage } from './pages/History';

// IMPORTANT FIX HERE
import Templates from './pages/Templates';

import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Routes>

            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Landing />} />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            {/* PROTECTED ROUTES */}
            <Route element={<ProtectedLayout />}>

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/caption"
                element={<CaptionGenerator />}
              />

              <Route
                path="/blog"
                element={<BlogGenerator />}
              />

              <Route
                path="/notes"
                element={<StudyNotesGenerator />}
              />

              <Route
                path="/templates"
                element={<Templates />}
              />

              <Route
                path="/history"
                element={<HistoryPage />}
              />

              <Route
                path="/settings"
                element={<Settings />}
              />

            </Route>

            {/* FALLBACK */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Routes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;