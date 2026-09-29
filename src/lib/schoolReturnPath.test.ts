import { describe, expect, it } from "vitest";
import { safeSchoolReturnPath } from "@/lib/schoolCmsApi";

describe("safeSchoolReturnPath", () => {
  it("propušta profil škole i dashboard", () => {
    expect(safeSchoolReturnPath("/srednje-skole/srednja-skola-jure-kastelan-omis")).toBe(
      "/srednje-skole/srednja-skola-jure-kastelan-omis",
    );
    expect(safeSchoolReturnPath("/skola/dashboard")).toBe("/skola/dashboard");
  });

  it("odbija vanjske i čudne putanje", () => {
    expect(safeSchoolReturnPath("https://evil.example/x")).toBe("/skola/dashboard");
    expect(safeSchoolReturnPath("//evil.example")).toBe("/skola/dashboard");
    expect(safeSchoolReturnPath("/prijava")).toBe("/skola/dashboard");
  });
});
