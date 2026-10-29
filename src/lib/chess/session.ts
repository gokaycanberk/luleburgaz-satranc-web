import { SCENARIOS, type Scenario, type ScenarioKind } from "./scenarios";

const KINDS: ScenarioKind[] = ["mate", "win", "fork", "save"];
const STORAGE_KEY = "bhy-last";

export type LastPicks = Partial<Record<ScenarioKind | "first", string>>;

export function readLastPicks(): LastPicks {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as LastPicks;
  } catch {
    return {};
  }
}

export function writeLastPicks(value: LastPicks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* private mode */
  }
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Her türden bir görev; son gösterilen senaryo tekrar gelmez. */
export function buildSession(last: LastPicks, rng: () => number = Math.random) {
  const store: LastPicks = {};
  const picked = KINDS.map((kind) => {
    const opts = SCENARIOS.filter((s) => s.kind === kind);
    const pool = opts.filter((s) => s.id !== last[kind]);
    const source = pool.length ? pool : opts;
    const pick = source[Math.floor(rng() * source.length)] as Scenario;
    store[kind] = pick.id;
    return pick;
  });
  const queue = shuffle(picked, rng);
  if (queue[0].kind === last.first && queue.length > 1) {
    [queue[0], queue[1]] = [queue[1], queue[0]];
  }
  store.first = queue[0].kind;
  return { queue, store };
}
