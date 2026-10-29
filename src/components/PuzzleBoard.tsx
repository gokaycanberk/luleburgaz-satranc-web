"use client";

import { useState, useEffect, useRef } from "react";
import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";

// Mate-in-1: Rf8#
const PUZZLE_FEN = "7k/6pp/8/8/8/8/8/3Q1RK1 w - - 0 1";
const SOLUTION_FROM: Square = "f1";
const SOLUTION_TO: Square = "f8";

export default function PuzzleBoard() {
  const [game, setGame] = useState(() => new Chess(PUZZLE_FEN));
  const [revealed, setRevealed] = useState(false);
  const [boardWidth, setBoardWidth] = useState(520);
  const boardSlotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function measure() {
      const slot = boardSlotRef.current;
      const w = window.innerWidth;
      if (w < 1024) {
        const max = slot?.clientWidth || w - 48;
        setBoardWidth(Math.min(Math.max(max, 280), 560));
        return;
      }
      const col = slot?.clientWidth || 560;
      setBoardWidth(Math.min(Math.max(col, 480), 640));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const reveal = () => {
    const g = new Chess(PUZZLE_FEN);
    g.move({ from: SOLUTION_FROM, to: SOLUTION_TO });
    setGame(g);
    setRevealed(true);
  };

  const reset = () => {
    setGame(new Chess(PUZZLE_FEN));
    setRevealed(false);
  };

  const highlight: Record<string, React.CSSProperties> = revealed
    ? {
        [SOLUTION_FROM]: { background: "rgba(217, 198, 138, 0.55)" },
        [SOLUTION_TO]: { background: "rgba(160, 133, 64, 0.55)" },
      }
    : {};

  return (
    <div className="flex flex-col lg:flex-row lg:items-stretch">
      <div
        ref={boardSlotRef}
        className="relative w-full lg:w-[min(58%,640px)] lg:flex-shrink-0 bg-paper-3"
      >
        <div className="w-full">
          <Chessboard
            position={game.fen()}
            boardWidth={boardWidth}
            arePiecesDraggable={false}
            animationDuration={280}
            customBoardStyle={{ boxShadow: "none" }}
            customLightSquareStyle={{ backgroundColor: "#EFE6D0" }}
            customDarkSquareStyle={{ backgroundColor: "#3D342A" }}
            customSquareStyles={highlight}
          />
        </div>
        <div className="absolute top-3 left-3 bg-paper/95 border border-line-soft px-2.5 py-1.5 font-mono text-[10px] tracking-[0.12em] text-ink-3 z-10">
          BEYAZ · bir hamle
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-8 md:px-10 md:py-10 lg:max-w-[380px] lg:flex-none">
        <div className="eyebrow mb-4">
          <span className="eyebrow-dot" />
          {revealed ? "HAMLE" : "BİR BAKIŞ"}
        </div>
        <h3 className="font-serif text-[32px] md:text-[36px] leading-[1.15] mb-3">
          {revealed ? "Kale son sıraya iner." : "Beyaz, bir hamlede mat eder."}
        </h3>
        <p className="text-[18px] leading-[1.55] text-ink-3 mb-6">
          {revealed
            ? "Şahın kaçış karelerini kendi piyonları kapatmış. Bu, arka sıra matının en sade hali."
            : "Taşları sürüklemene gerek yok. İstersen hamleyi biz gösterelim."}
        </p>

        <button
          type="button"
          onClick={revealed ? reset : reveal}
          className="inline-flex w-fit items-center gap-2 px-5 py-2.5 rounded-full text-sm border border-line-soft hover:border-ink transition-all"
        >
          {revealed ? "Başa al" : "Hamleyi gör"}
        </button>
      </div>
    </div>
  );
}
