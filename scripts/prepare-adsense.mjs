import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const clientId = process.env.VITE_ADSENSE_CLIENT_ID?.trim() ?? "";
const outputPath = resolve("public/ads.txt");
const clientMatch = /^ca-(pub-\d{16})$/.exec(clientId);

if (!clientMatch) {
  await rm(outputPath, { force: true });
  console.log("AdSense non configuré : aucun fichier ads.txt généré.");
  process.exit(0);
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(
  outputPath,
  `google.com, ${clientMatch[1]}, DIRECT, f08c47fec0942fa0\n`,
  "utf8",
);
console.log("Configuration AdSense et ads.txt préparés.");
