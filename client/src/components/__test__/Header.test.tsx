import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Header from "../Header";

afterEach(() => {
  cleanup();
});
beforeEach(() => {
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
});

describe("Header Component", () => {
  it("should render the header text, login correctly", () => {
    expect(screen.getByText("Estate")).toBeDefined();
    const aLogin = screen.getByText("Log-In");
    expect(aLogin).toBeDefined();

    fireEvent.click(aLogin);
    expect(window.location.pathname).toBe("/login");
  });
  it("should render links about & home responsively", () => {
    const aHome = screen.getByText("Home");
    const aAbout = screen.getByText("About");
    expect(aHome).toBeDefined();
    expect(aAbout).toBeDefined();

    fireEvent.click(aAbout);
    expect(window.location.pathname).toBe("/about");
    fireEvent.click(aHome);
    expect(window.location.pathname).toBe("/home");
  });
});
