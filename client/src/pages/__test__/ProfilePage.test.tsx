import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import ProfilePage from "../ProfilePage";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../redux/store";

afterEach(() => {
  cleanup();
});
beforeEach(() => {
  render(
   <BrowserRouter>
      <Provider store={store}>
      <ProfilePage />;        
      </Provider>
    </BrowserRouter>
  )
});
describe("AboutPage", () => {
  it("should render page correctly", () => {
    expect(screen.getByText("Profile Page")).toBeDefined();
  });
});
