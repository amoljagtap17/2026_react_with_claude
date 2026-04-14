import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  // plugins: [react(), tsconfigPaths()],
  plugins: [react()],
  server: {
    host: "localhost",
    port: 3000,
    open: false,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ""),
      },
    },
  },
  preview: {
    host: "localhost",
    port: 3000,
    open: false,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
});
