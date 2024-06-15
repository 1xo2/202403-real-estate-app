import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import AboutPage from "../AboutPage";
import { BrowserRouter } from "react-router-dom";
import React from "react";

afterEach(() => {
  cleanup();
});
beforeEach(() => {
  render(
    <BrowserRouter>
      <AboutPage />
    </BrowserRouter>
  );
});
describe("AboutPage", () => {
  it("should render page correctly", () => {
    expect(screen.getByText("About Page")).toBeDefined()
  });
});
