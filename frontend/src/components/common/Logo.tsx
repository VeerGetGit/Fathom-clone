import { Link } from "react-router-dom";

export const APP_NAME = "Fathom8x";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-sm font-bold text-black">
        F
      </span>
      <span className="text-lg font-semibold tracking-tight">{APP_NAME}</span>
    </Link>
  );
}
