import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#1D4E3F",
          accent: "#4ED19B",
          dark: "#121212",
          light: "#F9FBF7",
          secondary: "#F6B352",
          alert: "#FF4E6A",
        },
        photo: {
          // Primary Green Palette - Your main theme
          "green-50": "#F0FDF4",
          "green-100": "#E5FEF3",
          "green-200": "#6CAD9D",
          "green-300": "#09392D",
          "green-400": "#0A4A3A",
          "green-500": "#0B5B47",
          "green-600": "#0C6C54",
          "green-700": "#0D7D61",
          "green-800": "#0E8E6E",
          "green-900": "#0F9F7B",

          // Complementary Colors - Earth tones that work with green
          "sage-50": "#F6F7F4",
          "sage-100": "#E8EBE3",
          "sage-200": "#D1D7C7",
          "sage-300": "#B4C3A8",
          "sage-400": "#97AF89",
          "sage-500": "#7A9B6A",
          "sage-600": "#5D7B4B",
          "sage-700": "#405B2C",
          "sage-800": "#233B0D",
          "sage-900": "#061B00",

          // Accent Colors - Warm earth tones
          "amber-50": "#FFFBEB",
          "amber-100": "#FEF3C7",
          "amber-200": "#FDE68A",
          "amber-300": "#FCD34D",
          "amber-400": "#FBBF24",
          "amber-500": "#F59E0B",
          "amber-600": "#D97706",
          "amber-700": "#B45309",
          "amber-800": "#92400E",
          "amber-900": "#78350F",

          // Neutral Colors - Warm grays that complement green
          "stone-50": "#FAFAF9",
          "stone-100": "#F5F5F4",
          "stone-200": "#E7E5E4",
          "stone-300": "#D6D3D1",
          "stone-400": "#A8A29E",
          "stone-500": "#78716C",
          "stone-600": "#57534E",
          "stone-700": "#44403C",
          "stone-800": "#292524",
          "stone-900": "#1C1917",

          // Status Colors - Harmonious with green theme
          "emerald-50": "#ECFDF5",
          "emerald-100": "#D1FAE5",
          "emerald-200": "#A7F3D0",
          "emerald-300": "#6EE7B7",
          "emerald-400": "#34D399",
          "emerald-500": "#10B981",
          "emerald-600": "#059669",
          "emerald-700": "#047857",
          "emerald-800": "#065F46",
          "emerald-900": "#064E3B",

          "rose-50": "#FFF1F2",
          "rose-100": "#FFE4E6",
          "rose-200": "#FECDD3",
          "rose-300": "#FDA4AF",
          "rose-400": "#FB7185",
          "rose-500": "#F43F5E",
          "rose-600": "#E11D48",
          "rose-700": "#BE123C",
          "rose-800": "#9F1239",
          "rose-900": "#881337",

          // Legacy colors for compatibility
          "white-100": "#ffffff",
          "white-200": "#FFFEEE",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "#09392D",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "float-y": {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
          "100%": { transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "fade-up": "fade-up var(--dur-base) var(--ease-standard) both",
        "float-y": "float-y 6s var(--ease-standard) infinite",
        marquee: "marquee 25s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
