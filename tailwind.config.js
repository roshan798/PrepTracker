/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          cyan: '#00E5FF',
          violet: '#9D7FD4',
          rose: '#FF4B6E',
        },
      },
      animation: {
        'fade-in': 'fadeSlideIn 0.35s ease-out forwards',
        'confetti-fall': 'confettiFall linear forwards',
      },
    },
  },
  plugins: [],
};
