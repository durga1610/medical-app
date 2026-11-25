/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#ecfdf9',
          100: '#d1faf1',
          200: '#a7f3e4',
          300: '#6ee7d5',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0F9D91', // MediAccess Primary
          700: '#0d857b',
          800: '#115e57',
          900: '#134e48',
        },
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#12304A', // MediAccess Secondary Navy
          900: '#0b1d2e',
        },
        softgreen: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
