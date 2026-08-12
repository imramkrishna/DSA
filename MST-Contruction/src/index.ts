import { animateMst } from "./animation.js";
import parseDelayArg from "./delay.js";
import type{ Edge } from "./types.js";

async function main() {
  const delayMs = parseDelayArg();
  const nodes = ["A", "B", "C", "D", "E", "F"];
  const edges: Edge[] = [
    [4, "A", "B"],
    [4, "A", "F"],
    [2, "B", "C"],
    [6, "B", "F"],
    [5, "C", "D"],
    [10, "C", "F"],
    [5, "C", "E"],
    [3, "D", "E"],
    [4, "E", "F"],
  ];

  await animateMst(nodes, edges, delayMs);
}

main();
