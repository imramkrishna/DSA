#!/usr/bin/env node
/**
 * Beautiful terminal MST (Minimum Spanning Tree) visualizer.
 * Implements Kruskal's algorithm with live, colorized step-by-step output.
 *
 * Install:
 *   npm install
 *
 * Run:
 *   npm start -- --delay 300
 */

import chalk from "chalk";
import Table from "cli-table3";

type Edge = [weight: number, u: string, v: string];
type LogEntry = [weight: number, u: string, v: string, accepted: boolean];

// ---------- Union-Find (disjoint set) ----------

class UnionFind {
  private parent = new Map<string, string>();
  private rank = new Map<string, number>();

  constructor(nodes: string[]) {
    for (const n of nodes) {
      this.parent.set(n, n);
      this.rank.set(n, 0);
    }
  }

  find(x: string): string {
    let root = x;
    while (this.parent.get(root) !== root) {
      root = this.parent.get(root)!;
    }
    // path compression
    let cur = x;
    while (this.parent.get(cur) !== root) {
      const next = this.parent.get(cur)!;
      this.parent.set(cur, root);
      cur = next;
    }
    return root;
  }

  union(x: string, y: string): boolean {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx === ry) return false; // would create a cycle

    const rankX = this.rank.get(rx)!;
    const rankY = this.rank.get(ry)!;
    if (rankX < rankY) {
      this.parent.set(rx, ry);
    } else if (rankX > rankY) {
      this.parent.set(ry, rx);
    } else {
      this.parent.set(ry, rx);
      this.rank.set(rx, rankX + 1);
    }
    return true;
  }
}

// ---------- Kruskal's algorithm ----------

function kruskalMST(nodes: string[], edges: Edge[]) {
  const uf = new UnionFind(nodes);
  const sorted = [...edges].sort((a, b) => a[0] - b[0]);
  const mstEdges: Edge[] = [];
  const log: LogEntry[] = [];

  for (const [w, u, v] of sorted) {
    const accepted = uf.union(u, v);
    log.push([w, u, v, accepted]);
    if (accepted) mstEdges.push([w, u, v]);
  }

  return { mstEdges, log };
}

// ---------- Rendering ----------

function renderEdgeTable(log: LogEntry[], currentIndex: number): string {
  const table = new Table({
    head: [chalk.cyan.bold("Edge"), chalk.cyan.bold("Weight"), chalk.cyan.bold("Status")],
    style: { head: [], border: [] },
  });

  log.forEach(([w, u, v, accepted], i) => {
    let edgeStr = `${u} \u2500\u2500 ${v}`;
    let weightStr = String(w);
    let status: string;

    if (i > currentIndex) {
      status = chalk.dim("\u2026");
      edgeStr = chalk.dim(edgeStr);
      weightStr = chalk.dim(weightStr);
    } else if (i === currentIndex) {
      status = chalk.yellow.bold("checking\u2026");
      edgeStr = chalk.yellow.bold(edgeStr);
      weightStr = chalk.yellow.bold(weightStr);
    } else if (accepted) {
      status = chalk.green.bold("\u2713 added");
      edgeStr = chalk.green(edgeStr);
      weightStr = chalk.green(weightStr);
    } else {
      status = chalk.red.bold("\u2717 cycle, skipped");
      edgeStr = chalk.red(edgeStr);
      weightStr = chalk.red(weightStr);
    }

    table.push([edgeStr, weightStr, status]);
  });

  const title = chalk.bold("Edges sorted by weight (Kruskal's algorithm)");
  return `${title}\n${table.toString()}`;
}

function renderMstSummary(mstEdges: Edge[]): string {
  const table = new Table({
    head: [chalk.cyan.bold("Edge"), chalk.cyan.bold("Weight")],
    style: { head: [], border: [] },
  });

  let total = 0;
  for (const [w, u, v] of mstEdges) {
    table.push([chalk.green(`${u} \u2500\u2500 ${v}`), chalk.green(String(w))]);
    total += w;
  }

  const title = chalk.bold("Resulting Minimum Spanning Tree");
  return `${title}\n${table.toString()}\n\n${chalk.bgGreen.black.bold(` Total MST weight: ${total} `)}`;
}

// ---------- Animation ----------

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Clears everything previously printed by this program and redraws.
function clearScreen() {
  process.stdout.write("\x1b[2J\x1b[0f");
}

async function animateMst(nodes: string[], edges: Edge[], delayMs: number) {
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

// ---------- Entry point ----------

function parseDelayArg(): number {
  const idx = process.argv.indexOf("--delay");
  if (idx !== -1 && process.argv[idx + 1]) {
    const val = Number(process.argv[idx + 1]);
    if (!Number.isNaN(val)) return val;
  }
  return 400;
}

async function main() {
  const delayMs = parseDelayArg();

  // Example weighted graph — swap this out for your own nodes/edges
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
