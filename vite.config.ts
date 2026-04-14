import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: "localhost",
    port: 3000,
    open: false,
    strictPort: true,
  },
  preview: {
    host: "localhost",
    port: 3000,
    open: false,
    strictPort: true,
  },
});
