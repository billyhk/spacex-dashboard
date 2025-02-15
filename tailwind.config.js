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
          DEFAULT: '#000',
          secondary: '#374151',
          3: '#3b3b3c',
          4: '#333333',
          5: '#2d2d2d',
          6: '#303030',
        },
        grey: {
          DEFAULT: '#f9fafb',
          secondary: '#f3f4f6',
          3: '#9ca3af',
          4: '#c4c4c4',
          5: '#6b7280',
          6: '#999999',
          7: '#555555',
          8: '#e5e7eb',
          9: '#f1f2fa',
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
          dark: '#111827',
        },
        purple: {
          DEFAULT: '#6d28d9',
          secondary: '#8b5cf6',
          3: '#818cf8',
          4: '#4F46E5',
        },
        teal: {
          DEFAULT: '#14b8a6',
          secondary: '#5eead4',
          3: '#0d9488',
          4: '#2dd4bf',
        },
        green: {
          dark: '#1c1f37',
          dark_opaque: 'rgba(28, 31, 55, 0.58)',
          dark_secondary: '#242424',
        },
      },
      screens: { smMaxH: { raw: '(max-height: 650px)' } },
      spacing: {
        '1px': '1px',
        '6px': '6px',
        '10px': '10px',
        '11px': '11px',
        '14px': '14px',
        '20px': '20px',
        '40px': '40px',
        '300px': '300px',
        '500px': '500px',
        '550px': '550px',
        '600px': '600px',
        '700px': '700px',
        '800px': '800px',
        table_container_height: 'calc(100vh - 20rem)',
        table_height: 'calc(100vh - 24rem)',
        'table_header_row_above_overflowing-tbody': 'calc(100% - 15px)',
      },
      fontSize: {
        '10px': '10px',
        '20px': '20px',
      },
      boxShadow: {
        button: '0 1px 2px 0 #000000',
        bottom: ' 0px 10px 15px -15px #111',
        bottom_darkMode: '0px 10px 15px -15px #9ca3af',
        title_card: '0 5px 10px 0 #f1f2fa',
        title_card_darkMode: '0 5px 10px 0 #303030',
      },
      keyframes: {
        fadein_drop: {
          '0%': { opacity: '0', transform: 'translateY(-1rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeout_rise: {
          '0%': { opacity: '0', transform: 'translateY(0)' },
          '100%': { opacity: '1', transform: 'translateY(1rem)' },
        },
      },
      animation: {
        fadein_drop: 'fadein_drop 0.25s linear',
        fadeout_rise: 'fadeout_rise 0.25s linear',
      },
      transitionProperty: {
        top: 'top',
      },
    },
  },
  plugins: [],
}
