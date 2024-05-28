/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mainColor: "#6F42C1",
        subColor: "#00CCCC",
        darkViolet: "#4B1C71",
        whiteViolet: "#fff0ff",
        backdrop: "#E5E7EB",
      },

      backgroundImage: {
        violetBG: "url('../src/assets/bgViolet.jpg')",
        profileBG: "url('../src/assets/profilebg.jpg')",
      },
    },
  },
  plugins: [],
};
