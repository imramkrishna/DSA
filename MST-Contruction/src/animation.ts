import chalk from "chalk";
import kruskalMST from "./kruskal.js";
import { renderEdgeTable, renderMstSummary } from "./render.js";
import type { Edge } from "./types.js";

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function clearScreen() {
  process.stdout.write("\x1b[2J\x1b[0f");
}

export async function animateMst(nodes: string[], edges: Edge[], delayMs: number) {
  const { mstEdges, log } = kruskalMST(nodes, edges);

  const banner = chalk.magenta.bold("\u2554\u2550\u2550 Kruskal's MST Algorithm \u2550\u2550\u2557");

  for (let i = 0; i <= log.length; i++) {
    clearScreen();
    console.log(banner);
    console.log(renderEdgeTable(log, i));
    if (delayMs > 0) await sleep(delayMs);
  }

  console.log();
  console.log(renderMstSummary(mstEdges));
}