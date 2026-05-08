import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/20260508/",
  plugins: [react()],
  server: {
    port: 5173,
  },
});
