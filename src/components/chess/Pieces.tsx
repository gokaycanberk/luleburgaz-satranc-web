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
      <svg
        viewBox="0.5 -1.5 30 34"
        aria-hidden
        style={{ strokeWidth: 0.65 }}
      >
        {/* Referans: horse-head-chess-piece-outline (SVG Repo) — dolu silüet */}
        <g transform="translate(15.3 15.3) scale(0.88) translate(-15.3 -15.3)">
          <path d="M24.552,24.691c-0.082-0.322-0.13-0.729,0.008-1.039c0.045-0.103,0.184-0.414,0.874-0.604l1.032-0.284l-0.446-0.975c-1.087-2.369-0.084-6.596,0.063-7.001c-0.009,0.025-0.019,0.043-0.024,0.055c0.021-0.042,1.771-4.52-3.737-9.172c-2.363-1.996-3.257-2.439-3.848-2.732c-0.485-0.24-0.706-0.35-1.968-1.839L15.578,0l-0.595,1.312c-0.777,1.713-0.796,2.938-0.617,3.736c-0.622,0.231-1.484,0.582-2.391,1.042c-2.358,1.198-3.848,2.538-4.433,3.986c-1.385,1.884-3.189,2.732-3.204,2.74L4.271,12.85c-0.298,0.166-0.632,0.517-0.679,1.004c-0.024,0.247,0.014,0.727,0.531,1.162l0.062,0.048c0.016,0.011,1.604,1.14,2.434,2.384c0.376,0.562,0.923,0.874,1.541,0.874c0.497,0,0.885-0.207,1.012-0.284c0.717-0.41,2.574-1.343,4.073-1.661c-3.473,3.034-4.316,6.193-4.412,8.314H7.021v5.91h19.995v-5.91H24.552z" />
        </g>
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
      {/* Gövde */}
      <path d="M36 78L30 54Q30 44 50 44Q70 44 70 54L64 78Z" />
      {/* Taç — üçgen uçlu, haç yok */}
      <path d="M34 40L30 22L42 30L50 10L58 30L70 22L66 40Z" />
      <rect x="34" y="38" width="32" height="6" rx="1.5" />
      <rect x="26" y="78" width="48" height="10" rx="3" />
      <path className="d" d="M38 62H62" />
    </svg>
  );
}
