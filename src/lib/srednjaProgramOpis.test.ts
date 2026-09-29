import { describe, expect, it } from "vitest";
import { kalkulatorSchools } from "@/data/srednjaKalkulator";
import { programOpisParagraphs, resolveProgramOpis } from "@/lib/srednjaProgramOpis";

describe("resolveProgramOpis", () => {
  it("pokriva svaki smjer iz kalkulatora", () => {
    const missing = new Set<string>();
    for (const school of kalkulatorSchools) {
      for (const program of school.programs) {
        const resolved = resolveProgramOpis(program.name);
        if (resolved.opis.id === "nepoznat") missing.add(program.name);
      }
    }
    expect([...missing], [...missing].slice(0, 40).join(" | ")).toEqual([]);
  });

  it("frizer je 3-godišnji zanat", () => {
    const { opis } = resolveProgramOpis("Frizer/Frizerka");
    expect(opis.durationYears).toBe(3);
    expect(opis.kind).toBe("struka");
    expect(opis.summary.toLowerCase()).toMatch(/salon|šišan|kose/);
  });

  it("medicinska sestra traje 5 godina", () => {
    const { opis } = resolveProgramOpis("Medicinska sestra opće njege/medicinski tehničar opće njege");
    expect(opis.durationYears).toBe(5);
  });

  it("glazbenik pripremno traje 2 godine i čuva instrument", () => {
    const resolved = resolveProgramOpis("Glazbenik - pripremno obrazovanje: Violina - temeljni predmet (290002:1997)");
    expect(resolved.opis.durationYears).toBe(2);
    expect(resolved.flags.instrument?.toLowerCase()).toContain("violin");
  });

  it("odjel za sportaše i jezik ostaju zastavice na istoj gimnaziji", () => {
    const resolved = resolveProgramOpis("Opća gimnazija (odjel za sportaše) (320104-S)");
    expect(resolved.opis.id).toBe("opca-gimnazija");
    expect(resolved.flags.sports).toBe(true);
  });

  it("pomoćni programi idu u posebni kurikulum", () => {
    const resolved = resolveProgramOpis("Pomoćni kuhar/Pomoćna kuharica");
    expect(resolved.opis.id).toBe("pomocni-program");
    expect(resolved.flags.special).toBe(true);
  });

  it("opis ima smjer plus točan okvir (matura / HKO), bez lažne mature na 3 godine", () => {
    const frizer = resolveProgramOpis("Frizer/Frizerka");
    const frizerText = programOpisParagraphs(frizer.opis, frizer.flags).join(" ");
    expect(frizerText).toMatch(/4\.1/);
    expect(frizerText).toMatch(/završnog rada/);
    expect(frizerText).not.toMatch(/završava državnom maturom/);

    const sestra = resolveProgramOpis("Medicinska sestra opće njege/medicinski tehničar opće njege");
    const sestraText = programOpisParagraphs(sestra.opis, sestra.flags).join(" ");
    expect(sestraText).toMatch(/4\.2/);
    expect(sestraText).toMatch(/Ispite državne mature možeš polagati/);

    const gimnazija = resolveProgramOpis("Opća gimnazija");
    const gimnazijaText = programOpisParagraphs(gimnazija.opis, gimnazija.flags).join(" ");
    expect(gimnazijaText).toMatch(/hrvatskog, matematike i stranog jezika/);
    expect(programOpisParagraphs(gimnazija.opis, gimnazija.flags).length).toBeGreaterThanOrEqual(2);
  });
});
