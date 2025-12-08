import type { Config } from "tailwindcss";

const config: Config = {
  // FIX: This pattern "./src/**/*.{...}" catches EVERYTHING inside src
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  // FIX: Comment out plugins for now to ensure base styles load first
  plugins: [], 
};
export default config;