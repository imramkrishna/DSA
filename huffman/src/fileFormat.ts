import { type FrequencyTable } from "./huffman.js";

export const MAGIC = "HUF1";

export interface FileHeader {
  originalLength: number;
  freq: FrequencyTable;
}

function encodeHeader(originalLength: number, freq: FrequencyTable): Buffer {
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

export { encodeHeader };

function decodeHeader(buf: Buffer): { header: FileHeader; bodyOffset: number } {
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

export { decodeHeader };

class BitWriter {
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

  toBuffer(): Buffer {
    if (this.bitCount > 0) {
      this.bytes.push(this.current << (8 - this.bitCount));
    }
    return Buffer.from(this.bytes);
  }
}

class BitReader {
  private byteIndex = 0;
  private bitIndex = 0;

  constructor(private buf: Buffer) {}

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

export { BitWriter, BitReader };
