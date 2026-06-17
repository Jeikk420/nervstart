/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'zen-bg': '#FAF9F6', 
        'zen-dark': '#2C2C2C', 
      }
    },
  },
  plugins: [],
}