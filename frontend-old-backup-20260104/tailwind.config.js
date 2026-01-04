/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFF3E4',
        secondary: '#FFE2BF',
        neutral: {
          800: '#081028',
          500: '#7E89AC',
        },
        border: '#343B4F',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        work: ['Work Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
