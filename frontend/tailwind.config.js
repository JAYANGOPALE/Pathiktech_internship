/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Nunito"', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        cream: { 50: '#fdf8f0', 100: '#faf0dc', 200: '#f5e0b8' },
        saffron: { 300: '#fbbf5a', 400: '#f59e0b', 500: '#d97706', 600: '#b45309' },
        maroon: { 600: '#9b2335', 700: '#7f1d2b', 800: '#641520', 900: '#4a0e18' },
        indigo: { 600: '#3730a3', 700: '#312e81', 800: '#1e1b4b' },
        emerald: { 500: '#10b981', 600: '#059669', 700: '#047857' },
        gold: { 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'spin-slow': 'spin 12s linear infinite',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'namaste-in': 'namasteIn 0.5s ease forwards',
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseRing: { '0%': { transform: 'scale(1)', opacity: '0.8' }, '100%': { transform: 'scale(1.5)', opacity: '0' } },
        shimmer: { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
        wave: { '0%,100%': { transform: 'scaleY(0.3)' }, '50%': { transform: 'scaleY(1)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        namasteIn: { from: { opacity: '0', transform: 'translateY(-20px) scale(0.8)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
      },
      backgroundImage: {
        'rangoli-pattern': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.05'%3E%3Cpath d='M30 0L37.5 22.5L60 30L37.5 37.5L30 60L22.5 37.5L0 30L22.5 22.5z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        'lotus-bg': `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239b2335' fill-opacity='0.03'%3E%3Cellipse cx='40' cy='55' rx='8' ry='15'/%3E%3Cellipse cx='40' cy='55' rx='8' ry='15' transform='rotate(45 40 40)'/%3E%3Cellipse cx='40' cy='55' rx='8' ry='15' transform='rotate(90 40 40)'/%3E%3Cellipse cx='40' cy='55' rx='8' ry='15' transform='rotate(135 40 40)'/%3E%3C/g%3E%3C/svg%3E")`,
      },
      boxShadow: {
        'indian': '0 4px 24px rgba(155, 35, 53, 0.12), 0 1px 4px rgba(155, 35, 53, 0.06)',
        'gold': '0 4px 20px rgba(245, 158, 11, 0.25), 0 1px 4px rgba(245, 158, 11, 0.1)',
        'card': '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};
