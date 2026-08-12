import type { Edge, LogEntry } from "./types.js";
import chalk from "chalk";
import Table from "cli-table3";

type RenderEdgeTableOptions = {
  title: string;
  rejectedLabel: string;
};

export function renderEdgeTable(
  log: LogEntry[],
  currentIndex: number,
  options: RenderEdgeTableOptions = {
    title: "Edges sorted by weight (Kruskal's algorithm)",
    rejectedLabel: "cycle, skipped",
  },
): string {
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
      status = chalk.red.bold(`\u2717 ${options.rejectedLabel}`);
      edgeStr = chalk.red(edgeStr);
      weightStr = chalk.red(weightStr);
    }

    table.push([edgeStr, weightStr, status]);
  });

  const title = chalk.bold(options.title);
  return `${title}\n${table.toString()}`;
}

export function renderMstSummary(mstEdges: Edge[]): string {
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