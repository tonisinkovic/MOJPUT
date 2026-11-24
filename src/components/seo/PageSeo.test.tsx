import { afterEach, describe, expect, it } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import PageSeo from "./PageSeo";

describe("PageSeo social preview", () => {
  let root: Root;
  let container: HTMLDivElement;

  afterEach(() => {
    act(() => root?.unmount());
    container?.remove();
  });

  it("postavlja OG i Twitter meta tagove", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root.render(
        <PageSeo
          title="Test OG naslov"
          description="Test opis za društvene mreže."
          canonical="https://mojput.com/adventska-liga"
          image="https://mojput.com/og-advent-liga.png"
          imageWidth={1200}
          imageHeight={630}
        />,
      );
    });

    expect(document.title).toBe("Test OG naslov");
    expect(document.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(
      "Test opis za društvene mreže.",
    );
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute("content")).toBe("Test OG naslov");
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute("content")).toBe(
      "https://mojput.com/og-advent-liga.png",
    );
    expect(document.querySelector('meta[property="og:image:width"]')?.getAttribute("content")).toBe("1200");
    expect(document.querySelector('meta[name="twitter:card"]')?.getAttribute("content")).toBe("summary_large_image");
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      "https://mojput.com/adventska-liga",
    );
  });
});