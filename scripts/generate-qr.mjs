import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import QRCode from "qrcode";

const siteUrl = process.env.SITE_URL || "https://47.103.29.78/video/";
const outputPath = resolve(process.cwd(), "assets/qr-code.svg");

await mkdir(dirname(outputPath), { recursive: true });
const svg = await QRCode.toString(siteUrl, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 1,
  color: {
    dark: "#152016",
    light: "#ffffff",
  },
});
await writeFile(outputPath, svg, "utf8");
console.log(`QR generated for ${siteUrl}`);
