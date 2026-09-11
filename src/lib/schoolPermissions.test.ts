import { describe, expect, it } from "vitest";

const PUBLIC_STATUSES = new Set(["PUBLISHED"]);
const SCHOOL_EDITABLE = new Set(["DRAFT", "PUBLISHED", "ARCHIVED"]);

function schoolCanSetStatus(from: string, to: string) {
  if (from === "HIDDEN") return false;
  if (to === "HIDDEN") return false;
  return SCHOOL_EDITABLE.has(to);
}

function canAccessPost(actorSchoolId: number, postSchoolId: number, isAdmin: boolean) {
  if (isAdmin) return true;
  return actorSchoolId === postSchoolId;
}

describe("school post permissions", () => {
  it("škola A ne smije dirati objavu škole B", () => {
    expect(canAccessPost(1, 2, false)).toBe(false);
    expect(canAccessPost(1, 1, false)).toBe(true);
    expect(canAccessPost(1, 2, true)).toBe(true);
  });

  it("škola ne može sama sakriti ili odsakriti HIDDEN objavu", () => {
    expect(schoolCanSetStatus("PUBLISHED", "HIDDEN")).toBe(false);
    expect(schoolCanSetStatus("HIDDEN", "PUBLISHED")).toBe(false);
    expect(schoolCanSetStatus("DRAFT", "PUBLISHED")).toBe(true);
    expect(PUBLIC_STATUSES.has("DRAFT")).toBe(false);
  });
});
