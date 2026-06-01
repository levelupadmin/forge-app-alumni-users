import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Standalone alumni-flow prototype — no PWA, no Supabase, no auth.
// Visit http://localhost:8080 after `npm run dev`.
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
