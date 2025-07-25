/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ff',
          100: '#fbeeff',
          200: '#f7deff',
          300: '#f0bfff',
          400: '#e592ff',
          500: '#d764ff',
          600: '#c441ff',
          700: '#a82cff',
          800: '#8a25d4',
          900: '#7121ad',
        },
      },
    },
  },
  plugins: [],
}