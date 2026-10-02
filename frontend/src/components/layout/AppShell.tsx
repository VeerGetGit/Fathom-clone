import { NavLink, Outlet } from "react-router-dom";
import { Logo } from "../common/Logo";
import { SearchBar } from "./SearchBar";

const TABS = [
  { to: "/", label: "My Calls", end: true },
  { to: "/team-calls", label: "Team Calls" },
  { to: "/playlists", label: "Playlists" },
  { to: "/alerts", label: "Alerts" },
  { to: "/deals", label: "Deals" },
];

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-surface-2 hover:text-white"
    >
      {children}
    </button>
  );
}

export function AppShell() {
  return (
    <div className="flex h-full flex-col">
      <header className="shrink-0 border-b border-line bg-surface">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-2.5">
          <Logo />
          <div className="flex justify-center">
            <SearchBar />
          </div>
          <div className="flex items-center gap-1">
            <IconButton label="Notifications">
              <svg {...iconProps}>
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
            </IconButton>
            <IconButton label="Help">
              <svg {...iconProps}>
                <circle cx="12" cy="12" r="9" />
                <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4" />
                <path d="M12 17.5h.01" />
              </svg>
            </IconButton>
            <IconButton label="Settings">
              <svg {...iconProps}>
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
              </svg>
            </IconButton>
            <span
              title="Guest"
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-black"
            >
              G
            </span>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-4">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `-mb-px whitespace-nowrap border-b-2 px-3 pb-2.5 pt-1.5 text-sm transition ${
                  isActive
                    ? "border-accent font-medium text-accent"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
