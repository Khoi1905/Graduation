import QRCode from "qrcode";
import fs from "fs";
import path from "path";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://your-app.vercel.app";
const guestsPath = path.join(__dirname, "..", "data", "guests.json");
const outputDir = path.join(__dirname, "..", "output", "qr");

async function main() {
  const guests = JSON.parse(fs.readFileSync(guestsPath, "utf-8"));

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const keys = Object.keys(guests).filter((k) => k !== "default");

  for (const key of keys) {
    const url = `${SITE_URL}/?n=${key}`;
    const filePath = path.join(outputDir, `${key}.png`);
    await QRCode.toFile(filePath, url, {
      width: 512,
      margin: 2,
      color: { dark: "#0a1628", light: "#f0e8d8" },
    });
    console.log(`✓ ${key} → ${filePath}`);
  }

  console.log(`\nDone! ${keys.length} QR codes generated.`);
}

main().catch(console.error);
