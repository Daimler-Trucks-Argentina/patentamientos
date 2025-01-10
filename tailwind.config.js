/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      dropShadow: {
        '3xl': '0 35px 35px rgba(0, 0, 0, 0.25)',
        '4xl': [
            '0 5px 10px rgba(0, 0, 0, 0.1)',
            '0 3px 40px rgba(0, 0, 0, 0.1)'
        ]
      }
    },
  },
  plugins: [],
}

