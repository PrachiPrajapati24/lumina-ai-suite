import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for stored token and user on app mount
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('lumina_token');
      const storedUser = localStorage.getItem('lumina_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        try {
          // Verify with backend that session is still active/valid
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('lumina_user', JSON.stringify(res.data));
        } catch (error) {
          console.error('Session verification failed, logging out:', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: receivedToken, ...userData } = res.data;
      
      localStorage.setItem('lumina_token', receivedToken);
      localStorage.setItem('lumina_user', JSON.stringify(userData));
      
      setToken(receivedToken);
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { username, email, password });
      const { token: receivedToken, ...userData } = res.data;

      localStorage.setItem('lumina_token', receivedToken);
      localStorage.setItem('lumina_user', JSON.stringify(userData));

      setToken(receivedToken);
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('lumina_token');
    localStorage.removeItem('lumina_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
