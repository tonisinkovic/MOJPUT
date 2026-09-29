import { describe, expect, it } from "vitest";
import { facultyCatalog, inferFacultyArea } from "@/lib/facultyCatalog";
import { RESERVED_FACULTY_SLUGS } from "@/lib/facultySlug";

describe("faculty catalog", () => {
  it("ima jedinstven id za svaki fakultet u katalogu", () => {
    const ids = facultyCatalog.map((faculty) => faculty.id);
    expect(ids.length).toBeGreaterThan(140);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ne koristi rezervirane rute kao id", () => {
    for (const faculty of facultyCatalog) {
      expect(RESERVED_FACULTY_SLUGS.has(faculty.id)).toBe(false);
    }
  });

  it("čuva postojeće id-eve FER, EFST i MEDRI", () => {
    expect(facultyCatalog.find((faculty) => faculty.id === "fer-zg")?.name).toMatch(/elektrotehnike/i);
    expect(facultyCatalog.find((faculty) => faculty.id === "efst-split")?.city).toBe("Split");
    expect(facultyCatalog.find((faculty) => faculty.id === "medri-ri")?.city).toBe("Rijeka");
  });

  it("svaki profil ima sveučilište, grad i područje", () => {
    for (const faculty of facultyCatalog) {
      expect(faculty.university.length).toBeGreaterThan(3);
      expect(faculty.city.length).toBeGreaterThan(1);
      expect(faculty.area.length).toBeGreaterThan(2);
    }
  });

  it("uključuje ekonomske fakultete u Rijeci i Dubrovniku", () => {
    expect(facultyCatalog.some((faculty) => faculty.city === "Rijeka" && /ekonomski fakultet/i.test(faculty.name))).toBe(
      true,
    );
    expect(
      facultyCatalog.some((faculty) => faculty.city === "Dubrovnik" && /ekonomski fakultet/i.test(faculty.name)),
    ).toBe(true);
  });

  it("FOI i Geotehnički fakultet UNIZG su u Varaždinu", () => {
    const foi = facultyCatalog.find(
      (faculty) => faculty.university.includes("Zagrebu") && faculty.name.includes("organizacije i informatike"),
    );
    const geo = facultyCatalog.find(
      (faculty) => faculty.university.includes("Zagrebu") && faculty.name.includes("Geotehnički"),
    );
    expect(foi?.city).toBe("Varaždin");
    expect(geo?.city).toBe("Varaždin");
  });

  it("prepoznaje područja iz naziva", () => {
    expect(inferFacultyArea("Fakultet elektrotehnike i računarstva (FER)")).toBe("Tehnika");
    expect(inferFacultyArea("Ekonomski fakultet")).toBe("Ekonomija");
    expect(inferFacultyArea("Medicinski fakultet")).toBe("Zdravstvo");
    expect(inferFacultyArea("Odjel za kemiju")).toBe("Prirodoslovlje");
    expect(inferFacultyArea("Kemijsko-tehnološki fakultet")).toBe("Tehnika");
    expect(inferFacultyArea("Fakultet za menadžment u turizmu i ugostiteljstvu")).toBe("Turizam");
  });
});
