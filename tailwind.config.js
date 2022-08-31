/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        white: {
          DEFAULT: '#fff',
          lightMode_gradient: 'linear-gradient(#f9fafb 74%, #f9fafb 100%)',
        },
        black: {
          darkMode_background: '#333333',
        },
        grey: {
          DEFAULT: '#f9fafb',
          secondary: '#f3f4f6',
          3: '#9ca3af',
          4: '#c4c4c4',
        },
        orange: {
          DEFAULT: '#f97316',
          secondary: '#ffedd5',
        },
        yellow: {
          DEFAULT: '#f59e0b',
          secondary: '#B45309',
        },
        red: {
          DEFAULT: '#b91c1c',
          secondary: '#9f1239',
          3: '#f43f5e',
          4: '#ef4444',
        },
        blue: {
          DEFAULT: '#3b82f6',
          secondary: '#0981c3',
        },
        purple: {
          DEFAULT: '#6d28d9',
          secondary: '#8b5cf6',
          3: '#818cf8',
        },
        teal: {
          DEFAULT: '#14b8a6',
          secondary: '#5eead4',
          3: '#0d9488',
          4: '#2dd4bf',
        },
      },
    },
  },
  plugins: [],
}
