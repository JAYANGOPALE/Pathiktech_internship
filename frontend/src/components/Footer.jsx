import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gold-400/10 py-6">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-center text-sm text-white/25 font-body">
          © {new Date().getFullYear()}{' '}
          <span className="text-white/40 font-medium">Pathika Technologies</span>
          . All rights reserved.
        </p>
        <p className="text-xs font-mono text-white/15">
          Powered by Sarvam AI
        </p>
      </div>
    </footer>
  );
}
