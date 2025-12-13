import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config: serve static assets from public/
export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  server: {
    port: 5173
  }
});