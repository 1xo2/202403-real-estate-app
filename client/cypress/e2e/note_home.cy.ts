/// <reference types="cypress" />

import cypress from "cypress";

const TxtTitle = "test note title";
const TxtTag = "test note tag";
const TxtBody =
  "# this is a note body header \n ## this is a smaller font size \n ### this is a smaller font size";
const txtSelectEnterEffect = " ";

type addCommandsProps = {
  txtTitle: string;
  txtTag: string;
  txtBody: string;
  index: string;
};

Cypress.Commands.add(
  "createNewNote",
  ({
    txtTitle = TxtTitle,
    txtTag = TxtTag,
    txtBody = TxtBody,
    index,
  }: addCommandsProps) => {
    //
    const ind: string = index.toString();

    cy.get("a > .btn").click();
    cy.url().should("include", "/newNote");

    // title
    cy.get(":nth-child(1) > .form-control").type(txtTitle + ind);
    // tags
    cy.get(".css-w9q2zk-Input2").type(txtTag + ind + "{enter}");
    //body
    cy.get(":nth-child(2) > .form-control").type(txtBody + ind);
    // save button
    cy.get(".btn-primary").click();
    // cy.url().should("include", "/home");
    cy.url().should("match", /\/$/);

    // console.log("txtTitle:", txtTitle + ind);
    cy.log("txtTitle:", txtTitle + ind);

    cy.get(".fs-5")
      .contains(txtTitle + ind)
      .should("exist");

    cy.get(".text-truncate")
      .contains(txtTag + ind + txtSelectEnterEffect)
      .should("exist");
  }
);

describe("e2e", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("Home Page", () => {
    it("its render and h1 correctly", () => {
      cy.get("h1").first().should("have.text", "Hello");
    });
  });
});
