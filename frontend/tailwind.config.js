/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          blue: {
            light: '#F0F9FF',
            DEFAULT: '#BAE6FD',
            dark: '#0284C7',
          },
          yellow: {
            light: '#FEFCE8',
            DEFAULT: '#FEF08A',
            dark: '#CA8A04',
          },
          pink: {
            light: '#FDF2F8',
            DEFAULT: '#FBCFE8',
            dark: '#DB2777',
          },
          green: {
            light: '#F0FDF4',
            DEFAULT: '#BBF7D0',
            dark: '#16A34A',
          },
          purple: {
            light: '#FAF5FF',
            DEFAULT: '#E9D5FF',
            dark: '#9333EA',
          },
        },
      },
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'],
        comfortaa: ['Comfortaa', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
