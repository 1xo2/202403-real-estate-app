// import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import App from "../App";
import { BrowserRouter } from "react-router-dom";

// Renders the NoteList component with available tags and notes with tags.
it("should render App", () => {

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
const linkElement = screen.getByText(/Hello/i);
expect(linkElement).toBeDefined();

});
