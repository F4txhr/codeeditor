import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// Vite config: serve existing HTML screens from app/src/main/assets
export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "app/src/main/assets",
  server: {
    port: 5173
  }
});