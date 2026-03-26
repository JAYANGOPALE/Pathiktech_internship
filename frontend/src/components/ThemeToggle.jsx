import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 p-1 transition-colors duration-300 focus:outline-none"
    >
      <motion.div
        className="w-6 h-6 rounded-full bg-white dark:bg-gold-400 flex items-center justify-center shadow-sm"
        animate={{ x: theme === 'dark' ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {theme === 'dark' ? (
          <Moon size={12} className="text-black" />
        ) : (
          <Sun size={12} className="text-gold-600" />
        )}
      </motion.div>
    </button>
  );
}
