/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      fontFamily:{
        hw:["'Caveat', cursive"]
      },
      colors:{
        primary:{
          '100':'#1e1e2f',
          '200':'#302a3d'
        }
      },
      height:{
        'max':'90vh'
      }
    },
  },
  plugins: [],
}

