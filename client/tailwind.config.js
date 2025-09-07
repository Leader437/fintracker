/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        display: ['Red Hat Display', 'sans-serif'],
      },
      colors: {
        primary: "#242625",
        secondary: "#f7f7fc",
        detail: "#4A4C4D",
        accent: "#7de983",
      },
      screens: {
        'sm': '480px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1200px',
        '2xl': '1440px',
      },
    },
  },
  plugins: [
    function ({ addComponents, theme }) {
      addComponents({
        ".container": {
          width: '100%',
          maxWidth: '1200px',
          paddingRight: '16px',
          paddingLeft: '16px',
          [`@media (min-width: ${theme("screens.md")})`]: {
            paddingRight: "32px",
            paddingLeft: "32px",
          },
          [`@media (min-width: ${theme("screens.lg")})`]: {
            paddingRight: "52px",
            paddingLeft: "52px",
          },
        },
      });
    },
  ],
}