import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "art", "dive", "creatures");
const FRAME = 175;
const SHEET_W = FRAME * 4;

const SOURCES = {
  shark: { file: "shark.png", maxDim: 152, rotations: [0, -4, 0, 4], bob: [0, -2, 0, 2] },
  squid: { file: "squid.png", maxDim: 148, rotations: [0, -3, 0, 3], bob: [0, 3, 0, -3] },
  angelfish: { file: "fish.png", maxDim: 150, rotations: [0, -5, 0, 5], bob: [0, -2, 0, 2] },
};

// The source art has a flat near-white/light-gray background baked into the
// RGB pixels (no real alpha channel). Flood-fill from the border to cut it
// out while leaving enclosed light regions (e.g. a shark's white belly) alone.
async function removeFlatBackground(sourcePath) {
  const { data, info } = await sharp(sourcePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const isBg = (r, g, b) => {
    const maxC = Math.max(r, g, b), minC = Math.min(r, g, b);
    return maxC - minC < 10 && r > 222;
  };

  const visited = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) {
    stack.push(x, 0, x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    stack.push(0, y, w - 1, y);
  }
  // dedupe pairs pushed above by just flattening: rebuild properly below
  stack.length = 0;
  for (let x = 0; x < w; x++) { stack.push(x * 1, 0); stack.push(x, h - 1); }
  for (let y = 0; y < h; y++) { stack.push(0, y); stack.push(w - 1, y); }

  const idxOf = (x, y) => y * w + x;
  while (stack.length) {
    const y = stack.pop();
    const x = stack.pop();
    if (x < 0 || x >= w || y < 0 || y >= h) continue;
    const pi = idxOf(x, y);
    if (visited[pi]) continue;
    const di = pi * 4;
    const r = data[di], g = data[di + 1], b = data[di + 2];
    if (!isBg(r, g, b)) continue;
    visited[pi] = 1;
    data[di + 3] = 0;
    stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
  }

  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

async function addDropShadow(buf, w, h, dx = 3, dy = 5, blur = 4.5) {
  const silhouette = await sharp({
    create: { width: w, height: h, channels: 4, background: { r: 4, g: 16, b: 26, alpha: 1 } },
  })
    .composite([{ input: buf, blend: "dest-in" }])
    .png()
    .toBuffer();

  const blurred = await sharp(silhouette).blur(blur).toBuffer();

  const canvasW = w + Math.abs(dx) * 2 + 20;
  const canvasH = h + Math.abs(dy) * 2 + 20;
  const originX = Math.round((canvasW - w) / 2);
  const originY = Math.round((canvasH - h) / 2);

  return sharp({
    create: { width: canvasW, height: canvasH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: blurred, left: originX + dx, top: originY + dy, blend: "over" },
      { input: buf, left: originX, top: originY, blend: "over" },
    ])
    .png()
    .toBuffer();
}

async function buildFrame(cleanBuf, { maxDim, rotation, bob }) {
  const trimmed = await sharp(cleanBuf).trim({ threshold: 10 }).toBuffer();
  const trimmedMeta = await sharp(trimmed).metadata();

  const scale = maxDim / Math.max(trimmedMeta.width, trimmedMeta.height);
  const rw = Math.round(trimmedMeta.width * scale);
  const rh = Math.round(trimmedMeta.height * scale);
  const resized = await sharp(trimmed).resize(rw, rh).toBuffer();

  const workSize = Math.round(maxDim * 1.5);
  const cx = Math.round((workSize - rw) / 2);
  const cy = Math.round((workSize - rh) / 2);
  const onCanvas = await sharp({
    create: { width: workSize, height: workSize, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: resized, left: cx, top: cy }])
    .png()
    .toBuffer();

  const rotated = await sharp(onCanvas)
    .rotate(rotation, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const rotatedMeta = await sharp(rotated).metadata();

  const withShadow = await addDropShadow(rotated, rotatedMeta.width, rotatedMeta.height);
  const shadowMeta = await sharp(withShadow).metadata();

  const fitScale = Math.min((FRAME * 0.94) / shadowMeta.width, (FRAME * 0.94) / shadowMeta.height);
  const fw = Math.round(shadowMeta.width * fitScale);
  const fh = Math.round(shadowMeta.height * fitScale);
  const finalCreature = await sharp(withShadow).resize(fw, fh).toBuffer();

  const left = Math.round((FRAME - fw) / 2);
  const top = Math.round((FRAME - fh) / 2 + bob);

  return sharp({
    create: { width: FRAME, height: FRAME, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: finalCreature, left, top }])
    .png()
    .toBuffer();
}

async function renderSheet(name, config) {
  const sourcePath = join(outDir, config.file);
  const cleanBuf = await removeFlatBackground(sourcePath);

  const frames = [];
  for (let i = 0; i < 4; i++) {
    const buf = await buildFrame(cleanBuf, {
      maxDim: config.maxDim,
      rotation: config.rotations[i],
      bob: config.bob[i],
    });
    frames.push(buf);
  }

  const sheet = sharp({
    create: { width: SHEET_W, height: FRAME, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  });
  const composites = frames.map((buf, i) => ({ input: buf, left: i * FRAME, top: 0 }));
  const outPath = join(outDir, `${name}-sheet.png`);
  await sheet.composite(composites).png().toFile(outPath);

  const fileBuf = await sharp(outPath).toBuffer();
  const meta = await sharp(outPath).metadata();
  console.log(`✓ ${name}-sheet.png  ${meta.width}×${meta.height}  ${Math.round(fileBuf.length / 1024)}KB`);
}

async function main() {
  for (const [name, config] of Object.entries(SOURCES)) {
    await renderSheet(name, config);
  }
  console.log(`\nDone! ${Object.keys(SOURCES).length} sprite sheets rendered from source art.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
