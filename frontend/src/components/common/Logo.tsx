import { Link } from "react-router-dom";

export const APP_NAME = "Fathom8x";

/** Speech bubble with a lightning bolt: meeting notes + AI. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M6 4h20a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H15.5L9 28.5V23H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z"
        fill="#06b6d4"
      />
      <path d="M17.6 7.5 11 15.6h4.3l-.9 6.2 6.6-8.1h-4.3z" fill="#0a0a0a" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <LogoMark size={30} />
      <span className="text-lg font-semibold tracking-tight">{APP_NAME}</span>
    </Link>
  );
}
