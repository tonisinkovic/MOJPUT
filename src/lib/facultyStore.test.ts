import { describe, expect, it } from "vitest";
import { facultyUsersGenerated } from "@/data/facultyUsers";
import { facultyCatalog } from "@/lib/facultyCatalog";
import { loginFaculty, logoutFaculty } from "@/lib/facultyStore";

describe("faculty login", () => {
  it("prijava radi korisničkim imenom i emailom kad postoje generirani računi", () => {
    if (facultyUsersGenerated.length === 0) return;
    expect(facultyUsersGenerated).toHaveLength(facultyCatalog.length);
    const fer = facultyUsersGenerated.find((user) => user.facultyId === "fer-zg");
    expect(fer?.username).toBe("fer-zg");
    expect(fer?.password).toBeTruthy();
    const byUser = loginFaculty(fer!.username!, fer!.password);
    expect(byUser?.facultyId).toBe("fer-zg");
    logoutFaculty();
    const byEmail = loginFaculty(fer!.email, fer!.password);
    expect(byEmail?.facultyId).toBe("fer-zg");
    logoutFaculty();
    expect(loginFaculty(fer!.username!, "kriva-lozinka")).toBeNull();
  });
});
