/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#1f1f24',
          surface: '#2a2a31',
          muted: '#8f8f9a',
          border: '#34343d',
          input: '#16161a',
          accent: '#00b37e',
          accentDark: '#009b6d',
          title: '#f5f5f7',
          danger: '#f75a68',
          warning: '#eab308',
          success: '#84cc16',
          info: '#22d3ee',
        },
      },
      boxShadow: {
        soft: '0 6px 18px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
};
