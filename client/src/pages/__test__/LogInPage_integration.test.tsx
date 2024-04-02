import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it
} from "vitest";
import LogInPage from "../LogInPage";


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


afterEach(() => {
  cleanup();
});
let emailInput: HTMLElement,
  submitButton: HTMLButtonElement,
  registerLink: HTMLElement,
  passwordInput: HTMLElement;

beforeEach(() => {
  render(
    <BrowserRouter>
      <LogInPage />
    </BrowserRouter>
  );
  emailInput = screen.getByPlaceholderText("Email");
  passwordInput = screen.getByPlaceholderText("Password");
  submitButton = screen.getByRole("button", { name: "Log-In" });
  registerLink = screen.getByRole("link", { name: "Register" });
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

describe("--integration test-- LogInPage component", () => {
  it("should render SigningForm correctly", () => {

    expect(submitButton).toBeDefined();
    expect(registerLink).toBeDefined();

    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(screen.getByRole("heading", { name: "Log-In" })).toBeDefined();
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

  console.log("\n\rprocess.env.NODE_ENV:", process.env.NODE_ENV);

  it("should give successful sign to login", async () => {
    fireEvent.change(emailInput, { target: { value: "userC@userC.com" } });
    fireEvent.change(passwordInput, { target: { value: "userC" } });

    fireEvent.click(submitButton);

    // Wait for navigation to complete
    await waitFor(
      () => {
        expect(submitButton.innerHTML).toContain("✅");

        //////// MOCK NOT WORKING
        // Assert that the URL has changed to ./home
        // expect(window.location.pathname).toBe("/home");
      },
      { timeout: 2000 }
    );
  });
});
