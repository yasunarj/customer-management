import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "duration-[2000ms]",
    "delay-[300ms]",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      height: {
        "screen-vh": "100svh",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "4xl": "0 45px 70px -20px rgba(0, 0, 0, 1)",
      },
      fontFamily: {
        oswald: "var(--font-oswald)",
        ibmPlexSansJP: "var(--font-ibm-plex-sans-jp)",
        playfairDisplay: "var(--font-playfair-display)",
        geist: ['var(--font-geist-sans)', 'sans-serif'],
        geistMono: ['var(--font-geist-mono)', 'monospace'],
        // zenKakuGothic: "var(--font-zen-kaku-gothic)",
        // notoSansJp: "var(--font-noto-sans-jp)",
        // mPlus1p: "var(--font-m-plus-1p)",
        // montserrat: ["var(--font-montserrat)", "sans-serif"],
        // poppins: ["var(--font-poppins)", "sans-serif"],
        // lato: "var(--font-lato)",
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
