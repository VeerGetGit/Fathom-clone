import { initials } from "../../lib/format";
import type { Participant } from "../../types";

const FALLBACK = "#52525b";

export function Avatar({
  name,
  color,
  size = 28,
}: {
  name: string;
  color?: string | null;
  size?: number;
}) {
  return (
    <span
      title={name}
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-2 ring-surface"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        backgroundColor: color ?? FALLBACK,
      }}
    >
      {initials(name)}
    </span>
  );
}

export function AvatarStack({ people, max = 4 }: { people: Participant[]; max?: number }) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <div className="flex items-center">
      {shown.map((p, i) => (
        <span key={p.name} className={i ? "-ml-2" : ""}>
          <Avatar name={p.name} color={p.avatar_color} />
        </span>
      ))}
      {extra > 0 && (
        <span className="-ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-[11px] font-medium text-muted ring-2 ring-surface">
          +{extra}
        </span>
      )}
    </div>
  );
}
