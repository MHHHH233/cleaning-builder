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
        background: "var(--bg-main)",
        card: "var(--bg-card)",
        primary: "var(--text-primary)",
        muted: "var(--text-muted)",
        "brand-primary": "var(--brand-primary)",
        "brand-foreground": "var(--brand-foreground)",
        "border-color": "var(--border-color)",
        border: "var(--border-color)",
      },
      borderRadius: {
        theme: "var(--radius-base)",
      },
      boxShadow: {
        theme: "var(--shadow-base)",
      },
    },
  },
  plugins: [],
};

export default config;
