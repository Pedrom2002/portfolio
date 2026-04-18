// One-shot script: convert public/textures/*.{jpg,png} → .webp
// Usage: node scripts/convert-textures.mjs
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const DIR = path.join(process.cwd(), "public", "textures");

const files = (await fs.readdir(DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f));

let totalIn = 0;
let totalOut = 0;

for (const file of files) {
  const inPath = path.join(DIR, file);
  const ext = path.extname(file).toLowerCase();
  const stem = file.slice(0, -ext.length);
  const outPath = path.join(DIR, `${stem}.webp`);

  const inStat = await fs.stat(inPath);
  const isAlpha = ext === ".png";

  await sharp(inPath)
    .webp(
      isAlpha
        ? { lossless: true, effort: 6 }
        : { quality: 85, effort: 6, smartSubsample: true }
    )
    .toFile(outPath);

  const outStat = await fs.stat(outPath);
  totalIn += inStat.size;
  totalOut += outStat.size;

  const pct = ((1 - outStat.size / inStat.size) * 100).toFixed(1);
  console.log(
    `${file.padEnd(30)} ${(inStat.size / 1024).toFixed(0).padStart(5)} KB → ${(outStat.size / 1024).toFixed(0).padStart(5)} KB  (-${pct}%)`
  );
}

console.log(
  `\nTotal: ${(totalIn / 1024).toFixed(0)} KB → ${(totalOut / 1024).toFixed(0)} KB  (-${((1 - totalOut / totalIn) * 100).toFixed(1)}%)`
);
