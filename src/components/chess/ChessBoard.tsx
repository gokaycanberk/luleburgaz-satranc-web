"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Chess, type PieceSymbol, type Square } from "chess.js";
import PieceGlyph from "./Pieces";

const FILES = "abcdefgh";

export type MarkKind = "last" | "warn" | "hint" | "mate" | "check";

type Piece = {
  id: number;
  type: PieceSymbol;
  color: "w" | "b";
  sq: Square;
  opacity: number;
  dying: boolean;
  lift: boolean;
};

type Props = {
  fen: string;
  flipped: boolean;
  interactive: boolean;
  marks?: Partial<Record<Square, MarkKind[]>>;
  shake?: Square | null;
  ghost?: { from: Square; to: Square } | null;
  onMove: (from: Square, to: Square) => void;
  reduced: boolean;
};

function coords(sq: Square, flipped: boolean) {
  const f = FILES.indexOf(sq[0]);
  const rk = Number(sq[1]);
  return { col: flipped ? 7 - f : f, row: flipped ? rk - 1 : 8 - rk };
}

function dist(a: Square, b: Square) {
  return Math.abs(FILES.indexOf(a[0]) - FILES.indexOf(b[0])) + Math.abs(Number(a[1]) - Number(b[1]));
}

let pieceSeq = 1;

export default function ChessBoard({
  fen,
  flipped,
  interactive,
  marks = {},
  shake,
  ghost,
  onMove,
  reduced,
}: Props) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selected, setSelected] = useState<Square | null>(null);
  const [cursor, setCursor] = useState<Square>("e4");
  const [drag, setDrag] = useState<{ id: number; x: number; y: number } | null>(null);
  const dragRef = useRef<{ id: number; sq: Square; sx: number; sy: number; moved: boolean } | null>(null);
  const [snap, setSnap] = useState(false);

  const game = useMemo(() => {
    try {
      return new Chess(fen);
    } catch {
      return new Chess();
    }
  }, [fen]);

  useEffect(() => {
    const targets: { type: PieceSymbol; color: "w" | "b"; sq: Square }[] = [];
    game.board().forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell) targets.push({ type: cell.type, color: cell.color, sq: `${FILES[j]}${8 - i}` as Square });
      });
    });
    setPieces((prev) => {
      const free = prev.filter((p) => !p.dying);
      const used = new Set<number>();
      const next: Piece[] = [];
      const take = (t: (typeof targets)[number], p: Piece, moved: boolean) => {
        used.add(p.id);
        next.push({
          ...p,
          sq: t.sq,
          opacity: 1,
          dying: false,
          lift: moved && p.sq !== t.sq,
        });
      };
      for (const t of targets) {
        const same = free.find((p) => !used.has(p.id) && p.sq === t.sq && p.type === t.type && p.color === t.color);
        if (same) take(t, same, false);
      }
      for (const t of targets) {
        if (next.some((p) => !p.dying && p.sq === t.sq && p.type === t.type && p.color === t.color)) continue;
        let best: Piece | null = null;
        let bestD = 1e9;
        for (const p of free) {
          if (used.has(p.id) || p.type !== t.type || p.color !== t.color) continue;
          const d = dist(p.sq, t.sq);
          if (d < bestD) {
            bestD = d;
            best = p;
          }
        }
        if (best) take(t, best, true);
        else next.push({ id: pieceSeq++, type: t.type, color: t.color, sq: t.sq, opacity: 0, dying: false, lift: false });
      }
      for (const p of free) {
        if (!used.has(p.id)) next.push({ ...p, dying: true, opacity: 0, lift: false });
      }
      return next;
    });
    setSelected(null);
  }, [fen, game]);

  useEffect(() => {
    setSnap(true);
    const id = requestAnimationFrame(() => setSnap(false));
    return () => cancelAnimationFrame(id);
  }, [flipped]);

  useEffect(() => {
    const fresh = pieces.some((p) => p.opacity === 0 && !p.dying);
    if (!fresh) return;
    const id = requestAnimationFrame(() => {
      setPieces((prev) => prev.map((p) => (p.opacity === 0 && !p.dying ? { ...p, opacity: 1 } : p)));
    });
    return () => cancelAnimationFrame(id);
  }, [pieces]);

  useEffect(() => {
    if (!pieces.some((p) => p.dying)) return;
    const t = window.setTimeout(() => {
      setPieces((prev) => prev.filter((p) => !p.dying));
    }, reduced ? 0 : 300);
    return () => window.clearTimeout(t);
  }, [pieces, reduced]);

  useEffect(() => {
    if (!pieces.some((p) => p.lift)) return;
    const t = window.setTimeout(() => {
      setPieces((prev) => prev.map((p) => (p.lift ? { ...p, lift: false } : p)));
    }, reduced ? 0 : 320);
    return () => window.clearTimeout(t);
  }, [pieces, reduced]);

  const legal = selected ? game.moves({ square: selected, verbose: true }) : [];

  function sqAt(clientX: number, clientY: number): Square | null {
    const el = boardRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const x = clientX - r.left;
    const y = clientY - r.top;
    if (x < 0 || y < 0 || x >= r.width || y >= r.height) return null;
    const c = Math.min(7, Math.floor((x / r.width) * 8));
    const row = Math.min(7, Math.floor((y / r.height) * 8));
    const file = flipped ? 7 - c : c;
    const rank = flipped ? row + 1 : 8 - row;
    return `${FILES[file]}${rank}` as Square;
  }

  function tryMove(from: Square, to: Square) {
    if (!interactive) return;
    if (!game.moves({ square: from, verbose: true }).some((m) => m.to === to)) return;
    setSelected(null);
    onMove(from, to);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!interactive) return;
    const sq = sqAt(e.clientX, e.clientY);
    if (!sq) return;
    if (selected && selected !== sq && legal.some((m) => m.to === sq)) {
      tryMove(selected, sq);
      return;
    }
    const piece = game.get(sq);
    if (piece && piece.color === game.turn()) {
      setSelected(sq);
      setCursor(sq);
      const inst = pieces.find((p) => !p.dying && p.sq === sq);
      dragRef.current = inst
        ? { id: inst.id, sq, sx: e.clientX, sy: e.clientY, moved: false }
        : null;
      e.currentTarget.setPointerCapture(e.pointerId);
    } else setSelected(null);
  }

  function onPointerMove(e: React.PointerEvent) {
    const d = dragRef.current;
    if (!d || !boardRef.current) return;
    if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 6) d.moved = true;
    if (!d.moved) return;
    const r = boardRef.current.getBoundingClientRect();
    const s = r.width / 8;
    setDrag({ id: d.id, x: e.clientX - r.left - s / 2, y: e.clientY - r.top - s / 2 });
  }

  function endDrag(e: React.PointerEvent, cancel: boolean) {
    const d = dragRef.current;
    dragRef.current = null;
    setDrag(null);
    if (!d?.moved || cancel) return;
    const to = sqAt(e.clientX, e.clientY);
    if (to && to !== d.sq) tryMove(d.sq, to);
  }

  const cells: Square[] = [];
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const file = flipped ? 7 - col : col;
      const rank = flipped ? row + 1 : 8 - row;
      cells.push(`${FILES[file]}${rank}` as Square);
    }
  }

  const ghostPiece = ghost ? pieces.find((p) => !p.dying && p.sq === ghost.from) : null;

  return (
    <div
      ref={boardRef}
      className={`bhy-board${snap ? " snap" : ""}`}
      role="group"
      aria-label="Satranç tahtası"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(e) => endDrag(e, false)}
      onPointerCancel={(e) => endDrag(e, true)}
      onKeyDown={(e) => {
        const order = cells;
        const i = Math.max(0, order.indexOf(cursor));
        const col = i % 8;
        const row = Math.floor(i / 8);
        const go = (c: number, r: number) => {
          if (c < 0 || c > 7 || r < 0 || r > 7) return;
          setCursor(order[r * 8 + c]);
        };
        if (e.key === "ArrowLeft") go(col - 1, row);
        else if (e.key === "ArrowRight") go(col + 1, row);
        else if (e.key === "ArrowUp") go(col, row - 1);
        else if (e.key === "ArrowDown") go(col, row + 1);
        else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!interactive) return;
          if (selected && legal.some((m) => m.to === cursor)) tryMove(selected, cursor);
          else if (game.get(cursor)?.color === game.turn()) setSelected(cursor);
          else setSelected(null);
        } else return;
        e.preventDefault();
      }}
    >
      <div className="bhy-grid">
        {cells.map((sq) => {
          const file = FILES.indexOf(sq[0]);
          const rank = Number(sq[1]);
          const light = (file + rank) % 2 === 1;
          const mark = marks[sq] ?? [];
          const cls = [
            "bhy-sq",
            light ? "light" : "dark",
            selected === sq ? "sel" : "",
            legal.some((m) => m.to === sq && !m.captured) ? "dot" : "",
            legal.some((m) => m.to === sq && m.captured) ? "cap" : "",
            mark.includes("last") ? "last" : "",
            mark.includes("warn") ? "warn" : "",
            mark.includes("hint") ? "hint" : "",
            mark.includes("mate") ? "mate" : "",
            mark.includes("check") ? "check" : "",
          ]
            .filter(Boolean)
            .join(" ");
          const showRank = sq[0] === "a";
          const showFile = sq[1] === "1";
          return (
            <div key={sq} className={cls}>
              <i className="bhy-mk" />
              {showRank ? <span className="rn">{rank}</span> : null}
              {showFile ? <span className="fl">{sq[0]}</span> : null}
            </div>
          );
        })}
      </div>
      <div className="bhy-pieces">
        {pieces.map((p) => {
          const c = coords(p.sq, flipped);
          const dragging = drag?.id === p.id;
          const style: React.CSSProperties = dragging
            ? { transform: `translate(${drag.x}px, ${drag.y}px) scale(1.1)`, opacity: p.opacity, zIndex: 6 }
            : { transform: `translate(${c.col * 100}%, ${c.row * 100}%)`, opacity: p.opacity, zIndex: p.lift ? 3 : undefined };
          return (
            <div
              key={p.id}
              className={`bhy-pc ${p.color === "w" ? "w" : "b"} ${dragging ? "dragging" : ""} ${p.lift ? "lift" : ""} ${shake === p.sq ? "shake" : ""}`}
              style={style}
            >
              <PieceGlyph type={p.type} />
            </div>
          );
        })}
        {ghost && ghostPiece ? <GhostPiece piece={ghostPiece} from={ghost.from} to={ghost.to} flipped={flipped} reduced={reduced} /> : null}
      </div>
      {ghost ? <MoveArrow from={ghost.from} to={ghost.to} flipped={flipped} /> : null}
    </div>
  );
}

function GhostPiece({
  piece,
  from,
  to,
  flipped,
  reduced,
}: {
  piece: Piece;
  from: Square;
  to: Square;
  flipped: boolean;
  reduced: boolean;
}) {
  const [at, setAt] = useState(() => coords(reduced ? to : from, flipped));
  useEffect(() => {
    const start = coords(from, flipped);
    const end = coords(to, flipped);
    if (reduced) {
      setAt(end);
      return;
    }
    setAt(start);
    const t = window.setTimeout(() => setAt(end), 350);
    return () => window.clearTimeout(t);
  }, [from, to, flipped, reduced]);
  return (
    <div
      className={`bhy-pc ghost ${piece.color === "w" ? "w" : "b"}`}
      style={{ transform: `translate(${at.col * 100}%, ${at.row * 100}%)` }}
    >
      <PieceGlyph type={piece.type} />
    </div>
  );
}

function MoveArrow({ from, to, flipped }: { from: Square; to: Square; flipped: boolean }) {
  const a = coords(from, flipped);
  const b = coords(to, flipped);
  const ax = a.col + 0.5;
  const ay = a.row + 0.5;
  const bx = b.col + 0.5;
  const by = b.row + 0.5;
  const dx = bx - ax;
  const dy = by - ay;
  const L = Math.hypot(dx, dy) || 1;
  const ux = dx / L;
  const uy = dy / L;
  const sx = ax + ux * 0.28;
  const sy = ay + uy * 0.28;
  const ex = bx - ux * 0.14;
  const ey = by - uy * 0.14;
  const hd = 0.4;
  const hx = ex - ux * hd;
  const hy = ey - uy * hd;
  const px = -uy;
  const py = ux;
  return (
    <svg className="bhy-arrows" viewBox="0 0 8 8" aria-hidden>
      <g className="bhy-arrow">
        <line x1={sx} y1={sy} x2={hx} y2={hy} strokeWidth="0.17" />
        <polygon points={`${ex},${ey} ${hx + px * 0.24},${hy + py * 0.24} ${hx - px * 0.24},${hy - py * 0.24}`} />
      </g>
    </svg>
  );
}
