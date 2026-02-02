import type { Config } from "tailwindcss"
import lineClamp from "@tailwindcss/line-clamp"

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
  extend: {
    colors: {
      bg: "#0B0B0C",
      fg: "#F5F5F2",
      accent: "#C1121F",
      muted: "#6E6E73",
    },
  },
},
  plugins: [lineClamp],
} satisfies Config
