import React from 'react';
import { Sun, Moon, Diamond } from 'lucide-react';

export default function Navbar({ theme, toggleTheme }) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-xl flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-500 shadow-lg">
            <Diamond className="-rotate-45 group-hover:-rotate-90 transition-transform duration-500 text-white dark:text-black" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-display font-bold tracking-tight">Pathikatech</span>
            <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-[var(--primary)] -mt-1 opacity-70">Neural Voice Studio</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-10">
          {['Collections', 'Neural Engine', 'Enterprise', 'Curated Docs'].map((item) => (
            <a key={item} href="#" className="text-[11px] uppercase tracking-[0.15em] font-bold text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
              {item}
            </a>
          ))}
        </nav>

        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-[var(--border)] hover:bg-[var(--bg-main)] transition-all duration-300 shadow-sm"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} className="text-[var(--accent)]" /> : <Moon size={18} className="text-[var(--primary)]" />}
        </button>
      </div>
    </header>
  );
}
