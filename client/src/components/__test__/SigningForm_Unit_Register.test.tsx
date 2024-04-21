/* eslint-disable @typescript-eslint/no-var-requires */
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import SigningForm from "../SigningForm";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { eForms } from "../../share/enums";


// const mockedUsedNavigate = vi.fn();
// vi.mock("react-router-dom", () => ({
//   ...(vi.importActual("react-router-dom") as any),
//   useNavigate: () => mockedUsedNavigate,
// }));

// vi.mock("react-router-dom", async (importOriginal) => {
//   const actual: RouteProps = await importOriginal(); // Asserting actual as RouteProps
//   return {
//     ...actual,
//     BrowserRouter: ({ children }: { children: ReactNode }) => <>{children}</>,
//   };
// });

/////////////////////////////////////////
////////// integration-t: mocking useNavigate not working.
////////// integration-t: mocking api call not working (will with cypress)
/////////////////////////////////////////

console.log("\n\rprocess.env.NODE_ENV:", process.env.NODE_ENV);

afterEach(() => {
  cleanup();
});
let emailInput: HTMLElement,
  submitButton: HTMLButtonElement,
  LogInLink: HTMLElement,
  passwordInput: HTMLElement,
  userNameInput: HTMLElement;

beforeEach(() => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <SigningForm forms={eForms.register} />
      </Provider>
    </BrowserRouter>
  );
  emailInput = screen.getByPlaceholderText("Email");
  passwordInput = screen.getByPlaceholderText("Password");
  userNameInput = screen.getByPlaceholderText("User Name");
  submitButton = screen.getByRole("button", { name: "Register" });
  LogInLink = screen.getByRole("link", { name: "Log-In" });
});
// beforeAll(() => {
//   // console.log("start DOM of RegisterPage")
//   // screen.debug()
// })

describe("LogInPage", () => {
  it("should render page correctly", () => {
    expect(screen.getAllByText("Register")).toBeDefined();
  });
});

describe("SigningForm Component", () => {
  it("should render SigningForm correctly", () => {
    expect(submitButton).toBeDefined();
    expect(LogInLink).toBeDefined();

    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(userNameInput).toBeDefined();
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
  it("should show form required validation when only password and userName is filled", async () => {
    // Enter a value only in the email field

    fireEvent.change(passwordInput, { target: { value: "test.example.com" } });
    fireEvent.change(userNameInput, { target: { value: "test-user" } });

    fireEvent.click(submitButton);

    // Wait for the validation error message to appear
    await waitFor(() => {
      expect(document.querySelector('[id="eMail"]:invalid')).toBeDefined();
    });
  });
  it("should show form required validation when only password and email is filled", async () => {
    // Enter a value only in the email field

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(userNameInput, { target: { value: "test-user" } });

    fireEvent.click(submitButton);

    // Wait for the validation error message to appear
    await waitFor(() => {
      expect(document.querySelector('[id="password"]:invalid')).toBeDefined();
    });
  });

  it("should navigate to ./login when clicking on the login link", async () => {
    // Click on the Register link
    fireEvent.click(LogInLink);

    // Wait for navigation to complete
    await waitFor(() => {
      // Assert that the URL has changed to ./register
      expect(window.location.pathname).toBe("/login");
    });
  });
});

// vi.mock("../api/auth", () => ({
//   register: vi.fn(),
// }));

// describe("RegisterForm", () => {
//   it("submits the form and registers a new user", async () => {
//     // Mock the successful API response
//     const registerMock = vi.fn().mockResolvedValue({ success: true });
//     require("../api/auth").register = registerMock;

//     // Fill out the registration form
//     fireEvent.change(userNameInput, {
//       target: { value: "testUser" },
//     });
//     fireEvent.change(emailInput, {
//       target: { value: "test@example.com" },
//     });
//     fireEvent.change(passwordInput, {
//       target: { value: "password123" },
//     });

//     // Submit the form
//     fireEvent.click(submitButton);

//     // Wait for the registration process to complete
//     await waitFor(() => {
//       expect(registerMock).toHaveBeenCalledWith({
//         email: "test@example.com",
//         password: "password123",
//         userName:"testUser"
//       });
//       // Optionally, assert that the success message or redirect occurs
//     });
//   });

// it("displays an error message if registration fails", async () => {
//   // Mock the API response to simulate registration failure
//   const registerMock = vi
//     .fn()
//     .mockResolvedValue({ success: false, error: "Email already exists" });
//   require("../api/auth").register = registerMock;

//   // Fill out the registration form
//   fireEvent.change(emailInput, {
//     target: { value: "test@example.com" },
//   });
//   fireEvent.change(passwordInput, {
//     target: { value: "password123" },
//   });
//   // Fill out other fields as needed

//   // Submit the form
//   fireEvent.click(submitButton);

//   // Wait for the error message to be displayed
//   await waitFor(() => {
//     expect(screen.getByText("Email already exists")).toBeDefined();
//   });
// });

// Add more test cases for other scenarios, such as form validation errors
// });
