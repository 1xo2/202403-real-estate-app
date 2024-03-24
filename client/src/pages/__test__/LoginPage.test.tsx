import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import LoginPage from "../LoginPage";

afterEach(() => {
  cleanup();
});
beforeEach(() => {
  render(<LoginPage />);
});
describe("AboutPage", () => {
  it("should render page correctly", () => {
    expect(screen.getByText("LoginPage")).toBeDefined();
  });
});
