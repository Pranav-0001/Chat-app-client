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
          '100':'#1e1e2f'
        }
      },
      height:{
        'max':'100vh'
      }
    },
  },
  plugins: [],
}

