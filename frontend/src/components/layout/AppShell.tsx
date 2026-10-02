import { NavLink, Outlet } from "react-router-dom";
import { SearchBar } from "./SearchBar";

const NAV = [
  { to: "/", label: "Home", icon: "⌂", end: true },
  { to: "/team-calls", label: "Team Calls", icon: "👥" },
  { to: "/playlists", label: "Playlists", icon: "▤" },
  { to: "/alerts", label: "Alerts", icon: "🔔" },
  { to: "/deals", label: "Deals", icon: "$" },
];

export function AppShell() {
  return (
    <div className="flex h-full">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-line bg-surface md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-sm font-bold text-black">
            F
          </span>
          <span className="text-lg font-semibold tracking-tight">Fathom</span>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-accent-dim font-medium text-accent"
                    : "text-zinc-400 hover:bg-surface-2 hover:text-white"
                }`
              }
            >
              <span className="w-4 text-center">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-4 border-b border-line px-5 py-3">
          <SearchBar />
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
