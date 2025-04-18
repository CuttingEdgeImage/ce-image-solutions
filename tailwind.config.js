/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'hover:text-brand',
    'text-brand',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#bf0006',
      },
    },
  },
  plugins: [],
}
