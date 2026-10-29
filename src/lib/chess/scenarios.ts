import type { Square } from "chess.js";

export type ScenarioKind = "mate" | "win" | "fork" | "save";

export type Scenario = {
  id: string;
  kind: ScenarioKind;
  label: string;
  fen: string;
  prefer: string;
  headline: string;
  lead: string;
  ok: [string, string];
  target?: Square;
};

export const PIECE_NAME: Record<string, string> = {
  p: "piyon",
  n: "at",
  b: "fil",
  r: "kale",
  q: "vezir",
  k: "şah",
};

export const SCENARIOS: Scenario[] = [
  {
    id: "mate-arka-sira",
    kind: "mate",
    label: "Mat · bir hamle",
    fen: "7k/6pp/8/8/8/8/8/3Q1RK1 w - - 0 1",
    prefer: "d1d8",
    headline: "Beyaz, bir hamlede <em>mat</em> eder.",
    lead: "Taşı seç, gideceği kareye dokun. İstersen hamleyi biz gösterelim.",
    ok: [
      "Mat! Siyah şahın önünde kendi piyonları var, kaçacak karesi kalmadı.",
      'Buna "arka sıra matı" denir. Burada vezir d8 de kale f8 de aynı işi görür.',
    ],
  },
  {
    id: "mate-kale",
    kind: "mate",
    label: "Mat · bir hamle",
    fen: "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    prefer: "e1e8",
    headline: "Beyaz, sekizinci sırada <em>mat</em> eder.",
    lead: "Siyah şahın önünde üç piyon var. Bu şahın işine mi yarıyor, aleyhine mi?",
    ok: [
      "Mat! f7, g7 ve h7 piyonları şahı kendi evinde hapsetti.",
      "Kale e8'e gidip tüm sekizinci sırayı kontrol etti. Satrançta en sık görülen matlardan biri bu.",
    ],
  },
  {
    id: "bedava-fil",
    kind: "win",
    label: "Bedava taş",
    target: "d6",
    fen: "6k1/5ppp/3b4/4n3/8/5N2/5PPP/3R2K1 w - - 0 1",
    prefer: "d1d6",
    headline: "Beyaz, bir <em>fil</em> kazanır.",
    lead: "Siyahın korumasız bir taşı var. Ama dikkat: her taş almaya değmez.",
    ok: [
      "Güzel! d6'daki filin koruyucusu yoktu, kale d hattından bedavaya aldı.",
      "At e5'i almak cazip görünür ama fil geri alırdı. Önce korumasız taşa bak.",
    ],
  },
  {
    id: "bedava-kale",
    kind: "win",
    label: "Bedava taş",
    target: "a8",
    fen: "r5k1/5pp1/2p4p/1p6/Q7/8/5PPP/6K1 w - - 0 1",
    prefer: "a4a8",
    headline: "Beyaz, bir <em>kale</em> kazanır.",
    lead: "Vezirin saldırı altında. Bazen en iyi savunma, en iyi saldırıdır.",
    ok: [
      "Vezir a8'deki kaleyi aldı ve şah çekti. Üstelik b5 piyonunun tehdidinden de kurtuldu.",
      "Korumasız taş ararken kendi taşının tehdit altında olup olmadığına da bak.",
    ],
  },
  {
    id: "catal-kale",
    kind: "fork",
    label: "At çatalı",
    fen: "r3k3/8/8/1N6/8/8/5PPP/6K1 w - - 0 1",
    prefer: "b5c7",
    headline: "Beyaz, <em>at çatalı</em> kurar.",
    lead: "Atın tek hamlede iki taşa birden saldırabileceği kareyi bul.",
    ok: [
      "Çatal! At c7'den hem şaha hem a8'deki kaleye saldırıyor.",
      "Şah çekildiği için kaleyi kurtaramaz. Bir sonraki hamlede kale beyazın.",
    ],
  },
  {
    id: "catal-vezir",
    kind: "fork",
    label: "At çatalı",
    fen: "2q3k1/5ppp/8/3N4/8/8/5PPP/6K1 w - - 0 1",
    prefer: "d5e7",
    headline: "Beyaz, vezire <em>çatal</em> atar.",
    lead: "Şah çekmek rakibin cevabını zorlar. Atı nereye koyarsan şah ve vezir birden tehdit altında kalır?",
    ok: [
      "Çatal! At e7'den şaha ve c8'deki vezire birden saldırıyor.",
      "Şah kaçmak zorunda, vezir de kurtulamıyor. Bir at karşılığında vezir kazandın.",
    ],
  },
  {
    id: "tehdit-fil",
    kind: "save",
    label: "Tehdit · savun",
    fen: "4k3/8/8/3p4/4B3/8/5PPP/6K1 w - - 0 1",
    prefer: "e4f3",
    headline: "Beyazın <em>fili</em> tehdit altında.",
    lead: "Rakip ne yapmak istiyor? Önce tehdidi gör, sonra tedbir al.",
    ok: [
      "Doğru, fil artık güvende.",
      "Hamle bulmadan önce rakibin neyi tehdit ettiğini görmek, kayıpların çoğunu önler.",
    ],
  },
  {
    id: "tehdit-at",
    kind: "save",
    label: "Tehdit · savun",
    fen: "4k3/8/8/4p3/3N4/8/5PPP/6K1 w - - 0 1",
    prefer: "d4f3",
    headline: "Beyazın <em>atı</em> tehdit altında.",
    lead: "Rakibin son hamlesinin neyi hedeflediğine bak ve atını güvene al.",
    ok: [
      "Doğru, at artık güvende.",
      "Bir piyon bile at gibi bir taşı kovabilir. Piyonların alabileceği kareleri her hamlede kontrol et.",
    ],
  },
];
