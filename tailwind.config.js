/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ef0e44",
        secondary: "#FF9900",
        accent: "#F97316",
        background: "#FFF9F9",
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
        display: ['Fredoka One', 'cursive'],
      },
    },
  },
  plugins: [],
} 