import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Deployed to GitHub Pages at https://<user>.github.io/20260508/
// so all asset URLs must be prefixed with "/20260508/".
// Set VITE_BASE=/ when running locally if you ever need the root path.
export default defineConfig({
  base: process.env.VITE_BASE ?? "/20260508/",
  plugins: [react()],
  server: {
    port: 5173,
  },
});
