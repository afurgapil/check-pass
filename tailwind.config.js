/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        light: "#fdb97e",
        dark: "#b07846",
        darkBlue: "#131837",
      },
    },
  },
  plugins: [],
};
