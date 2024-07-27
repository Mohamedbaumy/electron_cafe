/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ctail: '#12a0aa',
        cgreen: '#30C78A',
        corange: '#FE9144',
        cblue: '#305DAB',
        dark: {
          100: '#000',
          200: '#0f1117'
        }
      }
    }
  },
  darkMode: 'class',
  plugins: []
}
