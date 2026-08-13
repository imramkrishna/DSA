export interface HuffmanNode {
  byte: number | null; // null for internal nodes
  freq: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;
}

export type CodeTable = Map<number, string>;
export type FrequencyTable = Map<number, number>;

function makeLeaf(byte: number, freq: number): HuffmanNode {
  return { byte, freq, left: null, right: null };
}

function makeInternal(left: HuffmanNode, right: HuffmanNode): HuffmanNode {
  return { byte: null, freq: left.freq + right.freq, left, right };
}

// Minimal binary min-heap keyed by node frequency.
class MinHeap<T> {
  private items: { value: T; freq: number; order: number }[] = [];
  private counter = 0;

  get size(): number {
    return this.items.length;
  }

  push(value: T, freq: number): void {
    this.items.push({ value, freq, order: this.counter++ });
    this.bubbleUp(this.items.length - 1);
  }

  pop(): T {
    const top = this.items[0]!;
    const last = this.items.pop()!;
    if (this.items.length > 0) {
      this.items[0] = last;
      this.bubbleDown(0);
    }
    return top.value;
  }

  private less(a: number, b: number): boolean {
    const x = this.items[a]!;
    const y = this.items[b]!;
    return x.freq !== y.freq ? x.freq < y.freq : x.order < y.order;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.less(i, parent)) {
        const tmp = this.items[i]!;
        this.items[i] = this.items[parent]!;
        this.items[parent] = tmp;
        i = parent;
      } else break;
    }
  }

  private bubbleDown(i: number): void {
    const n = this.items.length;
    for (;;) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let smallest = i;
      if (l < n && this.less(l, smallest)) smallest = l;
      if (r < n && this.less(r, smallest)) smallest = r;
      if (smallest === i) break;
      const tmp = this.items[i]!;
      this.items[i] = this.items[smallest]!;
      this.items[smallest] = tmp;
      i = smallest;
    }
  }
}

export function buildFrequencyTable(data: Buffer): FrequencyTable {
  const freq: FrequencyTable = new Map();
  for (const byte of data) {
    freq.set(byte, (freq.get(byte) ?? 0) + 1);
  }
  return freq;
}

export function buildHuffmanTree(freq: FrequencyTable): HuffmanNode | null {
  if (freq.size === 0) return null;

  const heap = new MinHeap<HuffmanNode>();
  for (const [byte, count] of freq) {
    heap.push(makeLeaf(byte, count), count);
  }

  // Special case: only one distinct symbol. Pair it with a phantom node.
  if (heap.size === 1) {
    const only = heap.pop();
    const root = makeInternal(only, makeLeaf(-1, 0));
    return root;
  }

  while (heap.size > 1) {
    const a = heap.pop();
    const b = heap.pop();
    const parent = makeInternal(a, b);
    heap.push(parent, parent.freq);
  }

  return heap.pop();
}

export function generateCodes(root: HuffmanNode | null): CodeTable {
  const codes: CodeTable = new Map();
  if (!root) return codes;
  const stack: { node: HuffmanNode; prefix: string }[] = [{ node: root, prefix: "" }];
  while (stack.length > 0) {
    const { node, prefix } = stack.pop()!;
    if (node.byte !== null) {
      codes.set(node.byte, prefix.length > 0 ? prefix : "0");
      continue;
    }
    if (node.left) stack.push({ node: node.left, prefix: prefix + "0" });
    if (node.right) stack.push({ node: node.right, prefix: prefix + "1" });
  }
  return codes;
}
