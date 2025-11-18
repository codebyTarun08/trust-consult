/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";

export const content = [
  "./app/**/*.{js,jsx,ts,tsx}", // if you're using app router
];
export const theme = {
  fontFamily: {
    inter: ["Inter", "sans-serif"],
    "edu-sa": ["Edu SA Beginner", "cursive"],
    mono: ["Roboto Mono", "monospace"],
    crimson: ['"Inconsolata"', "cursive"],
    zen: ['"Fira Sans"', "serif"],
  },
  extend: {
    colors: {
      white: "#fff",
      black: "#000",
      transparent: "#ffffff00",
      richblack: {
        5: "#F1F2FF",
        25: "#DBDDEA",
        50: "#C5C7D4",
        100: "#AFB2BF",
        200: "#999DAA",
        300: "#838894",
        400: "#6E727F",
        500: "#585D69",
        600: "#424854",
        700: "#2C333F",
        800: "#161D29",
        900: "#000814",
      },
      richblue: {
        5: "#ECF5FF",
        25: "#C6D6E1",
        50: "#A0B7C3",
        100: "#7A98A6",
        200: "#537988",
        300: "#2D5A6A",
        400: "#073B4C",
        500: "#063544",
        600: "#042E3B",
        700: "#032833",
        800: "#01212A",
        900: "#001B22",
      },
      blue: {
        5: "#EAF5FF",
        25: "#B4DAEC",
        50: "#7EC0D9",
        100: "#47A5C5",
        200: "#118AB2",
        300: "#0F7A9D",
        400: "#0C6A87",
        500: "#0A5A72",
        600: "#074B5D",
        700: "#053B48",
        800: "#022B32",
        900: "#001B1D",
      },
      caribbeangreen: {
        5: "#C1FFFD",
        25: "#83F1DE",
        50: "#44E4BF",
        100: "#06D6A0",
        200: "#05BF8E",
        300: "#05A77B",
        400: "#049069",
        500: "#037957",
        600: "#026144",
        700: "#014A32",
        800: "#01321F",
        900: "#001B0D",
      },
    },
    maxWidth: {
      maxContent: "1260px",
      maxContentTab: "650px",
    },
    boxShadow: {
      circle: "0px 0px 180px 130px rgba(124, 11, 22, 1)",
      circle1: "0px 0px 200px 180px rgba(136, 250, 110, 0.6)",
      circle2: "0px 0px 200px 180px rgba(120, 103, 230, 0.7)",
      circle3: "0px 0px 200px 180px rgba(168, 50, 141, 1)",
    },
    keyframes: {
      fadeIn: {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
      bounceSlow: {
        "0%, 100%": { transform: "translateY(-15%)" },
        "50%": { transform: "translateY(0)" },
      },
    },
    animation: {
      fadeIn: "fadeIn 1s ease-in-out",
      "bounce-slow": "bounceSlow 2s infinite",
    },
  },
};
export const plugins = [
  plugin(function ({ addUtilities }) {
    const newUtilities = {
      ".text-shadow": {
        "text-shadow": "2px 2px 8px rgba(0,0,0,0.3)",
      },
      ".rotate-y-180": {
        transform: "rotateY(180deg)",
      },
      ".scrollbar-hide": {
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      },
    };
    addUtilities(newUtilities, ["responsive", "hover"]);
  }),
];
