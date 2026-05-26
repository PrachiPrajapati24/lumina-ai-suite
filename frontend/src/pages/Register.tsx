import React, {
  useState,
  useMemo,
} from 'react';
import api from '../utils/api';
import {
  
  Link,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import { useToast } from '../context/ToastContext';

import { motion } from 'framer-motion';

import {
  signInWithPopup,
} from 'firebase/auth';

import {
  auth,
  googleProvider,
} from '../firebase';

import {
  User,
  Mail,
  Lock,
  Zap,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();

  const { showToast } = useToast();

  

  const [username, setUsername] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [formLoading, setFormLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [errorMsg, setErrorMsg] =
    useState('');

  // EMAIL VALIDATION
  const emailValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );
  }, [email]);

  // USERNAME VALIDATION
  const usernameValid = useMemo(() => {
    return username.length >= 3;
  }, [username]);

  // PASSWORD STRENGTH
  const passwordStrength = useMemo(() => {
    let score = 0;

    if (password.length >= 6) score++;

    if (/[A-Z]/.test(password)) score++;

    if (/[0-9]/.test(password)) score++;

    if (/[^A-Za-z0-9]/.test(password))
      score++;

    return score;
  }, [password]);

  const strengthLabel = useMemo(() => {
    if (passwordStrength <= 1)
      return {
        text: 'Weak',
        color: 'bg-red-500',
      };

    if (passwordStrength <= 3)
      return {
        text: 'Medium',
        color: 'bg-yellow-500',
      };

    return {
      text: 'Strong',
      color: 'bg-green-500',
    };
  }, [passwordStrength]);

// GOOGLE REGISTER / LOGIN
const handleGoogleLogin = async () => {
  try {
    setGoogleLoading(true);

    setErrorMsg('');

    // FIREBASE GOOGLE POPUP
    const result = await signInWithPopup(
      auth,
      googleProvider
    );

    const user = result.user;

    // SEND USER DATA TO BACKEND
    const res = await api.post(
      '/auth/google-login',
      {
        username:
          user.displayName ||
          user.email?.split('@')[0],

        email: user.email || '',
      }
    );

  const {
  token,
  _id,
  username,
  email,
} = res.data;

const backendUser = {
  _id,
  username,
  email,
};

// SAVE TOKEN
localStorage.setItem(
  'lumina_token',
  token
);

// SAVE USER
localStorage.setItem(
  'lumina_user',
  JSON.stringify(
    backendUser
  )
);

    // OPTIONAL:
    // FORCE PAGE REFRESH SO AUTH CONTEXT UPDATES
    window.location.href =
      '/dashboard';

    showToast(
      'Google Account Connected',
      'success'
    );

  } catch (err: any) {
    console.error(err);

    setErrorMsg(
      err.message ||
        'Google Authentication Failed'
    );

    showToast(
      err.message ||
        'Google Authentication Failed',
      'error'
    );
  } finally {
    setGoogleLoading(false);
  }
};
  // REGISTER
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !username ||
      !email ||
      !password
    ) {
      setErrorMsg(
        'Please fill in all registration fields.'
      );

      return;
    }

    if (!emailValid) {
      setErrorMsg(
        'Please enter a valid email.'
      );

      return;
    }

    if (!usernameValid) {
      setErrorMsg(
        'Username must be at least 3 characters.'
      );

      return;
    }

    if (password.length < 6) {
      setErrorMsg(
        'Password must be at least 6 characters long.'
      );

      return;
    }

    setFormLoading(true);

    setErrorMsg('');

    try {
      await register(
        username,
        email,
        password
      );

      showToast(
        'Account generated! Welcome to the suite.',
        'success'
      );

      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error(err);

      setErrorMsg(
        err.message ||
          'Registration failed. Email might be in use.'
      );

      showToast(
        err.message ||
          'Registration failed',
        'error'
      );
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6 relative overflow-hidden grid-glow">

      {/* BACKGROUND GLOWS */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-neon-violet/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
        className="w-full max-w-md z-10"
      >

        {/* HEADER */}
        <div className="flex flex-col items-center justify-center text-center mb-8">

          <Link
            to="/"
            className="p-3 bg-gradient-to-br from-neon-cyan to-neon-violet rounded-2xl mb-4 shadow-neon-cyan/20 shadow-lg"
          >
            <Zap className="w-8 h-8 text-dark-950 fill-dark-950" />
          </Link>

          <h2 className="text-3xl font-extrabold Outfit text-white">
            Create Account
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Join the Lumina AI premium suite
          </p>

        </div>

        {/* CARD */}
        <div className="glass-card p-8 border border-dark-700/60 shadow-2xl relative">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* ERROR */}
            {errorMsg && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="p-3.5 bg-red-950/40 border border-red-500/35 rounded-xl text-red-400 text-xs font-semibold flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />

                {errorMsg}
              </motion.div>
            )}

            {/* USERNAME */}
            <div className="space-y-2">

              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Username / Display Name
              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <User className="w-5 h-5" />
                </div>

                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value
                    )
                  }
                  placeholder="CreativeMind"
                  className={`w-full glass-input pl-11 pr-11 transition-all ${
                    username.length > 0
                      ? usernameValid
                        ? 'border-green-500/40 focus:border-green-500'
                        : 'border-red-500/40 focus:border-red-500'
                      : ''
                  }`}
                  required
                />

                {username.length > 0 && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">

                    {usernameValid ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}

                  </div>
                )}

              </div>

            </div>

            {/* EMAIL */}
            <div className="space-y-2">

              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Email Address
              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-5 h-5" />
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="name@example.com"
                  className={`w-full glass-input pl-11 pr-11 transition-all ${
                    email.length > 0
                      ? emailValid
                        ? 'border-green-500/40 focus:border-green-500'
                        : 'border-red-500/40 focus:border-red-500'
                      : ''
                  }`}
                  required
                />

                {email.length > 0 && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">

                    {emailValid ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}

                  </div>
                )}

              </div>

            </div>

            {/* PASSWORD */}
            <div className="space-y-2">

              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Password
              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="At least 6 characters"
                  className="w-full glass-input pl-11 pr-11"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                >

                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}

                </button>

              </div>

              {/* PASSWORD STRENGTH */}
              {password.length > 0 && (
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  className="space-y-2"
                >

                  <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">

                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${
                          passwordStrength *
                          25
                        }%`,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      className={`h-full rounded-full ${strengthLabel.color}`}
                    />

                  </div>

                  <div className="flex items-center justify-between text-xs">

                    <span className="text-slate-500">
                      Password Strength
                    </span>

                    <span
                      className={`font-bold ${
                        strengthLabel.text ===
                        'Weak'
                          ? 'text-red-400'
                          : strengthLabel.text ===
                            'Medium'
                          ? 'text-yellow-400'
                          : 'text-green-400'
                      }`}
                    >
                      {
                        strengthLabel.text
                      }
                    </span>

                  </div>

                </motion.div>
              )}

            </div>

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              disabled={formLoading}
              className="w-full btn-premium-violet flex items-center justify-center gap-2 mt-2 relative overflow-hidden"
            >

              {formLoading ? (
                <div className="flex items-center gap-3">

                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                  <span>
                    Generating Suite...
                  </span>

                </div>
              ) : (
                <>
                  <span>
                    Create Account
                  </span>

                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}

            </button>

            {/* DIVIDER */}
            <div className="relative flex items-center justify-center py-2">

              <div className="absolute w-full border-t border-dark-700/60" />

              <span className="relative px-4 bg-dark-950 text-xs uppercase tracking-[0.25em] text-slate-500">
                Or Continue With
              </span>

            </div>

            {/* GOOGLE BUTTON */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || formLoading}
              className="w-full border border-dark-700/60 bg-dark-900/70 hover:bg-dark-800 hover:shadow-lg hover:shadow-neon-violet/10 transition-all rounded-xl py-3 flex items-center justify-center gap-3 text-sm font-semibold text-slate-200 hover:border-dark-500"
            >

              {googleLoading ? (
                <div className="flex items-center gap-3">

                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                  <span>
                    Connecting...
                  </span>

                </div>
              ) : (
                <>
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="google"
                    className="w-5 h-5"
                  />

                  Continue with Google
                </>
              )}

            </button>

          </form>

        </div>

        {/* FOOTER */}
        <p className="text-center text-sm text-slate-500 mt-6">

          Already have an account?{' '}

          <Link
            to="/login"
            className="font-semibold text-neon-cyan hover:underline hover:text-neon-blue transition-all"
          >
            Sign In Instead
          </Link>

        </p>

      </motion.div>

    </div>
  );
};

export default Register;