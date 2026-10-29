import { describe, expect, it } from "vitest";
import { Chess } from "chess.js";
import { okMoves } from "./evaluate";
import { SCENARIOS } from "./scenarios";

const EXPECTED: Record<string, string[]> = {
  "mate-arka-sira": ["Qd8#", "Rf8#"],
  "mate-kale": ["Re8#"],
  "bedava-fil": ["Rxd6"],
  "bedava-kale": ["Qxa8+"],
  "catal-kale": ["Nc7+"],
  "catal-vezir": ["Ne7+"],
  "tehdit-fil": ["Bxd5", "Bf5", "Bg6+", "Bh7", "Bf3", "Bd3", "Bc2", "Bb1"],
  "tehdit-at": ["Nb5", "Nc6", "Ne6", "Nf5", "Nf3", "Ne2", "Nc2", "Nb3"],
};

describe("chess scenarios", () => {
  it("covers every expected id", () => {
    expect(SCENARIOS.map((s) => s.id).sort()).toEqual(Object.keys(EXPECTED).sort());
  });

  for (const scn of SCENARIOS) {
    it(scn.id, () => {
      expect(() => new Chess(scn.fen)).not.toThrow();
      const sans = okMoves(scn).map((m) => m.san).sort();
      expect(sans).toEqual([...EXPECTED[scn.id]].sort());
    });
  }
});
