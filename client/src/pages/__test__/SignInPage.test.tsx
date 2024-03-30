import { cleanup, render, screen } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import SignInPage from "../SignInPage";

afterEach(() => {
  cleanup();
});
beforeEach(() => {
  render(    
    <BrowserRouter>
      <SignInPage />
    </BrowserRouter>
  );
});
// beforeAll(() => {
//   // console.log("start DOM of signInPage")
//   // screen.debug()
// })
describe("SignInPage", () => {
  it("should render page correctly", () => {
    expect(screen.getAllByText("SignIn")).toBeDefined();
  });
  it("should have 3 excisable input text and a button", () => {    
    const textInputs = screen.getAllByRole("textbox");
    const button = screen.getByRole("button", { name: "Sign-In" });
    const registerLink = screen.getByRole("link", { name: "Register" });
    expect(textInputs.length).toBe(3);
    expect(button).toBeDefined();
    expect(registerLink).toBeDefined();
  });
});
