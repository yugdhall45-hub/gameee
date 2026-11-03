/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f5fa',
          100: '#e1ebf5',
          200: '#c5d7eb',
          300: '#99bbde',
          400: '#6499cd',
          500: '#3e7aba',
          600: '#2c609c',
          700: '#244d7e',
          800: '#1b375b',
          900: '#0f243e',
          950: '#0a1626',
        },
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#082f49',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -2px rgba(15, 36, 62, 0.08)',
        'elevated': '0 10px 30px -5px rgba(15, 36, 62, 0.12)',
      }
    },
  },
  plugins: [],
}

