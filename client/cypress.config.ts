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
  },
});

// e2e: {
//   setupNodeEvents(on, config) {
//     // implement node event listeners here
//   },
// },
