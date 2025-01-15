/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,jsx}",
  ],
  plugins: [
    require('tailwindcss-textshadow'),
  ],
  theme: {
    extend: {
      fontFamily: {
        'NumFont': ['NumFont', 'sans-serif'],
        'FiraCode': ['FiraCode', 'sans-serif'],
        'TTHoves': ['TTHoves', 'sans-serif'], 
        'Gilroy': ['Gilroy', 'sans-serif'], 

      },
    },
  },
  plugins: [],
}