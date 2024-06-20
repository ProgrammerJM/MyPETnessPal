/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        light: {
          // define your light theme colors here
          white: "#FFFFFF",
          mainColor: "#6F42C1",
          subColor: "#00CCCC",
          darkViolet: "#4B1C71",
          whiteViolet: "#fff0ff",
          backdrop: "#E5E7EB",
          // ... other colors ...
        },
        dark: {
          // define your dark theme colors here
          mainColor: "#someColor",
          subColor: "#someColor",
          // ... other colors ...
        },
      },

      backgroundImage: {
        violetBG: "url('/images/bgViolet.jpg')",
        profileBG: "url('/images/profilebg.jpg')",
        homeBG: "url('/images/bg-petness.png')",
      },
    },
  },
  plugins: [],
};
