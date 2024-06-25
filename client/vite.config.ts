import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: mode === 'development' ? 'http://localhost:8000' : 'https://real-estate-server-bs48.onrender.com/',//import.meta.env.VITE_APP_API_ENDPOINT,
          secure: false, // Adjust this based on your security requirements
        },
      },
    },
    build: {
      sourcemap: mode === 'development',
    },
  };
});

// // https://vitejs.dev/config/
// export default defineConfig({
//   // mode: process.env.NODE_ENV,
//   plugins: [react()],
//   server: {
//     port: 3000,
//     proxy: {
//       // each time you see "/api" place the target
//       "/api": {
//         target: "http://localhost:8000",
//         // for not using SSL (in prod)
//         secure: false, //isProduction,
//       },
//     },
//   },
// });
