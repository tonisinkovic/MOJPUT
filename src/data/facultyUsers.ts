import type { FacultyUser } from "@/types/faculty";

const generated = import.meta.glob("./facultyUsers.generated.ts", { eager: true }) as Record<
  string,
  { facultyUsersGenerated?: FacultyUser[] }
>;

export const facultyUsersGenerated: FacultyUser[] =
  Object.values(generated)[0]?.facultyUsersGenerated ?? [];
