import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "800px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "spin-slow": "spin .3s linear forwards",
      },
      gridTemplateColumns: {
        "number-5": "75px repeat(4, minmax(0, 1fr))",
        "number-3-action": "50px repeat(3, minmax(0, 1fr)) 75px",
        "number-6": "75px repeat(5, minmax(0, 1fr))",
        "number-8": "50px repeat(5, minmax(0, 1fr)) 125px",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        skies: {
          primary: "#2793F2",
          secondary: "#7abfeb",
          accent: "#F27405",
          neutral: "#1c1917",
          "base-100": "#232e3d",
          info: "#22d3ee",
          success: "#4ade80",
          warning: "#facc15",
          error: "#ef4444",
        },
      },
      "nord",
      "dracula",
    ],
    darkTheme: "skies",
  },
};
export default config;
