# huffman-ts

A small, dependency-free TypeScript implementation of Huffman coding for
compressing and decompressing arbitrary files (text or binary).

## How it works

1. **Frequency table** – count how often each byte (0–255) appears in the file.
2. **Huffman tree** – repeatedly merge the two least-frequent nodes (using a
   binary min-heap) until a single tree remains. Frequent bytes end up near
   the root and get short codes; rare bytes get longer codes.
3. **Code table** – walk the tree to assign each byte a unique bit string
   (left = `0`, right = `1`).
4. **Encode** – write a small header (original file length + the frequency
   table, which is enough to rebuild the same tree later), then pack the bit
   codes for every byte back-to-back into the output file.
5. **Decode** – read the header, rebuild the identical tree from the
   frequency table, then walk the tree bit by bit through the compressed
   stream, emitting a byte each time a leaf is reached, until the original
   byte count is reached.

## Project layout

```
src/
  huffman.ts     Tree building, min-heap, code generation
  fileFormat.ts  Header (de)serialization + bit-level reader/writer
  encode.ts      buffer -> compressed .huf buffer
  decode.ts      compressed .huf buffer -> original buffer
  cli.ts         Command-line entry point
```

## Setup

```bash
npm install
```

## Usage (via ts-node, no build step needed)

```bash
# Compress a file -> creates myfile.txt.huf
npm run encode -- myfile.txt

# Compress with a custom output name
npm run encode -- myfile.txt compressed.huf

# Decompress -> creates myfile.txt (or myfile.huf -> myfile)
npm run decode -- myfile.txt.huf

# Decompress with a custom output name
npm run decode -- compressed.huf restored.txt
```

## Usage (compiled)

```bash
npm run build
node dist/cli.js encode myfile.txt
node dist/cli.js decode myfile.txt.huf
```

## File format (`.huf`)

```
[4 bytes]  magic "HUF1"
[4 bytes]  original file length (uint32, little-endian)
[2 bytes]  number of distinct byte values, 0-256 (uint16, little-endian)
[N * 5 B]  per symbol: 1 byte value + uint32 frequency (little-endian)
[...]      packed Huffman-coded bitstream, MSB-first
```

Storing the frequency table (rather than the tree shape directly) keeps the
header simple, and lets both encoder and decoder independently rebuild an
identical tree via the same deterministic algorithm.

Edge cases handled:
- **Empty file** – header only, no body, decodes back to 0 bytes.
- **Single distinct byte value** – that byte is paired with a phantom node
  so it still gets a valid 1-bit code instead of breaking tree construction.

## Programmatic API

```ts
import { encodeBuffer } from "./src/encode";
import { decodeBuffer } from "./src/decode";
import * as fs from "fs";

const original = fs.readFileSync("myfile.txt");
const { output } = encodeBuffer(original);
fs.writeFileSync("myfile.txt.huf", output);

const compressed = fs.readFileSync("myfile.txt.huf");
const { output: restored } = decodeBuffer(compressed);
// restored.equals(original) === true
```

## Testing

A quick round-trip test script is included:

```bash
npx ts-node test/roundtrip.test.ts
```

It encodes and decodes several sample inputs (empty file, single-byte
repeats, plain text, and random binary data) and verifies byte-for-byte
equality with the original.
