import { cleanup, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import RegisterPage from "../RegisterPage";
import { Provider } from "react-redux";
import { store } from "../../redux/store";

afterEach(() => {
  cleanup();
});
beforeEach(() => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <RegisterPage />
      </Provider>
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
    const button = screen.getByRole("button", { name: /Register/i });
    const logInLink = screen.getByRole("link", { name: "Log-In" });

    expect(textInputs.length).toBe(3);
    expect(button).toBeDefined();
    expect(logInLink).toBeDefined();
  });
});
