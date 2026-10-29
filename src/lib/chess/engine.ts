import { Chess, type Move, type Square } from "chess.js";

const PV: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
const TO = {};

function evalBoard(ch: Chess) {
  const b = ch.board();
  let s = 0;
  for (let i = 0; i < 8; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      const c = b[i][j];
      if (!c) continue;
      let v = PV[c.type];
      const cen = 3.5 - Math.abs(j - 3.5) + (3.5 - Math.abs(i - 3.5));
      if (c.type === "p") {
        const adv = c.color === "w" ? 6 - i : i - 1;
        v += adv * 8 + cen * 2;
      } else if (c.type === "n" || c.type === "b") v += cen * 6;
      else if (c.type === "q") v += cen;
      s += c.color === "w" ? v : -v;
    }
  }
  return s;
}

function ordered(ch: Chess) {
  return ch.moves({ verbose: true }).sort((a, b) => {
    return (b.captured ? PV[b.captured] : 0) - (a.captured ? PV[a.captured] : 0);
  });
}

let deadline = Infinity;

function negamax(ch: Chess, depth: number, alpha: number, beta: number, color: number): number {
  if (Date.now() > deadline) throw TO;
  if (depth === 0) return color * evalBoard(ch);
  const moves = ordered(ch);
  if (!moves.length) return ch.isCheck() ? -100000 - depth : 0;
  let best = -Infinity;
  for (const m of moves) {
    ch.move({ from: m.from, to: m.to, promotion: m.promotion });
    let sc: number;
    try {
      sc = -negamax(ch, depth - 1, -beta, -alpha, -color);
    } finally {
      ch.undo();
    }
    if (sc > best) best = sc;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}

function rootSearch(ch: Chess, depth: number, color: number) {
  const moves = ordered(ch);
  const res: { m: Move; sc: number }[] = [];
  for (const m of moves) {
    ch.move({ from: m.from, to: m.to, promotion: m.promotion });
    let sc: number;
    try {
      sc = ch.isCheckmate() ? 1e6 : -negamax(ch, depth - 1, -1e7, 1e7, -color);
    } finally {
      ch.undo();
    }
    res.push({ m, sc });
  }
  return res;
}

/** logic.js pickMove. level: 1 başlangıç, 2 orta, 3 ileri. */
export function pickMove(ch: Chess, level: 1 | 2 | 3): Move | null {
  const maxD = [1, 2, 3][level - 1];
  const noise = [130, 40, 8][level - 1];
  const budget = [300, 800, 1300][level - 1];
  const color = ch.turn() === "w" ? 1 : -1;
  let results: { m: Move; sc: number }[] | null = null;
  deadline = Date.now() + budget;
  try {
    for (let d = 1; d <= maxD; d += 1) results = rootSearch(ch, d, color);
  } catch (e) {
    if (e !== TO) {
      deadline = Infinity;
      throw e;
    }
  }
  deadline = Infinity;
  if (!results) return null;
  let best: Move | null = null;
  let bs = -Infinity;
  for (const r of results) {
    const s = r.sc + Math.random() * noise;
    if (s > bs) {
      bs = s;
      best = r.m;
    }
  }
  return best;
}

export function pickMoveFromFen(fen: string, level: 1 | 2 | 3) {
  const ch = new Chess(fen);
  const m = pickMove(ch, level);
  if (!m) return null;
  return { from: m.from as Square, to: m.to as Square, promotion: m.promotion };
}
