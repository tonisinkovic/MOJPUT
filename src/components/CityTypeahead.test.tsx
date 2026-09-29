import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CityTypeahead, matchesCity } from "@/components/CityTypeahead";

describe("matchesCity", () => {
  it("ne filtrira dok ima manje od 2 slova", () => {
    expect(matchesCity("Zagreb", "Z")).toBe(true);
  });

  it("pronalazi grad dok tipkaš, bez obzira na dijakritike", () => {
    expect(matchesCity("Šibenik", "sibe")).toBe(true);
    expect(matchesCity("Split", "ri")).toBe(false);
  });
});

function Harness() {
  const [value, setValue] = useState("");
  return <CityTypeahead cities={["Zagreb", "Split", "Rijeka"]} value={value} onChange={setValue} />;
}

describe("CityTypeahead", () => {
  it("nudi gradove dok se tipka", () => {
    render(<Harness />);

    const input = screen.getByLabelText("Upiši grad");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "ri" } });

    expect(screen.getByRole("option", { name: /rijeka/i })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /zagreb/i })).not.toBeInTheDocument();
  });
});
