import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Header from "../Header";
import { Provider } from "react-redux";
import { store } from "../../redux/store";

afterEach(() => {
  cleanup();
});
beforeEach(() => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <Header />
      </Provider>
    </BrowserRouter>
  );
});

describe("Header Component", () => {
  it("should render the header text, login correctly", () => {
    expect(screen.getByText("Estate")).toBeDefined();
    const aLogin = screen.getByText("Log-In");
    expect(aLogin).toBeDefined();

    fireEvent.click(aLogin);
    {/* its point to profile and profile will redirect to login if not auth */ }
    expect(window.location.pathname).toBe("/profile");
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
