import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react';

import api from '../utils/api';

import {
  signOut,
} from 'firebase/auth';

import {
  auth,
} from '../firebase';

interface User {
  _id: string;
  username: string;
  email: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;

  token: string | null;

  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;

  googleLogin: (
    token: string,
    userData: User
  ) => void;

  logout: () => Promise<void>;
}

const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined);

export const AuthProvider:
  React.FC<{
    children: React.ReactNode;
  }> = ({ children }) => {

  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  // LOAD USER ON APP START
  useEffect(() => {

    const loadUser = async () => {

      try {

        const storedToken =
          localStorage.getItem(
            'lumina_token'
          );

        const storedUser =
          localStorage.getItem(
            'lumina_user'
          );

        // NO SESSION
        if (
          !storedToken ||
          !storedUser
        ) {

          setLoading(false);

          return;
        }

        // SET INITIAL STATE
        setToken(storedToken);

        setUser(
          JSON.parse(storedUser)
        );

        // VERIFY SESSION WITH BACKEND
        const res =
          await api.get(
            '/auth/me',
            {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            }
          );

        // UPDATE USER STATE
        setUser(res.data);

        // UPDATE LOCAL STORAGE
        localStorage.setItem(
          'lumina_user',
          JSON.stringify(
            res.data
          )
        );

      } catch (error) {

        console.error(
          'Session verification failed:',
          error
        );

        // CLEAR SESSION
        localStorage.removeItem(
          'lumina_token'
        );

        localStorage.removeItem(
          'lumina_user'
        );

        setUser(null);

        setToken(null);

      } finally {

        setLoading(false);
      }
    };

    loadUser();

  }, []);

  // EMAIL LOGIN
  const login = async (
    email: string,
    password: string
  ) => {

    setLoading(true);

    try {

      const res =
        await api.post(
          '/auth/login',
          {
            email,
            password,
          }
        );

      const {
        token: receivedToken,
        ...userData
      } = res.data;

      // SAVE LOCAL STORAGE
      localStorage.setItem(
        'lumina_token',
        receivedToken
      );

      localStorage.setItem(
        'lumina_user',
        JSON.stringify(
          userData
        )
      );

      // UPDATE STATE
      setToken(receivedToken);

      setUser(userData);

    } catch (error: any) {

      throw new Error(
        error.response?.data
          ?.message ||
          'Login failed. Please check credentials.'
      );

    } finally {

      setLoading(false);
    }
  };

  // EMAIL REGISTER
  const register = async (
    username: string,
    email: string,
    password: string
  ) => {

    setLoading(true);

    try {

      const res =
        await api.post(
          '/auth/register',
          {
            username,
            email,
            password,
          }
        );

      const {
        token: receivedToken,
        ...userData
      } = res.data;

      // SAVE LOCAL STORAGE
      localStorage.setItem(
        'lumina_token',
        receivedToken
      );

      localStorage.setItem(
        'lumina_user',
        JSON.stringify(
          userData
        )
      );

      // UPDATE STATE
      setToken(receivedToken);

      setUser(userData);

    } catch (error: any) {

      throw new Error(
        error.response?.data
          ?.message ||
          'Registration failed.'
      );

    } finally {

      setLoading(false);
    }
  };

  // GOOGLE LOGIN / REGISTER
  const googleLogin = (
    receivedToken: string,
    userData: User
  ) => {

    // SAVE LOCAL STORAGE
    localStorage.setItem(
      'lumina_token',
      receivedToken
    );

    localStorage.setItem(
      'lumina_user',
      JSON.stringify(
        userData
      )
    );

    // UPDATE STATE
    setToken(receivedToken);

    setUser(userData);
  };

  // LOGOUT
  const logout = async () => {

    try {

      // FIREBASE SIGNOUT
      await signOut(auth);

    } catch (error) {

      console.error(
        'Firebase logout error:',
        error
      );
    }

    // CLEAR STORAGE
    localStorage.removeItem(
      'lumina_token'
    );

    localStorage.removeItem(
      'lumina_user'
    );

    // CLEAR STATE
    setToken(null);

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {

  const context =
    useContext(AuthContext);

  if (!context) {

    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};

export default AuthContext;