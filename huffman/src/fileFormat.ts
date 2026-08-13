/**
 * Binary container format used by this tool for compressed files.
 *
 * Layout:
 *   [4 bytes]  magic          "HUF1"
 *   [4 bytes]  originalLength  uint32 LE - number of bytes in the source file
 *   [2 bytes]  symbolCount     uint16 LE - number of distinct byte values (0-256)
 *   [symbolCount * 5 bytes]    (byte value: 1 byte, frequency: uint32 LE) pairs
 *   [...]      packed bitstream of Huffman codes, MSB-first within each byte
 *
 * originalLength doubles as the decode stop-condition, so the final
 * byte of the bitstream may contain unused padding bits that are
 * simply ignored once that many bytes have been decoded.
 */

import { type FrequencyTable } from "./huffman.js";

export const MAGIC = "HUF1";

export interface FileHeader {
  originalLength: number;
  freq: FrequencyTable;
}

/** Serializes the header (magic + original length + frequency table). */
export function encodeHeader(originalLength: number, freq: FrequencyTable): Buffer {
  const entries = [...freq.entries()];
  const header = Buffer.alloc(4 + 4 + 2 + entries.length * 5);

  let offset = 0;
  header.write(MAGIC, offset, "ascii");
  offset += 4;

  header.writeUInt32LE(originalLength, offset);
  offset += 4;

  header.writeUInt16LE(entries.length, offset);
  offset += 2;

  for (const [byte, count] of entries) {
    header.writeUInt8(byte, offset);
    offset += 1;
    header.writeUInt32LE(count, offset);
    offset += 4;
  }

  return header;
}

/** Parses the header from the start of a buffer; returns header + byte offset after it. */
export function decodeHeader(buf: Buffer): { header: FileHeader; bodyOffset: number } {
  if (buf.length < 10) {
    throw new Error("File too small to contain a valid HUF1 header.");
  }

  const magic = buf.toString("ascii", 0, 4);
  if (magic !== MAGIC) {
    throw new Error(`Not a recognized huffman-ts file (bad magic: "${magic}").`);
  }

  let offset = 4;
  const originalLength = buf.readUInt32LE(offset);
  offset += 4;

  const symbolCount = buf.readUInt16LE(offset);
  offset += 2;

  const freq: FrequencyTable = new Map();
  for (let i = 0; i < symbolCount; i++) {
    const byte = buf.readUInt8(offset);
    offset += 1;
    const count = buf.readUInt32LE(offset);
    offset += 4;
    freq.set(byte, count);
  }

  return { header: { originalLength, freq }, bodyOffset: offset };
}

/** Accumulates a stream of '0'/'1' bits into packed bytes, MSB-first. */
export class BitWriter {
  private bytes: number[] = [];
  private current = 0;
  private bitCount = 0;

  writeBit(bit: 0 | 1): void {
    this.current = (this.current << 1) | bit;
    this.bitCount++;
    if (this.bitCount === 8) {
      this.bytes.push(this.current);
      this.current = 0;
      this.bitCount = 0;
    }
  }

  writeBits(bitString: string): void {
    for (const ch of bitString) {
      this.writeBit(ch === "1" ? 1 : 0);
    }
  }

  /** Flushes any partial byte, zero-padding the low bits. */
  toBuffer(): Buffer {
    if (this.bitCount > 0) {
      this.bytes.push(this.current << (8 - this.bitCount));
    }
    return Buffer.from(this.bytes);
  }
}

/** Reads individual bits MSB-first out of a buffer. */
export class BitReader {
  private byteIndex = 0;
  private bitIndex = 0; // 0 = most significant bit of current byte

  constructor(private buf: Buffer) {}

  /** Returns the next bit (0 or 1), or null if the buffer is exhausted. */
  readBit(): 0 | 1 | null {
    if (this.byteIndex >= this.buf.length) return null;
    const byte = this.buf[this.byteIndex]!;
    const bit = (byte >> (7 - this.bitIndex)) & 1;
    this.bitIndex++;
    if (this.bitIndex === 8) {
      this.bitIndex = 0;
      this.byteIndex++;
    }
    return bit as 0 | 1;
  }
}
