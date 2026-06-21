import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-auto pt-8 pb-6">
      {/* Decorative rangoli border */}
      <div className="text-center mb-4" style={{ fontSize: '11px', color: '#d97706', opacity: 0.5, letterSpacing: '8px' }}>
        ◆ ✦ ◆ ✦ ◆ ✦ ◆ ✦ ◆
      </div>
      <div style={{ borderTop: '1px solid rgba(217,119,6,0.15)' }} className="pt-5">
        <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '16px' }}>🪷</span>
            <p className="text-sm font-body" style={{ color: '#a07860' }}>
              © {new Date().getFullYear()}{' '}
              <span className="font-semibold" style={{ color: '#7f1d2b' }}>Pathika Technologies</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-devanagari text-sm" style={{ color: '#d97706', opacity: 0.7 }}>
              वाणी से जीवन
            </span>
            <span className="text-xs font-mono" style={{ color: '#c4a882' }}>
              Powered by Sarvam AI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
