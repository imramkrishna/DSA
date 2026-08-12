function parseDelayArg(): number {
  const idx = process.argv.indexOf("--delay");
  if (idx !== -1 && process.argv[idx + 1]) {
    const val = Number(process.argv[idx + 1]);
    if (!Number.isNaN(val)) return val;
  }
  return 400;
}

export default parseDelayArg