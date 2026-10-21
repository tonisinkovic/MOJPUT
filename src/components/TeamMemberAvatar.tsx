import type { TeamMember } from "@/data/team";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function TeamMemberAvatar({ member }: { member: TeamMember }) {
  if (member.avatar) {
    return (
      <img
        src={member.avatar}
        alt={member.name}
        className="h-16 w-16 rounded-xl border-2 border-border object-cover shadow-sm"
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={member.name}
      className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-border gradient-hero text-xl font-bold tracking-tight text-primary-foreground shadow-sm"
    >
      {initials(member.name)}
    </div>
  );
}
