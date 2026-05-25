import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', fullPage = false }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-20 h-20 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Outer glowing pulsing ring */}
        <div className={`absolute inset-0 rounded-full blur-md opacity-70 bg-gradient-to-tr from-neon-cyan via-neon-blue to-neon-violet animate-pulse ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-12 h-12' : 'w-20 h-20'}`} />
        
        {/* Spinner circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={`relative rounded-full border-t-transparent border-l-transparent bg-transparent ${sizeClasses[size]} border-gradient-to-tr from-neon-cyan via-neon-blue to-neon-violet`}
          style={{
            borderImage: 'linear-gradient(to right, #06b6d4, #3b82f6, #8b5cf6) 1',
            borderRadius: '50%'
          }}
        />
      </div>
      {fullPage && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-gradient-cyan-violet font-semibold tracking-wider text-sm Outfit"
        >
          LUMINA AI SUITE LOADING...
        </motion.p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 bg-dark-950 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-4 bg-dark-700/60 rounded w-2/3"></div>
      <div className="h-4 bg-dark-700/60 rounded w-full"></div>
      <div className="h-4 bg-dark-700/60 rounded w-5/6"></div>
      <div className="h-4 bg-dark-700/60 rounded w-1/2"></div>
    </div>
  );
};
