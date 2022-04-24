module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      display: ["group-hover"],
      backgroundImage: {
        homepage: "url('../src/images/bg.jpg')",
      },
      fontSize: {
        5.5: "5.5rem",
      },
      width: {
        "1000px": "1000px",
        "8.5in": "8.5in",
        "200px": "200px",
        "60vw": "60vw",
        "500px": "500px",
      },
      height: {
        "30vh": "30vh",
        "10vh": "10vh",
        "80vh": "80vh",
        "11in": "11in",
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
      screens: {
        tablet: "900px",
        print: { raw: "print" },
      },
      borderStyle: ["hover"],
    },
  },
  plugins: [],
};
