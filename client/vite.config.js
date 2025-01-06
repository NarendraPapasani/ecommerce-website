import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "https://ecommerce-website-crkh.onrender.com",
  //       changeOrigin: true,
  //     },
  //   },
  // },
  build: {
    outDir: "dist", // Ensure the output directory is set to "dist"
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
