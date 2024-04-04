/// <reference types="cypress" />


describe("User Registration", () => {
  it("successfully registers a new user", () => {
    // Check if the environment is set to "test"

    // Cypress is injecting the /false/ part into the URL
    const apiPath = "/api/auth/register"; // "http://localhost:8000/api/auth/register";

    // Intercept the API request based on the environment
    cy.intercept("POST", apiPath, {
      statusCode: 200,
      body: { success: true },      
    }).as("registerRequest");

    cy.visit("/register");

    // Fill out the registration form
    cy.get("#userName").type("testUser");
    cy.get("#eMail").type("test@example.com");
    cy.get("#password").type("password123");

    // Submit the form
    cy.get(".false").click();

    // Wait for the registration request to complete
    cy.wait("@registerRequest", { timeout: 5000 }); // Wait for 5 seconds

    // Verify that the user is redirected after successful registration
    cy.url().should("include", "/login");
  });
});
describe("User Log-in", () => {
  it("successfully login-in a new user", () => {
    // Check if the environment is set to "test"

    // Cypress is injecting the /false/ part into the URL
    const apiPath = "/api/auth/login"; // "http://localhost:8000/api/auth/login";

    // Intercept the API request based on the environment
    cy.intercept("POST", apiPath, {
      statusCode: 200,
      body: { success: true },
    }).as("loginRequest");

    cy.visit("/login");

    // Fill out the registration form
    cy.get("#password").type("password123");
    cy.get("#eMail").type("test@example.com");

    // Submit the form
    cy.get(".false").click();

    // Wait for the registration request to complete
    cy.wait("@loginRequest", { timeout: 5000 }); // Wait for 5 seconds

    // Verify that the user is redirected after successful registration
    cy.url().should("include", "/home");
  });
});
