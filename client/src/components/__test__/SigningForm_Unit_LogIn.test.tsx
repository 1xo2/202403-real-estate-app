import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it
} from "vitest";
// import mockStore from "../../test/__mocks__/redux";
import { eForms } from "../../share/enums";
import mockStore from "../../test/__mocks__/redux/redux";
import SigningForm from "../SigningForm";

let emailInput: HTMLElement,
  submitButton: HTMLButtonElement,
  registerLink: HTMLElement,
  passwordInput: HTMLElement;



afterEach(() => {
  cleanup();
});


beforeEach(() => {
 
  render(
    <BrowserRouter>q
      <Provider store={mockStore}>
        <SigningForm forms={eForms.login} />
      </Provider>
    </BrowserRouter>
  );
  emailInput = screen.getByPlaceholderText("Email");
  passwordInput = screen.getByPlaceholderText("Password");
  submitButton = screen.getByRole("button", { name: /Log-In/i });
  registerLink = screen.getByRole("link", { name: "Register" });
});

describe("SigningForm Component", () => {
  it("should render page correctly", () => {
    expect(screen.getAllByText("Register")).toBeDefined();
  });
  it("should render SigningForm correctly", () => {
    expect(submitButton).toBeDefined();
    expect(registerLink).toBeDefined();

    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(screen.getByText("Have an account?")).toBeDefined();
  });
  it("should validate email correctly", async () => {
    // Simulate invalid email input
    fireEvent.change(emailInput, { target: { value: "Invalid email format" } });

    fireEvent.click(submitButton);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText("Invalid email format")).toBeDefined();
    });
  });

  it("should show form required validation when only email is filled", async () => {
    // Enter a value only in the email field
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    fireEvent.click(submitButton);

    // Wait for the validation error message to appear
    await waitFor(() => {
      expect(document.querySelector('[id="password"]:invalid')).toBeDefined();
    });
  });
  it("should show form required validation when only password is filled", async () => {
    // Enter a value only in the email field

    fireEvent.change(passwordInput, { target: { value: "test.example.com" } });

    fireEvent.click(submitButton);

    // Wait for the validation error message to appear
    await waitFor(() => {
      expect(document.querySelector('[id="eMail"]:invalid')).toBeDefined();
    });
  });

  it("should navigate to ./register when clicking on the Register link", async () => {
    // Click on the Register link
    fireEvent.click(registerLink);

    // Wait for navigation to complete
    await waitFor(() => {
      // Assert that the URL has changed to ./register
      expect(window.location.pathname).toBe("/register");
    });
  });

  // it('displays a "✅" symbol on the button after successful login', async () => {
  //   fetchMocker.enableMocks(); // Enable mocking before each test
  //   fetchMocker.doMock();
  //   fetchMocker.mockResponseOnce(
  //     JSON.stringify({
  //       success: true,
  //       currentUser: {
  //         userName: "mockedUserName",
  //         eMail: "test@example.com",
  //         createdAt: "2024-04-01",
  //         updatedAt: "2024-04-01",
  //         __v: 0,
  //       },
  //     })
  //   );

  //   // Fill in the form inputs
    // userEvent.type(emailInput, "test@example.com");
  //   userEvent.type(passwordInput, "password");
  //   fireEvent.click(submitButton);

  //   // Wait for the login process to complete and the "✅" symbol to appear
  //   await waitFor(async () => {
  //     console.log("Waiting for the success symbol...");
  //     const successButton = await screen.findByText(
  //       "✅",
  //       {},
  //       { timeout: 5000 }
  //     ); // Adjust the timeout as needed
  //     console.log("Success symbol found:", successButton);
  //     expect(successButton).toBeDefined();
  //   });
  // });
  // it('displays a "✅" symbol on the button after successful login', async () => {
    
    
  //   const data = {
  //     userName: "userC",
  //     eMail: "userC@userC.com",
  //     createdAt: "2024-03-31T16:02:36.794Z",
  //     updatedAt: "2024-03-31T16:02:36.794Z",
  //     __v: 0,
  //   };
    
    
  //   // Dispatch an action
  //   mockStore.dispatch(login_Success(data));

  //   // dispatch(login_Success(data));

  //   // Wait for the login process to complete and the "✅" symbol to appear
  //    await waitFor(async () => {
  //      const successButton = await screen.findByText(
  //        "✅",
  //        {},
  //        { timeout: 10000 }
  //      ); // Adjust the timeout as needed
  //      expect(successButton).toBeDefined();
  //    });
  // });
});
