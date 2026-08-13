import {
  buildFrequencyTable,
  buildHuffmanTree,
  generateCodes,
} from "./huffman.js";
import { encodeHeader, BitWriter } from "./fileFormat.js";

export interface EncodeResult {
  output: Buffer;
  originalSize: number;
  compressedSize: number;
  distinctSymbols: number;
}

/** Compresses a buffer using Huffman coding, returning the full .huf file contents. */
export function encodeBuffer(data: Buffer): EncodeResult {
  const freq = buildFrequencyTable(data);
  const header = encodeHeader(data.length, freq);

  if (data.length === 0) {
    return {
      output: header,
      originalSize: 0,
      compressedSize: header.length,
      distinctSymbols: 0,
    };
  }

  const tree = buildHuffmanTree(freq);
  const codes = generateCodes(tree);

  const writer = new BitWriter();
  for (const byte of data) {
    writer.writeBits(codes.get(byte)!);
  }
  const body = writer.toBuffer();

  const output = Buffer.concat([header, body]);
  return {
    output,
    originalSize: data.length,
    compressedSize: output.length,
    distinctSymbols: freq.size,
  };
}
