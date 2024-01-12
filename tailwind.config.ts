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
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "spin-slow": "spin .3s linear forwards",
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
