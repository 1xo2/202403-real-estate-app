import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/*.cy.ts",
    setupNodeEvents(on, config) {
      // You can implement node event listeners here if needed
      // For example, to print the configuration on test start:
      on('before:run', () => {
        console.log('Cypress configuration:', config);
      });

      return config;
    },
  },
  env: {
    VITE_APP_API_ENDPOINT: process.env.VITE_APP_API_ENDPOINT,
  },
});

// e2e: {
//   setupNodeEvents(on, config) {
//     // implement node event listeners here
//   },
// },
