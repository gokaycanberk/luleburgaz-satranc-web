import { pickMoveFromFen } from "./engine";

type Req = { fen: string; level: 1 | 2 | 3 };

addEventListener("message", (event: MessageEvent<Req>) => {
  const { fen, level } = event.data;
  postMessage(pickMoveFromFen(fen, level));
});
