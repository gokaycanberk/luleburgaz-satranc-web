import type { PieceSymbol } from "chess.js";

export default function PieceGlyph({ type }: { type: PieceSymbol }) {
  if (type === "p") {
    return (
      <svg viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="30" r="12" />
        <path d="M42 43 Q45 58 36 76 L64 76 Q55 58 58 43 Z" />
        <rect x="28" y="76" width="44" height="10" rx="3" />
      </svg>
    );
  }
  if (type === "r") {
    return (
      <svg viewBox="0 0 100 100" aria-hidden>
        <path d="M32 22H42V28H46V22H54V28H58V22H68V38L62 44V70L68 78H32L38 70V44L32 38Z" />
        <rect x="26" y="78" width="48" height="10" rx="3" />
        <path className="d" d="M38 52H62" />
      </svg>
    );
  }
  if (type === "n") {
    return (
      <svg viewBox="0 0 100 100" aria-hidden>
        <path d="M30 80C30 62 34 50 46 42C40 40 34 38 30 34L42 18L46 10L52 18C70 20 78 38 76 58L72 80Z" />
        <rect x="26" y="80" width="48" height="8" rx="3" />
        <circle className="e" cx="55" cy="30" r="2.8" />
        <path className="d" d="M38 36L34 34" />
      </svg>
    );
  }
  if (type === "b") {
    return (
      <svg viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="13" r="5" />
        <path d="M50 19C66 31 68 47 60 57H40C32 47 34 31 50 19Z" />
        <path className="d" d="M55 30L45 43" />
        <rect x="36" y="57" width="28" height="7" rx="2" />
        <path d="M40 64L35 78H65L60 64Z" />
        <rect x="27" y="78" width="46" height="9" rx="3" />
      </svg>
    );
  }
  if (type === "q") {
    return (
      <svg viewBox="0 0 100 100" aria-hidden>
        <path d="M30 78L23 36L38 54L44 28L50 52L56 28L62 54L77 36L70 78Z" />
        <circle cx="23" cy="31" r="5" />
        <circle cx="44" cy="23" r="5" />
        <circle cx="56" cy="23" r="5" />
        <circle cx="77" cy="31" r="5" />
        <rect x="26" y="78" width="48" height="10" rx="3" />
        <path className="d" d="M36 66H64" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <path d="M36 78L30 54Q30 44 50 44Q70 44 70 54L64 78Z" />
      <path d="M46 10H54V18H62V26H54V37H46V26H38V18H46Z" />
      <rect x="26" y="78" width="48" height="10" rx="3" />
      <path className="d" d="M38 62H62" />
    </svg>
  );
}
