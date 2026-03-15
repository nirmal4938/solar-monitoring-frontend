import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  optimizeDeps: {
    include: ["echarts", "echarts-for-react", "tslib"],
  },

  server: {
    hmr: {
      overlay: true,
    },
  },
});