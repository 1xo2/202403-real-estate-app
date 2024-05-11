import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // mode: process.env.NODE_ENV,
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // each time you see "/api" place the target
      "/api": {
        target: "http://localhost:8000",
        // for not using SSL (in prod)
        secure: false, //isProduction,
      },
    },
  },
});
