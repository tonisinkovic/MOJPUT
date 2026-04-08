import type { UserTypeId } from "@/lib/auth";

export const USER_TYPE_OPTIONS: { id: UserTypeId; label: string }[] = [
  { id: "srednjoskolac", label: "Srednjoškolac" },
  { id: "student", label: "Student / studentica" },
  { id: "profesor", label: "Profesor / profesorica" },
  { id: "roditelj", label: "Roditelj / skrbnik" },
];

export function labelForUserType(t: string | undefined): string {
  return USER_TYPE_OPTIONS.find((x) => x.id === t)?.label ?? "Srednjoškolac";
}
