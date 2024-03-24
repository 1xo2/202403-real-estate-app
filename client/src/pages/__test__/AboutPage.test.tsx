import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import AboutPage from "../AboutPage";

afterEach(() => {
  cleanup();
});
beforeEach(() => {
  render(<AboutPage />);
});
describe("AboutPage", () => {
  it("should render page correctly", () => {
    expect(screen.getByText("AboutPage")).toBeDefined()
  });
});
