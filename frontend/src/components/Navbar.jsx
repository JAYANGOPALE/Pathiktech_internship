import React from 'react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      <div style={{
        background: 'rgba(253,248,240,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(217,119,6,0.15)',
        boxShadow: '0 2px 16px rgba(155,35,53,0.06)',
      }}>
        {/* Tricolor stripe */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #FF9933 33.33%, #ffffff 33.33% 66.66%, #138808 66.66%)' }} />
        
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* Lotus icon */}
            <div className="w-9 h-9 flex items-center justify-center rounded-full"
              style={{ background: 'linear-gradient(135deg, #fdf8f0, #faf0dc)', border: '1.5px solid rgba(217,119,6,0.3)' }}>
              <span style={{ fontSize: '18px' }}>🪷</span>
            </div>
            <div>
              <div className="font-display font-semibold text-xl" style={{ color: '#7f1d2b', letterSpacing: '0.02em' }}>
                Pathikatech
              </div>
              <div className="font-devanagari text-xs" style={{ color: '#d97706', lineHeight: 1.2 }}>वाणी · ध्वनि</div>
            </div>
          </div>

          {/* Badge */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono rounded-full px-3 py-1.5"
            style={{ background: 'rgba(155,35,53,0.06)', border: '1px solid rgba(155,35,53,0.12)', color: '#9b2335' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#059669' }} />
            bulbul:v3
          </div>
        </div>
      </div>
    </header>
  );
}
