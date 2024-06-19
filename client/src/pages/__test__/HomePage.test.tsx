import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import HomePage from "../home/HomePage";
import { BrowserRouter } from "react-router-dom";


afterEach(() => {
  cleanup();
});
beforeEach(() => {
  render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
});
describe("AboutPage", () => {
  it("should render page correctly", () => {
    expect(screen.getByText("perfect")).toBeDefined();
  });
});
