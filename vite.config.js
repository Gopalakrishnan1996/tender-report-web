import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base must match the GitHub Pages project path: /<repo>/
export default defineConfig({
  base: "/tender-report-web/",
  plugins: [react()],
  server: { port: 5173, open: true },
});
