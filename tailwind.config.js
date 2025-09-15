/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#1D2043',
          light: '#DCD7DB',
          blue: '#4A90E2'
        }
      }
    },
  },
  plugins: [],
}