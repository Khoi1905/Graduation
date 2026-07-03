import QRCode from "qrcode";
import nextEnv from "@next/env";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://your-app.vercel.app";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const guestsPath = path.join(__dirname, "..", "data", "guests.json");
const outputDir = path.join(__dirname, "..", "output", "qr");

async function main() {
  const guests = JSON.parse(fs.readFileSync(guestsPath, "utf-8"));

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const keys = Object.keys(guests).filter((k) => k !== "default");
  console.log(`Using site URL: ${SITE_URL}`);

  for (const key of keys) {
    const url = `${SITE_URL}/?n=${key}`;
    const filePath = path.join(outputDir, `${key}.png`);
    await QRCode.toFile(filePath, url, {
      width: 512,
      margin: 2,
      color: { dark: "#0a1628", light: "#f0e8d8" },
    });
    console.log(`OK ${key} -> ${filePath}`);
  }

  console.log(`\nDone! ${keys.length} QR codes generated.`);
}

main().catch(console.error);
