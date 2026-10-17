import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ErrorBoundary, { isChunkLoadError } from "./ErrorBoundary";

const Boom = ({ message }: { message: string }) => {
  throw new Error(message);
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ErrorBoundary", () => {
  it("prepoznaje grešku učitavanja chunka", () => {
    expect(isChunkLoadError(new TypeError("Failed to fetch dynamically imported module: /assets/Kviz.js"))).toBe(true);
    expect(isChunkLoadError(new Error("Cannot read properties of undefined"))).toBe(false);
  });

  it("prikazuje zamjenski ekran umjesto bijele stranice", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Boom message="x is undefined" />
      </ErrorBoundary>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Nešto je pošlo po zlu");
    expect(screen.getByRole("button", { name: "Osvježi stranicu" })).toBeInTheDocument();
  });
});
