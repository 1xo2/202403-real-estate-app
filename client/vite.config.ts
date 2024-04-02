import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import dotenv from "dotenv";

// const isProduction = process.env.REACT_APP_ENVIRONMENT === "production";
// console.log('process.env:', process.env)
// console.log('import.meta.env.VITE_REACT_APP_ENVIRONMENT:', import.meta.env.VITE_REACT_APP_ENVIRONMENT);
// console.log("NODE_ENV:", process.env.NODE_ENV);
// console.log('isProduction:', isProduction)
// console.log('process.env:', process.env)

// console.log(import.meta.env) // "123"
// console.log(import.meta.env.VITE_SOME_KEY) // "123"
// console.log('import.meta.env.VITE_REACT_APP_ENVIRONMENT:', import.meta.env.VITE_REACT_APP_ENVIRONMENT)

// console.log('process.env.NODE_ENV:', process.env.NODE_ENV)
// console.log("process.env.XXX:", process.env.VITE_SOME_KEY);
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
