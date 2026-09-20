import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(projectRoot, "public", "profile.webp");
const outputDir = path.join(projectRoot, "public", "holo-avatar", "assets");
const width = 768;
const height = 1152;

await mkdir(outputDir, { recursive: true });

const metadata = await sharp(sourcePath).metadata();
if (!metadata.width || !metadata.height) throw new Error("无法读取头像源图尺寸");

const cropWidth = Math.min(metadata.width, Math.round(metadata.height * (2 / 3)));
const left = Math.max(0, Math.min(metadata.width - cropWidth, metadata.width - cropWidth - 12));
const top = Math.max(0, Math.floor((metadata.height - cropWidth * 1.5) / 2));
const cropHeight = Math.min(metadata.height - top, Math.round(cropWidth * 1.5));

const base = () => sharp(sourcePath)
  .extract({ left, top, width: cropWidth, height: cropHeight })
  .resize(width, height, { fit: "fill", kernel: sharp.kernel.lanczos3 });

await base()
  .modulate({ brightness: 0.88, saturation: 0.82 })
  .blur(0.65)
  .png({ compressionLevel: 9 })
  .toFile(path.join(outputDir, "background.png"));

const subjectMask = Buffer.from(`
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs><filter id="soft"><feGaussianBlur stdDeviation="5" /></filter></defs>
    <path filter="url(#soft)" fill="white" d="M38 230 L138 128 L294 104 L405 48 L586 55 L715 132 L758 268 L746 420 L680 538 L726 700 L704 868 L624 1050 L552 1152 L124 1152 L106 1042 L206 914 L248 792 L180 676 L72 596 L18 430 Z" />
  </svg>
`);

const subjectBuffer = await base()
  .ensureAlpha()
  .composite([{ input: subjectMask, blend: "dest-in" }])
  .png({ compressionLevel: 9 })
  .toBuffer();

await sharp(subjectBuffer)
  .png({ compressionLevel: 9 })
  .toFile(path.join(outputDir, "subject.png"));

await sharp(subjectBuffer)
  .flatten({ background: "#ffffff" })
  .greyscale()
  .convolve({
    width: 3,
    height: 3,
    kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
    scale: 1,
    offset: 0,
  })
  .normalize()
  .threshold(72)
  .png({ compressionLevel: 9 })
  .toFile(path.join(outputDir, "lineart.png"));

const textLayer = Buffer.from(`
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect x="25" y="25" width="718" height="1102" rx="42" fill="none" stroke="rgba(255,255,255,.72)" stroke-width="3" />
    <path d="M55 93 H210 M558 93 H713 M55 1060 H210 M558 1060 H713" stroke="rgba(255,255,255,.52)" stroke-width="2" />
    <text x="58" y="88" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="8">YISHUO</text>
    <text x="710" y="88" fill="white" text-anchor="end" font-family="Arial, sans-serif" font-size="20" letter-spacing="5">01</text>
    <text x="58" y="1088" fill="white" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="5">PROJECT ARCHIVE</text>
    <text x="710" y="1088" fill="white" text-anchor="end" font-family="Arial, sans-serif" font-size="16" letter-spacing="3">BUILD / LEARN / REPEAT</text>
  </svg>
`);

await sharp(textLayer)
  .png({ compressionLevel: 9 })
  .toFile(path.join(outputDir, "text.png"));

console.log(`Holographic avatar layers built at ${outputDir}`);
