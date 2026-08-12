import type { Edge, LogEntry } from "./types.js";
import { UnionFind } from "./UnionFind.js";

export function kruskalMST(nodes: string[], edges: Edge[]) {
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

export default kruskalMST