import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import AboutPage from "../about/AboutPage";
import { BrowserRouter } from "react-router-dom";

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
