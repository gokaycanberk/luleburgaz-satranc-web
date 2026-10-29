"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Square } from "chess.js";
import { evaluateMove, solutionFor } from "@/lib/chess/evaluate";
import { PIECE_NAME, type Scenario } from "@/lib/chess/scenarios";
import { buildSession, readLastPicks, writeLastPicks } from "@/lib/chess/session";
import ChessBoard, { type MarkKind } from "./ChessBoard";
import "./chess.css";

type Mode = "task" | "game";
type Level = 1 | 2 | 3;
type EngineMove = { from: Square; to: Square; promotion?: string } | null;

function RichLine({ text }: { text: string }) {
  const parts = text.split(/(<em>|<\/em>)/);
  let em = false;
  return (
    <>
      {parts.map((part, i) => {
        if (part === "<em>") {
          em = true;
          return null;
        }
        if (part === "</em>") {
          em = false;
          return null;
        }
        return em ? (
          <em key={i}>{part}</em>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return reduced;
}

function kingSquare(game: Chess): Square | null {
  const turn = game.turn();
  for (const [i, row] of game.board().entries()) {
    for (const [j, cell] of row.entries()) {
      if (cell?.type === "k" && cell.color === turn) {
        return `${"abcdefgh"[j]}${8 - i}` as Square;
      }
    }
  }
  return null;
}

export default function ChessSection() {
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<Mode>("task");
  const [queue, setQueue] = useState<Scenario[]>([]);
  const [idx, setIdx] = useState(0);
  const [fen, setFen] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [solved, setSolved] = useState(false);
  const [locked, setLocked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [shown, setShown] = useState<string[]>([]);
  const [tone, setTone] = useState<"idle" | "good" | "bad">("idle");
  const [marks, setMarks] = useState<Partial<Record<Square, MarkKind[]>>>({});
  const [shake, setShake] = useState<Square | null>(null);
  const [ghost, setGhost] = useState<{ from: Square; to: Square } | null>(null);
  const [attn, setAttn] = useState(false);

  const [human, setHuman] = useState<"w" | "b">("w");
  const [level, setLevel] = useState<Level>(2);
  const [gameView, setGameView] = useState<"setup" | "play">("setup");
  const [gameOn, setGameOn] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [status, setStatus] = useState("Sıra sende.");
  const [plies, setPlies] = useState<string[]>([]);
  const [result, setResult] = useState<{ title: string; text: string } | null>(null);

  const chessRef = useRef(new Chess());
  const gameRef = useRef(new Chess());
  const skipRef = useRef<(() => void) | null>(null);
  const ghostTimer = useRef<number>(0);
  const undoTimer = useRef<number>(0);
  const workerRef = useRef<Worker | null>(null);
  const gameOnRef = useRef(false);
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  gameOnRef.current = gameOn;

  const scn = queue[idx];

  function stopType() {
    skipRef.current = null;
  }

  function typeLines(next: string[]) {
    stopType();
    if (reducedRef.current) {
      setShown(next);
      return;
    }
    setShown([]);
    let li = 0;
    let ci = 0;
    const acc: string[] = [];
    let timer = 0;
    const step = () => {
      if (li >= next.length) {
        skipRef.current = null;
        return;
      }
      if (!acc[li]) acc[li] = "";
      ci += 1;
      acc[li] = next[li].slice(0, ci);
      setShown(acc.slice());
      if (ci >= next[li].length) {
        li += 1;
        ci = 0;
        if (li < next.length) timer = window.setTimeout(step, 300);
        else skipRef.current = null;
      } else timer = window.setTimeout(step, 15);
    };
    skipRef.current = () => {
      window.clearTimeout(timer);
      setShown(next);
      skipRef.current = null;
    };
    step();
  }

  function clearGhost() {
    window.clearTimeout(ghostTimer.current);
    setGhost(null);
    setMarks((m) => {
      const next: Partial<Record<Square, MarkKind[]>> = {};
      for (const [sq, kinds] of Object.entries(m) as [Square, MarkKind[]][]) {
        const kept = kinds.filter((k) => k !== "hint");
        if (kept.length) next[sq] = kept;
      }
      return next;
    });
  }

  function showGhost(from: Square, to: Square) {
    window.clearTimeout(ghostTimer.current);
    setGhost({ from, to });
    setMarks((m) => ({
      ...m,
      [from]: [...new Set([...(m[from] ?? []), "hint"])],
      [to]: [...new Set([...(m[to] ?? []), "hint"])],
    }));
    ghostTimer.current = window.setTimeout(clearGhost, 6000);
  }

  function load(list: Scenario[], index: number) {
    const next = list[index];
    const game = new Chess();
    try {
      game.load(next.fen);
    } catch {
      return;
    }
    window.clearTimeout(undoTimer.current);
    chessRef.current = game;
    setQueue(list);
    setIdx(index);
    setFen(game.fen());
    setFlipped(false);
    setSolved(false);
    setLocked(false);
    setFinished(false);
    setShake(null);
    setGhost(null);
    setAttn(false);
    setMarks({});
    setTone("idle");
    typeLines(["Taşı seç, gideceği kareye dokun. Sürüklemek de olur."]);
  }

  function start() {
    const { queue: q, store } = buildSession(readLastPicks());
    writeLastPicks(store);
    load(q, 0);
  }

  function ensureWorker() {
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL("../../lib/chess/engine.worker.ts", import.meta.url));
    }
    return workerRef.current;
  }

  function setHumanStatus(game: Chess) {
    setStatus(game.isCheck() ? "Şah çekildi! Sıra sende." : "Sıra sende.");
  }

  function endGame(reason?: "resign") {
    const game = gameRef.current;
    gameOnRef.current = false;
    setGameOn(false);
    setThinking(false);
    if (reason === "resign") {
      setStatus("Pes ettin.");
      setResult({
        title: "Pes ettin.",
        text: "Sorun değil. Her oyun bir ders: hangi hamlede dengenin bozulduğuna bakmak en iyi çalışma.",
      });
      return;
    }
    if (game.isCheckmate()) {
      const winner = game.turn() === "w" ? "b" : "w";
      const humanWon = winner === human;
      setStatus(humanWon ? "Mat! Tebrikler." : "Mat oldun.");
      setResult({
        title: humanWon ? "Mat! Tebrikler." : "Mat oldun.",
        text: humanWon
          ? "Antrenörü yendin. Farklı bir zorluk seviyesiyle yeniden deneyebilirsin."
          : "Bu sefer antrenör kazandı. Hamle listesine bakıp dengenin nerede bozulduğunu bulabilirsin.",
      });
      const king = kingSquare(game);
      if (king) {
        setMarks((m) => ({ ...m, [king]: [...(m[king] ?? []), "mate"] }));
        setShake(king);
      }
      return;
    }
    if (game.isStalemate()) {
      setStatus("Pat.");
      setResult({
        title: "Pat.",
        text: "Hamle hakkı kalmadı ama şah da çekilmedi. Oyun berabere bitti.",
      });
      return;
    }
    setStatus("Berabere.");
    setResult({ title: "Berabere.", text: "Oyun berabere bitti." });
  }

  function afterGameMove() {
    const game = gameRef.current;
    setPlies(game.history());
    if (game.isGameOver()) {
      endGame();
      return;
    }
    if (game.turn() !== human) engineMove();
    else setHumanStatus(game);
  }

  function engineMove() {
    const game = gameRef.current;
    setThinking(true);
    setStatus("Antrenör düşünüyor…");
    const wait = reducedRef.current ? 30 : 520;
    window.setTimeout(() => {
      if (!gameOnRef.current) {
        setThinking(false);
        return;
      }
      const worker = ensureWorker();
      const onMsg = (event: MessageEvent<EngineMove>) => {
        worker.removeEventListener("message", onMsg);
        if (!gameOnRef.current) {
          setThinking(false);
          return;
        }
        const m = event.data;
        setThinking(false);
        if (!m) {
          afterGameMove();
          return;
        }
        const played = game.move({ from: m.from, to: m.to, promotion: m.promotion ?? "q" });
        if (!played) {
          afterGameMove();
          return;
        }
        setFen(game.fen());
        setMarks({ [m.from]: ["last"], [m.to]: ["last"] });
        setShake(null);
        afterGameMove();
      };
      worker.addEventListener("message", onMsg);
      worker.postMessage({ fen: game.fen(), level });
    }, wait);
  }

  function previewGame() {
    const game = new Chess();
    gameRef.current = game;
    gameOnRef.current = false;
    window.clearTimeout(undoTimer.current);
    setGameOn(false);
    setThinking(false);
    setResult(null);
    setFlipped(false);
    setFen(game.fen());
    setMarks({});
    setShake(null);
    setGhost(null);
    setPlies([]);
    setGameView("setup");
    setStatus("Sıra sende.");
  }

  function startGame() {
    const game = new Chess();
    gameRef.current = game;
    gameOnRef.current = true;
    setGameOn(true);
    setThinking(false);
    setResult(null);
    setFlipped(human === "b");
    setFen(game.fen());
    setMarks({});
    setShake(null);
    setGhost(null);
    setPlies([]);
    setGameView("play");
    if (human === "b") engineMove();
    else setHumanStatus(game);
  }

  useEffect(() => {
    start();
    return () => {
      workerRef.current?.terminate();
      window.clearTimeout(ghostTimer.current);
      window.clearTimeout(undoTimer.current);
    };
    // session is random once per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mode !== "task" || !scn || solved || finished || locked) return;
    const hint = window.setTimeout(() => {
      const sol = solutionFor(scn);
      if (!sol) return;
      setMarks((m) => ({ ...m, [sol.from]: [...new Set([...(m[sol.from] ?? []), "hint"])] }));
    }, 10000);
    const nudge = window.setTimeout(() => {
      setAttn(true);
      setTone("idle");
      typeLines(['Takıldın mı? "Hamleyi gör" ile çözümü izleyebilirsin.']);
    }, 20000);
    return () => {
      window.clearTimeout(hint);
      window.clearTimeout(nudge);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, scn, solved, finished, locked, fen]);

  function onTaskMove(from: Square, to: Square) {
    if (!scn || locked || solved) return;
    const game = chessRef.current;
    const played = game.move({ from, to, promotion: "q" });
    if (!played) return;
    clearGhost();
    setAttn(false);
    setFen(game.fen());
    const last: Partial<Record<Square, MarkKind[]>> = { [from]: ["last"], [to]: ["last"] };
    const resultMove = evaluateMove(scn, played, game);
    if (resultMove.ok) {
      setSolved(true);
      setLocked(true);
      if (game.isCheckmate()) {
        const king = kingSquare(game);
        if (king) {
          last[king] = [...(last[king] ?? []), "mate"];
          setShake(king);
        }
      }
      setMarks(last);
      setTone("good");
      typeLines(scn.ok);
      return;
    }
    setLocked(true);
    for (const sq of resultMove.warn) last[sq] = [...(last[sq] ?? []), "warn"];
    setMarks(last);
    setTone("bad");
    typeLines([resultMove.msg, "Hamleyi geri aldım. Tekrar dene."]);
    undoTimer.current = window.setTimeout(() => {
      game.undo();
      setFen(game.fen());
      setMarks({});
      setLocked(false);
    }, 2000);
  }

  function onGameMove(from: Square, to: Square) {
    if (!gameOn || thinking || result) return;
    const game = gameRef.current;
    const played = game.move({ from, to, promotion: "q" });
    if (!played) return;
    setFen(game.fen());
    setMarks({ [from]: ["last"], [to]: ["last"] });
    setShake(null);
    afterGameMove();
  }

  function undoGame() {
    if (!gameOn || thinking) return;
    const game = gameRef.current;
    const min = human === "b" ? 1 : 0;
    if (game.history().length <= min) return;
    game.undo();
    if (game.turn() !== human && game.history().length > min) game.undo();
    setFen(game.fen());
    setMarks({});
    setShake(null);
    setPlies(game.history());
    setHumanStatus(game);
  }

  function openGame() {
    if (mode === "game") return;
    stopType();
    clearGhost();
    window.clearTimeout(undoTimer.current);
    setMode("game");
    ensureWorker();
    previewGame();
  }

  function openTasks() {
    if (mode === "task") return;
    gameOnRef.current = false;
    setGameOn(false);
    setThinking(false);
    setMode("task");
    if (!queue.length || idx >= queue.length) start();
    else load(queue, idx);
  }

  const progress = useMemo(
    () => queue.map((_, i) => (i < idx || (i === idx && solved) ? "done" : i === idx ? "cur" : "")),
    [queue, idx, solved],
  );

  const tag =
    mode === "task"
      ? "Beyaz · bir hamle"
      : gameView === "setup"
        ? "Antrenör · hazır"
        : `${human === "w" ? "Beyaz" : "Siyah"} · sen`;

  const levelName = ["Başlangıç", "Orta", "İleri"][level - 1];
  const moveRows: { n: number; w: string; b?: string }[] = [];
  for (let i = 0; i < plies.length; i += 2) {
    moveRows.push({ n: i / 2 + 1, w: plies[i], b: plies[i + 1] });
  }

  if (mode === "task" && !scn && !finished) return null;

  return (
    <div className="bhy-card">
      <div className="bhy-boardcol">
        <div className="bhy-caption">
          <span className="tag">{tag}</span>
          {mode === "task" ? (
            <span className="bhy-dots" aria-hidden>
              {progress.map((state, i) => (
                <i key={i} className={state} />
              ))}
            </span>
          ) : null}
        </div>
        {fen ? (
          <ChessBoard
            fen={fen}
            flipped={flipped}
            interactive={
              mode === "task" ? !locked && !solved && !finished : gameOn && !thinking && !result
            }
            marks={marks}
            shake={shake}
            ghost={ghost}
            onMove={mode === "task" ? onTaskMove : onGameMove}
            reduced={reduced}
          />
        ) : null}
      </div>

      <div className="bhy-panel">
        <div className="bhy-tabs" role="tablist" aria-label="Mod">
          <button className="bhy-tab" role="tab" type="button" aria-selected={mode === "task"} onClick={openTasks}>
            Görevler
          </button>
          <button className="bhy-tab" role="tab" type="button" aria-selected={mode === "game"} onClick={openGame}>
            Meydan oku
          </button>
        </div>

        {mode === "task" ? (
          !finished && scn ? (
            <div className="bhy-pane">
              <div className="bhy-eye">{scn.label}</div>
              <h3 className="bhy-h">
                <RichLine text={scn.headline} />
              </h3>
              <p className="bhy-lead">{scn.lead}</p>
              <div
                className={`bhy-coach ${tone}`}
                aria-live="polite"
                onClick={() => skipRef.current?.()}
              >
                {shown.map((line, i) => (
                  <p key={`${i}-${line}`}>{line}</p>
                ))}
              </div>
              <div className="bhy-actions">
                {!solved ? (
                  <button
                    type="button"
                    className={`bhy-btn${attn ? " attn" : ""}`}
                    onClick={() => {
                      const sol = solutionFor(scn);
                      if (!sol || locked || solved) return;
                      showGhost(sol.from, sol.to);
                      setTone("idle");
                      typeLines([
                        `İşte hamle: ${PIECE_NAME[sol.piece]} ${sol.from} → ${sol.to}. Şimdi sen oyna.`,
                      ]);
                    }}
                  >
                    Hamleyi gör
                  </button>
                ) : (
                  <button
                    type="button"
                    className="bhy-btn primary"
                    onClick={() => {
                      if (idx >= queue.length - 1) {
                        setFinished(true);
                        setGhost(null);
                      } else load(queue, idx + 1);
                    }}
                  >
                    {idx >= queue.length - 1 ? "Bitir →" : "Sıradaki görev →"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bhy-pane">
              <div className="bhy-eye">Hepsi tamam</div>
              <h3 className="bhy-h">
                Dört görev, <em>dört hamle.</em>
              </h3>
              <p className="bhy-lead">
                Bunlar satrancın ilk dersleri: mat görmek, bedava taşı fark etmek, çatal kurmak ve tehdidi
                savuşturmak.
              </p>
              <div className="bhy-actions">
                <button type="button" className="bhy-btn" onClick={start}>
                  Yeni görevler
                </button>
                <button type="button" className="bhy-btn" onClick={openGame}>
                  Meydan oku
                </button>
                <a className="bhy-btn primary" href="/#iletisim">
                  Ücretsiz Deneme Dersi →
                </a>
              </div>
            </div>
          )
        ) : gameView === "setup" ? (
          <div className="bhy-pane">
            <div className="bhy-eye">Antrenöre karşı</div>
            <h3 className="bhy-h">
              Bir parti, <em>antrenör.</em>
            </h3>
            <p className="bhy-lead">Rengini ve zorluğu seç. Takıldığında geri alabilirsin.</p>
            <div className="bhy-field">
              <span>Renk</span>
              <div className="bhy-seg">
                <button type="button" aria-pressed={human === "w"} onClick={() => setHuman("w")}>
                  Beyaz
                </button>
                <button type="button" aria-pressed={human === "b"} onClick={() => setHuman("b")}>
                  Siyah
                </button>
              </div>
            </div>
            <div className="bhy-field">
              <span>Zorluk</span>
              <div className="bhy-seg">
                {(
                  [
                    [1, "Başlangıç"],
                    [2, "Orta"],
                    [3, "İleri"],
                  ] as const
                ).map(([v, label]) => (
                  <button key={v} type="button" aria-pressed={level === v} onClick={() => setLevel(v)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bhy-actions">
              <button type="button" className="bhy-btn primary" onClick={startGame}>
                Oyunu başlat
              </button>
            </div>
            <p className="bhy-note">Kendini sınamak için hafif bir antrenör. Seviyene göre zorluğu seç.</p>
          </div>
        ) : (
          <div className="bhy-pane">
            <div className="bhy-eye">Oyun · {levelName}</div>
            <h3 className="bhy-h">{status}</h3>
            {result ? (
              <div className="bhy-result">
                <p className="bhy-lead">{result.text}</p>
                {moveRows.length > 0 ? (
                  <ol className="bhy-moves" aria-label="Hamle listesi">
                    {moveRows.map((row) => (
                      <li key={row.n}>
                        <b>{row.n}.</b>
                        {row.w}
                        {row.b ? ` ${row.b}` : ""}
                      </li>
                    ))}
                  </ol>
                ) : null}
                <div className="bhy-actions">
                  <button type="button" className="bhy-btn" onClick={previewGame}>
                    Yeni oyun
                  </button>
                  <a className="bhy-btn primary" href="/#iletisim">
                    Ücretsiz Deneme Dersi →
                  </a>
                </div>
              </div>
            ) : (
              <div className="bhy-actions">
                <button type="button" className="bhy-btn" onClick={undoGame}>
                  Geri al
                </button>
                <button type="button" className="bhy-btn" onClick={previewGame}>
                  Yeni oyun
                </button>
                <button
                  type="button"
                  className="bhy-btn"
                  onClick={() => {
                    if (gameOn && !thinking) endGame("resign");
                  }}
                >
                  Pes et
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
