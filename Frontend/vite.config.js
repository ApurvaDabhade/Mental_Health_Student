import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@sl": path.resolve(__dirname, "./src/studentlife"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api": { target: "http://127.0.0.1:5000", changeOrigin: true },
      "/health": { target: "http://127.0.0.1:8000", changeOrigin: true },
      "/predict": { target: "http://127.0.0.1:8000", changeOrigin: true },
      "/anomaly": { target: "http://127.0.0.1:8000", changeOrigin: true },
      "/examples": { target: "http://127.0.0.1:8000", changeOrigin: true },
      "/features": { target: "http://127.0.0.1:8000", changeOrigin: true },
    },
  },
  base: "/",
});
