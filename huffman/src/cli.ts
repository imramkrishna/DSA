import * as fs from "fs";
import * as path from "path";
import { encodeBuffer } from "./encode.js";
import { decodeBuffer } from "./decode.js";

function printUsage(): void {
  console.log(`huffman-ts — Huffman coding file compressor

Usage:
  huffman-ts encode <input file> [output file]
  huffman-ts decode <input file> [output file]

When encoding:
  - If [output file] is omitted, the compressor writes <input file>.huf

When decoding:
  - If [output file] is omitted, the decompressor removes the .huf suffix
    from the input filename (or writes <input>.out if no .huf suffix exists).
  - To write decoded bytes to stdout instead of a file, pass '-' or '--stdout'

Examples:
  npm run encode -- example.txt           # -> example.txt.huf
  npm run encode -- example.txt out.huf   # -> out.huf
  npm run decode -- example.txt.huf       # -> example.txt
  npm run decode -- example.txt.huf -     # -> prints decoded bytes to stdout
`);
}

function defaultEncodeOutput(input: string): string {
  return `${input}.huf`;
}

function defaultDecodeOutput(input: string): string {
  if (input.endsWith(".huf")) return input.slice(0, -".huf".length);
  return `${input}.out`;
}

function formatBytes(n: number): string {
  return `${n.toLocaleString()} bytes`;
}

function main(): void {
  const [, , command, inputArg, outputArg] = process.argv;

  if (!command || !inputArg || (command !== "encode" && command !== "decode")) {
    printUsage();
    process.exit(command ? 1 : 0);
  }

  const inputPath = path.resolve(inputArg);
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: input file not found: ${inputPath}`);
    process.exit(1);
  }

  const data = fs.readFileSync(inputPath);

  if (command === "encode") {
    const outputPath = path.resolve(outputArg ?? defaultEncodeOutput(inputArg));
    const result = encodeBuffer(data);
    fs.writeFileSync(outputPath, result.output);

    const ratio =
      result.originalSize > 0
        ? (100 * (1 - result.compressedSize / result.originalSize)).toFixed(1)
        : "0.0";

    console.log(`Encoded: ${inputPath}`);
    console.log(`  -> ${outputPath}`);
    console.log(`  Original:    ${formatBytes(result.originalSize)}`);
    console.log(`  Compressed:  ${formatBytes(result.compressedSize)}`);
    console.log(`  Distinct symbols: ${result.distinctSymbols}`);
    console.log(`  Space saved: ${ratio}%`);
  } else {
    const result = decodeBuffer(data);
    const wantsStdout = outputArg === "-" || outputArg === "--stdout";
    if (wantsStdout) {
      // Write raw bytes to stdout
      process.stdout.write(result.output);
      console.log();
      console.log(`Decoded: ${inputPath} -> stdout`);
    } else {
      const outputPath = path.resolve(outputArg ?? defaultDecodeOutput(inputArg));
      fs.writeFileSync(outputPath, result.output);
      console.log(`Decoded: ${inputPath}`);
      console.log(`  -> ${outputPath}`);
      console.log(`  Output size: ${formatBytes(result.originalSize)}`);
    }
  }
}

main();
