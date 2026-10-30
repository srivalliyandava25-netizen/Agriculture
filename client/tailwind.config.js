/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        },
        earth: {
          50: '#fdfbf7',
          100: '#f7f2e7',
          200: '#ede1ca',
          300: '#dfc9a4',
          400: '#ceaa79',
          500: '#ba8d52',
          600: '#a37442',
          700: '#835a35',
          800: '#6c4a30',
          900: '#5a3d2b'
        },
        sand: {
          50: '#faf9f5',
          100: '#f4f2ea',
          200: '#e8e4d6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

