import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import ProfilePage from "../ProfilePage";

afterEach(() => {
  cleanup();
});
beforeEach(() => {
  render(<ProfilePage />);
});
describe("AboutPage", () => {
  it("should render page correctly", () => {
    expect(screen.getByText("ProfilePage")).toBeDefined();
  });
});
