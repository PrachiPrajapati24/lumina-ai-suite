import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Zap, ArrowRight } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setErrorMsg('Please fill in all registration fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setFormLoading(true);
    setErrorMsg('');

    try {
      await register(username, email, password);
      showToast('Account generated! Welcome to the suite.', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Registration failed. Email might be in use.');
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6 relative overflow-hidden grid-glow">
      {/* Decorative Neon Spheres */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-neon-violet/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="w-full max-w-md z-10"
      >
        {/* Logo and Greeting */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <Link to="/" className="p-3 bg-gradient-to-br from-neon-cyan to-neon-violet rounded-2xl mb-4 shadow-neon-cyan/20 shadow-lg">
            <Zap className="w-8 h-8 text-dark-950 fill-dark-950" />
          </Link>
          <h2 className="text-3xl font-extrabold Outfit text-white">Create Account</h2>
          <p className="text-sm text-slate-500 mt-1">Join the Lumina AI premium suite</p>
        </div>

        {/* Register Card Form */}
        <div className="glass-card p-8 border border-dark-700/60 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error Message banner */}
            {errorMsg && (
              <div className="p-3.5 bg-red-950/40 border border-red-500/35 rounded-xl text-red-400 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Username Field */}
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
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="CreativeMind"
                  className="w-full glass-input pl-11"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full glass-input pl-11"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full glass-input pl-11"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formLoading}
              className="w-full btn-premium-violet flex items-center justify-center gap-2 mt-2"
            >
              {formLoading ? (
                <span>Generating Suite...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footnote */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-neon-cyan hover:underline hover:text-neon-blue transition-all">
            Sign In Instead
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
export default Register;
