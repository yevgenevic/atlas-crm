const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1e3a5f',
          50: '#f1f5f9',
          100: '#dbe4ef',
          200: '#b9cbe0',
          300: '#8aa9c9',
          400: '#5681ac',
          500: '#356291',
          600: '#284d74',
          700: '#1e3a5f',
          800: '#1a3252',
          900: '#162840',
          950: '#0e1a2b',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px -12px rgba(30, 58, 95, 0.18)',
      },
    },
  },
  plugins: [],
};
