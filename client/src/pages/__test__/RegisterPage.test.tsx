import { cleanup, render, screen } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import RegisterPage from "../RegisterPage";

afterEach(() => {
  cleanup();
});
beforeEach(() => {
  render(
    <BrowserRouter>
      <RegisterPage />
    </BrowserRouter>
  );
});
// beforeAll(() => {
//   // console.log("start DOM of RegisterPage")
//   // screen.debug()
// })
describe("LogInPage", () => {
  it("should render page correctly", () => {
    expect(screen.getAllByText("Register")).toBeDefined();
  });
  it("should have 3 excisable input text and a button", () => {
    const textInputs = screen.getAllByRole("textbox");
    const button = screen.getByRole("button", { name: "Register" });
    const registerLink = screen.getByRole("link", { name: "Register" });
    expect(textInputs.length).toBe(3);
    expect(button).toBeDefined();
    expect(registerLink).toBeDefined();
  });
});
