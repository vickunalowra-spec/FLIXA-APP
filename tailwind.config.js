/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        flixa: {
          gold: '#d4af37',
          cyan: '#00f2ff',
          pink: '#ff007a',
          dark: '#030712'
        }
      }
    },
  },
  plugins: [],
}