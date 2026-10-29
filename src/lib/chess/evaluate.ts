import { Chess, type Move, type PieceSymbol, type Square } from "chess.js";
import { PIECE_NAME, type Scenario } from "./scenarios";

const VAL: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
const FILES = "abcdefgh";

function captures(ch: Chess, sq: Square) {
  return ch.moves({ verbose: true }).filter((m) => m.to === sq && m.captured);
}

export type Threat = {
  from: Square;
  to: Square;
  piece: PieceSymbol;
  captured: PieceSymbol;
  gain: number;
};

/** Sıradaki tarafın, kazançlı biçimde alabileceği bir taş var mı? */
export function findThreat(ch: Chess): Threat | null {
  let worst: Threat | null = null;
  for (const m of ch.moves({ verbose: true })) {
    if (!m.captured) continue;
    const played = ch.move({ from: m.from, to: m.to, promotion: m.promotion });
    if (!played) continue;
    const defended = ch.moves({ verbose: true }).some((r) => r.to === m.to && r.captured);
    ch.undo();
    const gain = VAL[m.captured] - (defended ? VAL[m.piece] : 0);
    if (gain > 0 && (!worst || gain > worst.gain)) {
      worst = {
        from: m.from,
        to: m.to,
        piece: m.piece,
        captured: m.captured,
        gain,
      };
    }
  }
  return worst;
}

function knightTargets(sq: Square): Square[] {
  const f = FILES.indexOf(sq[0]);
  const r = Number(sq[1]);
  const out: Square[] = [];
  for (const [df, dr] of [
    [1, 2],
    [2, 1],
    [-1, 2],
    [-2, 1],
    [1, -2],
    [2, -1],
    [-1, -2],
    [-2, -1],
  ] as const) {
    const nf = f + df;
    const nr = r + dr;
    if (nf >= 0 && nf < 8 && nr >= 1 && nr <= 8) {
      out.push(`${FILES[nf]}${nr}` as Square);
    }
  }
  return out;
}

function forkVictims(ch: Chess, sq: Square, color: "w" | "b") {
  return knightTargets(sq)
    .map((s) => ({ sq: s, p: ch.get(s) }))
    .filter((x) => x.p && x.p.color !== color);
}

export type EvalResult = { ok: boolean; warn: Square[]; msg: string };

/** mv oynanan hamle, ch hamle yapıldıktan sonraki konum. */
export function evaluateMove(scn: Scenario, mv: Move, ch: Chess): EvalResult {
  if (scn.kind === "mate") {
    if (ch.isCheckmate()) return { ok: true, warn: [], msg: "" };
    if (ch.isStalemate()) {
      return {
        ok: false,
        warn: [],
        msg: "Pat oldu: rakibin hamlesi kalmadı ama şah çekilmedi, oyun berabere biter. Mat için şahın çekilmiş olması gerekir.",
      };
    }
    if (ch.isCheck()) {
      const replies = ch.moves({ verbose: true });
      const kingEscapes = replies.filter((m) => m.piece === "k");
      if (kingEscapes.length) {
        const sqs = kingEscapes.map((m) => m.to);
        return {
          ok: false,
          warn: sqs,
          msg: `Şah çekiyorsun ama şah ${sqs.join(" veya ")} karesine kaçabilir.`,
        };
      }
      const capturers = replies.filter((m) => m.to === mv.to);
      if (capturers.length) {
        return {
          ok: false,
          warn: [capturers[0].from],
          msg: `Şah çekiyorsun ama ${PIECE_NAME[capturers[0].piece]} ${capturers[0].from} şahı çeken taşı alabilir.`,
        };
      }
      return {
        ok: false,
        warn: replies[0] ? [replies[0].from] : [],
        msg: "Şah çekiyorsun ama bir taş araya girerek şahı koruyabilir.",
      };
    }
    return {
      ok: false,
      warn: [],
      msg: "Bu hamle şaha saldırmıyor. Mat için önce şah çekmen gerekir.",
    };
  }

  if (scn.kind === "win") {
    if (mv.to === scn.target) return { ok: true, warn: [], msg: "" };
    if (mv.captured) {
      const rc = captures(ch, mv.to);
      if (rc.length) {
        return {
          ok: false,
          warn: [rc[0].from, mv.to],
          msg: `Bu ${PIECE_NAME[mv.captured]} korumalı: ${PIECE_NAME[rc[0].piece]} ${rc[0].from} geri alır. Hiçbir taşın korumadığı hedefi ara.`,
        };
      }
      return {
        ok: false,
        warn: [],
        msg: "Bu taşı alabilirsin ama daha değerli, bedava bir hedef var.",
      };
    }
    return {
      ok: false,
      warn: [],
      msg: "Bu hamle taş kazandırmıyor. Rakibin, hiçbir taşın korumadığı bir taşı var. Onu bul.",
    };
  }

  if (scn.kind === "fork") {
    if (mv.piece !== "n") {
      return {
        ok: false,
        warn: [],
        msg: "Çatal için atı kullan: at, tek hamlede iki taşa birden saldırabilir.",
      };
    }
    if (captures(ch, mv.to).length) {
      return {
        ok: false,
        warn: [mv.to],
        msg: `At ${mv.to} karesinde alınır. Güvenli bir kare bul.`,
      };
    }
    const victims = forkVictims(ch, mv.to, mv.color).filter(
      (x) => x.p && VAL[x.p.type] >= 3,
    );
    if (victims.length >= 2) return { ok: true, warn: [], msg: "" };
    if (victims.length === 1 && victims[0].p) {
      return {
        ok: false,
        warn: [victims[0].sq],
        msg: `At burada yalnızca ${PIECE_NAME[victims[0].p.type]} ${victims[0].sq} taşına saldırıyor. İki taşa birden saldıracak kareyi ara.`,
      };
    }
    return {
      ok: false,
      warn: [],
      msg: "Bu karede at önemli bir taşa saldırmıyor. İki taşı aynı anda tehdit eden bir kare var.",
    };
  }

  const threat = findThreat(ch);
  if (!threat) return { ok: true, warn: [], msg: "" };
  const attacker = ch.get(threat.from);
  const side = attacker?.color === "b" ? "siyah" : "beyaz";
  return {
    ok: false,
    warn: [threat.from, threat.to],
    msg: `Tehdit sürüyor: ${threat.to} karesindeki ${PIECE_NAME[threat.captured]} hâlâ alınabilir (${side} ${PIECE_NAME[threat.piece]} ${threat.from}).`,
  };
}

export function okMoves(scn: Scenario): Move[] {
  let ch: Chess;
  try {
    ch = new Chess(scn.fen);
  } catch {
    return [];
  }
  const out: Move[] = [];
  for (const m of ch.moves({ verbose: true })) {
    const played = ch.move({ from: m.from, to: m.to, promotion: m.promotion });
    if (!played) continue;
    if (evaluateMove(scn, played, ch).ok) out.push(played);
    ch.undo();
  }
  return out;
}

export function solutionFor(scn: Scenario): Move | null {
  const all = okMoves(scn);
  return all.find((m) => m.from + m.to === scn.prefer) ?? all[0] ?? null;
}
