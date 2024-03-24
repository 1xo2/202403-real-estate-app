import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import RegisterPage from "../RegisterPage";

afterEach(() => {
  cleanup();
});
beforeEach(() => {
  render(<RegisterPage />);
});
describe("AboutPage", () => {
  it("should render page correctly", () => {
    expect(screen.getByText("RegisterPage")).toBeDefined();
  });
});
