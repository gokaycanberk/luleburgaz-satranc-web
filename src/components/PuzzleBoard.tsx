"use client";

import { useState, useEffect, useRef } from "react";
import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";

// Mate-in-1: Rf8#
const PUZZLE_FEN = "7k/6pp/8/8/8/8/8/3Q1RK1 w - - 0 1";
const SOLUTION_FROM: Square = "f1";
const SOLUTION_TO: Square = "f8";

type Status = "question" | "correct" | "wrong";

export default function PuzzleBoard() {
  const [game, setGame] = useState(() => new Chess(PUZZLE_FEN));
  const [status, setStatus] = useState<Status>("question");
  const [hintSquares, setHintSquares] = useState<Record<string, React.CSSProperties>>({});
  const [boardWidth, setBoardWidth] = useState(520);
  const boardSlotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function measure() {
      const slot = boardSlotRef.current;
      const w = window.innerWidth;
      if (w < 1024) {
        // Mobile/tablet: fill container width minus border
        const max = slot?.clientWidth || w - 48;
        setBoardWidth(Math.min(Math.max(max, 280), 560));
        return;
      }
      // Desktop: fill the left column — no outer padding, board grows
      const col = slot?.clientWidth || 560;
      setBoardWidth(Math.min(Math.max(col, 480), 640));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const reset = () => {
    setGame(new Chess(PUZZLE_FEN));
    setStatus("question");
    setHintSquares({});
  };

  const showHint = () => {
    setHintSquares({
      [SOLUTION_FROM]: {
        background: "radial-gradient(circle, rgba(122,30,30,0.35) 30%, transparent 32%)",
      },
      [SOLUTION_TO]: {
        background: "radial-gradient(circle, rgba(122,30,30,0.5) 30%, transparent 32%)",
      },
    });
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (status === "correct") return false;
    if (sourceSquare === SOLUTION_FROM && targetSquare === SOLUTION_TO) {
      const g = new Chess(PUZZLE_FEN);
      g.move({ from: SOLUTION_FROM, to: SOLUTION_TO });
      setGame(g);
      setStatus("correct");
      setHintSquares({
        [SOLUTION_FROM]: { background: "rgba(217, 198, 138, 0.5)" },
        [SOLUTION_TO]: { background: "rgba(160, 133, 64, 0.5)" },
      });
      return true;
    }
    setStatus("wrong");
    setTimeout(() => {
      setStatus("question");
      setHintSquares({});
    }, 1800);
    return false;
  };

  const statusText = {
    question: {
      top: "GÜNÜN BULMACASI",
      main: "Beyaz oynar, bir hamlede mat.",
      sub: "Bir taşı sürükleyip gitmesi gereken kareye bırak.",
    },
    correct: {
      top: "DOĞRU",
      main: "Rf8#. Vezir–Kale kombinasyonu son sıra matına götürür.",
      sub: "Bu, arka sıra matının en temel örneğidir.",
    },
    wrong: {
      top: "YANLIŞ HAMLE",
      main: "Tekrar dene. Siyah şah hangi kareden kaçamaz?",
      sub: "İpucu: siyah şahın kaçış kareleri kendi piyonları tarafından kapatılmış.",
    },
  }[status];

  const dotColor = status === "correct" ? "#3D8B3D" : "#7A1E1E";

  return (
    <div className="flex flex-col lg:flex-row lg:items-stretch">
      {/* Board: edge-to-edge, no margin inside the frame */}
      <div
        ref={boardSlotRef}
        className="relative w-full lg:w-[min(58%,640px)] lg:flex-shrink-0 bg-paper-3"
      >
        <div className="w-full">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onDrop}
            boardWidth={boardWidth}
            customBoardStyle={{ boxShadow: "none" }}
            customLightSquareStyle={{ backgroundColor: "#EFE6D0" }}
            customDarkSquareStyle={{ backgroundColor: "#3D342A" }}
            customSquareStyles={hintSquares}
            arePiecesDraggable={status !== "correct"}
          />
        </div>
        <div className="absolute top-3 left-3 bg-paper/95 border border-line-soft px-2.5 py-1.5 font-mono text-[10px] tracking-[0.12em] text-ink-3 z-10">
          BEYAZ · Mat #1
        </div>
      </div>

      {/* Copy: stays compact — padding only here */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 md:px-10 md:py-10 lg:max-w-[360px] lg:flex-none">
        <div className="eyebrow mb-4">
          <span className="eyebrow-dot" style={{ background: dotColor }} />
          {statusText.top}
        </div>
        <h3 className="font-serif text-[32px] md:text-[36px] leading-[1.15] mb-3">
          {statusText.main}
        </h3>
        <p className="text-[18px] leading-[1.55] text-ink-3 mb-6">{statusText.sub}</p>

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm border border-line-soft hover:border-ink transition-all"
          >
            {status === "correct" ? "Yeni bulmaca" : "Sıfırla"}
          </button>
          {status === "question" && (
            <button
              onClick={showHint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm border border-line-soft hover:border-ink transition-all text-ink-3"
            >
              İpucu
            </button>
          )}
        </div>

        <hr className="border-0 h-px bg-line-soft my-8" />

        <div className="font-mono text-[15px] text-ink-4 leading-[1.8] space-y-0.5">
          <div>ZORLUK &nbsp;·&nbsp; ★☆☆☆☆</div>
          <div>TEMA &nbsp;·&nbsp; Arka sıra matı</div>
          <div>FIDE &nbsp;·&nbsp; ~800</div>
        </div>
      </div>
    </div>
  );
}
