import type { Edge, LogEntry } from "./types.js";

type FrontierEdge = Edge;

export function primMST(nodes: string[], edges: Edge[], startNode = nodes[0]) {
  const mstEdges: Edge[] = [];
  const log: LogEntry[] = [];

  if (nodes.length === 0) {
    return { mstEdges, log };
  }

  const adjacency = new Map<string, FrontierEdge[]>();
  for (const node of nodes) {
    adjacency.set(node, []);
  }

  for (const edge of edges) {
    const [, u, v] = edge;
    adjacency.get(u)?.push(edge);
    adjacency.get(v)?.push(edge);
  }

  const visited = new Set<string>();
  const frontier: FrontierEdge[] = [];

  const addNode = (node: string) => {
    visited.add(node);
    for (const edge of adjacency.get(node) ?? []) {
      frontier.push(edge);
    }
  };

  const pickNextEdgeIndex = (): number => {
    let bestIndex = -1;
    let bestWeight = Number.POSITIVE_INFINITY;

    for (let i = 0; i < frontier.length; i += 1) {
      const edge = frontier[i];
      if (!edge) {
        continue;
      }

      const [weight] = edge;
      if (weight < bestWeight) {
        bestWeight = weight;
        bestIndex = i;
      }
    }

    return bestIndex;
  };

  const runFrom = (seed: string) => {
    addNode(seed);

    while (frontier.length > 0) {
      const nextIndex = pickNextEdgeIndex();
      if (nextIndex === -1) {
        break;
      }

      const edge = frontier.splice(nextIndex, 1)[0];
      if (!edge) {
        break;
      }

      const [weight, u, v] = edge;
      const uVisited = visited.has(u);
      const vVisited = visited.has(v);

      if (uVisited && vVisited) {
        log.push([weight, u, v, false]);
        continue;
      }

      const nextNode = uVisited ? v : u;
      addNode(nextNode);
      mstEdges.push([weight, u, v]);
      log.push([weight, u, v, true]);

      if (mstEdges.length === nodes.length - 1) {
        return;
      }
    }
  };

  if (startNode !== undefined && adjacency.has(startNode)) {
    runFrom(startNode);
  }

  for (const node of nodes) {
    if (!visited.has(node)) {
      frontier.length = 0;
      runFrom(node);
      if (mstEdges.length === nodes.length - 1) {
        break;
      }
    }
  }

  return { mstEdges, log };
}

export default primMST;