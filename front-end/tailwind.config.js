module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        homepage: "url('../src/images/bg.jpg')",
      },
      fontSize: {
        5.5: "5.5rem",
      },
      width: {
        "1000px": "1000px",
        "8.5in": "8.5in",
      },
      minHeight: {
        "11in": "11in",
      },
      padding: {
        "1in": "1in",
      },
      colors: {
        primary: "rgb(232, 230, 231)",
        borderColor: "rgba(0, 0, 0, 0.282)",
      },
      borderRadius: {
        "50px": "50px",
      },
    },
  },
  plugins: [],
};
