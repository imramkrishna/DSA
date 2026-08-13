import { buildHuffmanTree, type HuffmanNode } from "./huffman.js";
import { decodeHeader, BitReader } from "./fileFormat.js";

export interface DecodeResult {
  output: Buffer;
  originalSize: number;
}

/** Decompresses a buffer previously produced by encodeBuffer(). */
export function decodeBuffer(compressed: Buffer): DecodeResult {
  const { header, bodyOffset } = decodeHeader(compressed);
  const { originalLength, freq } = header;

  if (originalLength === 0) {
    return { output: Buffer.alloc(0), originalSize: 0 };
  }

  const tree = buildHuffmanTree(freq);
  if (!tree) {
    throw new Error("Corrupt file: frequency table is empty but original length is nonzero.");
  }

  const body = compressed.subarray(bodyOffset);
  const reader = new BitReader(body);
  const out = Buffer.alloc(originalLength);

  let node: HuffmanNode = tree;
  let produced = 0;

  // Single-symbol special case: tree is [leaf, phantom(-1)], every bit is "0".
  const isSingleSymbol =
    tree.left !== null && tree.right !== null && tree.right.byte === -1;

  while (produced < originalLength) {
    if (isSingleSymbol) {
      // Every encoded bit is 0 and maps straight to the one known byte.
      const bit = reader.readBit();
      if (bit === null) {
        throw new Error("Corrupt file: bitstream ended before originalLength was reached.");
      }
      out[produced++] = tree.left!.byte!;
      continue;
    }

    const bit = reader.readBit();
    if (bit === null) {
      throw new Error("Corrupt file: bitstream ended before originalLength was reached.");
    }
    node = bit === 0 ? node.left! : node.right!;

    if (node.byte !== null) {
      out[produced++] = node.byte;
      node = tree;
    }
  }

  return { output: out, originalSize: originalLength };
}
