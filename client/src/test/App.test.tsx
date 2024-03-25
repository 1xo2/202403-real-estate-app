// import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import App from "../App";

// Renders the NoteList component with available tags and notes with tags.
it("should render App", () => {
  render(<App />);
  const linkElement = screen.getByText(/Estate/i);
  expect(linkElement).toBeDefined();
});
