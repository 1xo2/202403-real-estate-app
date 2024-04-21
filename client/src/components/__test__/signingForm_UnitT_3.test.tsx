import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { createStore } from "@reduxjs/toolkit";
import { rootReducer } from "../../redux/store";
import SigningForm from "../SigningForm";
import { eForms } from "../../share/enums";


const resObj = JSON.stringify({
  success: true,
  user: {
    userName: "testUser",
    eMail: "test@example.com",
    createdAt: "2022-04-11",
    updatedAt: "2022-04-11",
    __v: 1,
  },
});

// Mock the fetch function
global.fetch = vi.fn().mockResolvedValue({
  json: () =>
    Promise.resolve(resObj),
});
// Create a mock store
const store = createStore(rootReducer, {
  user: {
    loading: false,
    error: null,
    currentUser: null,
  },
});

describe("SigningForm component", () => {
  it("submits the form and updates the Redux state", async () => {
   
    render(
      <BrowserRouter>
        <Provider store={store}>
          <SigningForm forms={eForms.login} />
        </Provider>
      </BrowserRouter>
    );

    // Get input elements
    const emailInput: HTMLInputElement = screen.getByTestId("email-input");
    const passwordInput: HTMLInputElement =
      screen.getByPlaceholderText("Password");
    const submitButton: HTMLButtonElement = screen.getByRole("button", {
      name: /Log-In/i,
    });

    // Test email input
    userEvent.type(emailInput, "test@example.com");
    await waitFor(
      () => {
        expect(emailInput.value).toBe("test@example.com");
      },
      { timeout: 3000 }
    );

    // Test password input
    userEvent.type(passwordInput, "test.example.com");
    await waitFor(
      () => {
        expect(passwordInput.value).toBe("test.example.com");
      },
      { timeout: 3000 }
    );

    // Click submit button
    fireEvent.click(submitButton);

    // Wait for the asynchronous actions to finish
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Check that the Redux store was updated
    
    console.log('store.getState().user.currentUser---:', store.getState().user.currentUser)
    const currentUser = store.getState().user.currentUser;
    expect(currentUser).toEqual(resObj);


/// not good!
// state not same as in form

    // // Wait for the success symbol to appear
    // await waitFor(
    //   () => {
    //     const successButton = screen.getByText(/✅/);
    //     expect(successButton).toBeDefined();
    //   },
    //   { timeout: 1000 }
    // );
  });  
});
