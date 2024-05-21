import { render, screen } from "@testing-library/react";
import { App } from "../App";
import { QueryClientProvider } from "@tanstack/react-query";
import { client } from "~/stores";

describe("App", () => {
  it("renders the App component", () => {
    render(
      <QueryClientProvider client={client}>
        <App />
      </QueryClientProvider>,
    );

    screen.debug();
  });
});
