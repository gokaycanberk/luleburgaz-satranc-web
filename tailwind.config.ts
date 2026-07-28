import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F5F2EA",
          2: "#EBE6D8",
          3: "#DDD5C0",
        },
        ink: {
          DEFAULT: "#141311",
          2: "#3A362E",
          3: "#6B6558",
          4: "#9A9384",
        },
        line: {
          DEFAULT: "#2A2622",
          soft: "rgba(20,19,17,0.12)",
        },
        bordo: {
          DEFAULT: "#7A1E1E",
          dark: "#5C1414",
        },
        gold: {
          DEFAULT: "#B8935A",
          soft: "#D9BF8F",
        },
        board: {
          light: "#EFE6D0",
          dark: "#3D342A",
          lastLight: "#D9C68A",
          lastDark: "#A08540",
        },
      },
      fontFamily: {
        serif: ['var(--font-instrument-serif)', 'Times New Roman', 'serif'],
        sans: ['var(--font-dm-sans)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['var(--font-mono)', 'SF Mono', 'Menlo', 'monospace'],
      },

      letterSpacing: {
        tightest: '-0.03em',
        tightestish: '-0.025em',
        tighterish: '-0.02em',
      },
      maxWidth: {
        container: '1360px',
        narrow: '1080px',
      },
    },
  },
  plugins: [],
};

export default config;
