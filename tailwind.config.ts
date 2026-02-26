import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                yellow: {
                    DEFAULT: "#FACC15",
                    50: "#FEFCE8",
                    100: "#FEF9C3",
                    200: "#FEF08A",
                    300: "#FDE047",
                    400: "#FACC15",
                    500: "#EAB308",
                    600: "#CA8A04",
                },
                black: "#000000",
                white: "#FFFFFF",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            animation: {
                "float": "float 6s ease-in-out infinite",
                "float-slow": "floatSlow 8s ease-in-out infinite",
                "pulse-slow": "pulse 3s ease-in-out infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-20px)" },
                },
                floatSlow: {
                    "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
                    "33%": { transform: "translateY(-15px) translateX(10px)" },
                    "66%": { transform: "translateY(10px) translateX(-5px)" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
