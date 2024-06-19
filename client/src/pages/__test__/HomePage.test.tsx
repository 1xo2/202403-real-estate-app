import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import HomePage from "../home/HomePage";


afterEach(() => {
  cleanup();
});
beforeEach(() => {
  render(<HomePage />);
});
describe("AboutPage", () => {
  it("should render page correctly", () => {
    expect(screen.getByText("HomePage")).toBeDefined();
  });
});
