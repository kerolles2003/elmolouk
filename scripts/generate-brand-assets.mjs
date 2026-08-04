/**
 * Generates every browser-identity and social-sharing asset from the two source
 * lockups in `public/images/`. Run with `pnpm brand:assets` after either source
 * logo changes; the outputs are committed, so the build itself needs no image
 * pipeline and no runtime image generation.
 *
 * Why crop rather than scale the whole lockup: the artwork is a stacked lockup
 * — emblem over "EL MOLOUK" over two lines of strapline. Scaled to 16px the
 * strapline becomes three grey smears and the emblem loses half its height to
 * type that cannot be read at any tab size. The emblem alone is the part that
 * survives, so the emblem alone is the icon. The full lockup is kept for the
 * Open Graph cards, where there is room to read it.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const p = (...s) => join(ROOT, ...s);

/** Brand tokens, mirrored from `app/globals.css`. Keep in sync by hand. */
const CREAM = "#fbf5ea";
const GOLD = "#c99a5b";

const SRC_LOCKUP = p("public/images/logo_english.png");

// ---------------------------------------------------------------------------
// Emblem extraction
// ---------------------------------------------------------------------------

/**
 * Finds the crown-and-leaves emblem inside a stacked lockup by walking down
 * from the first inked row until a sustained blank band appears — the gap the
 * designer left between the emblem and the wordmark. Measured rather than
 * hard-coded so a re-exported logo with different margins still crops right.
 */
async function emblemBox(src) {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const inked = (x, y) => {
    const i = (y * W + x) * C;
    if (data[i + 3] < 32) return false;
    return !(data[i] > 238 && data[i + 1] > 238 && data[i + 2] > 238);
  };

  const rowInk = [];
  for (let y = 0; y < H; y++) {
    let n = 0;
    for (let x = 0; x < W; x++) if (inked(x, y)) n++;
    rowInk.push(n);
  }

  const top = rowInk.findIndex((v) => v > 0);
  let bottom = H - 1;
  for (let y = top + 20; y < H - 3; y++) {
    if (rowInk[y] <= 2 && rowInk[y + 1] <= 2 && rowInk[y + 2] <= 2) {
      bottom = y - 1;
      break;
    }
  }

  let left = W;
  let right = 0;
  for (let y = top; y <= bottom; y++) {
    for (let x = 0; x < W; x++) {
      if (!inked(x, y)) continue;
      if (x < left) left = x;
      if (x > right) right = x;
    }
  }
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

/**
 * The emblem on a transparent square canvas, trimmed tight and centred. Every
 * icon below is a resize of this one buffer, so they cannot drift apart.
 */
async function squareEmblem(src) {
  const box = await emblemBox(src);
  const side = Math.max(box.width, box.height);
  return sharp(src)
    .extract(box)
    .extend({
      top: Math.round((side - box.height) / 2),
      bottom: side - box.height - Math.round((side - box.height) / 2),
      left: Math.round((side - box.width) / 2),
      right: side - box.width - Math.round((side - box.width) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

/**
 * @param emblem  square, transparent emblem buffer
 * @param size    output edge in px
 * @param inset   fraction of the edge left as breathing room on each side
 * @param bg      css colour, or null for a transparent icon
 */
async function icon(emblem, size, inset, bg) {
  const art = Math.round(size * (1 - inset * 2));
  const scaled = await sharp(emblem)
    .resize(art, art, { kernel: "lanczos3", fit: "contain" })
    // The source emblem is 259px across; anything above ~1.5x picks up the
    // softness of the upscale. A light unsharp pass puts the edge back without
    // ringing on the gold gradient.
    .sharpen({ sigma: 0.6, m1: 0.4, m2: 0.9 })
    .toBuffer();

  const base = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  });
  const offset = Math.round((size - art) / 2);
  return (
    base
      .composite([{ input: scaled, top: offset, left: offset }])
      /*
        Palette-quantised, not truecolour. The emblem is two flat inks over a
        gold gradient, so 256 colours reproduce it with no visible banding while
        cutting the 512px icon from ~270 kB to ~40 kB. That matters more than it
        looks: manifest icons are fetched on install, and Android pulls the 512
        before it will show the splash screen.
      */
      .png({ compressionLevel: 9, palette: true, quality: 100, effort: 10 })
      .toBuffer()
  );
}

// ---------------------------------------------------------------------------
// ICO container
// ---------------------------------------------------------------------------

/**
 * Assembles a multi-resolution .ico from raw RGBA frames.
 *
 * The frames are written as bottom-up 32-bit BMP/DIB rather than embedded PNG.
 * PNG-in-ICO is legal and smaller, but it is only understood from Windows Vista
 * on and a handful of older feed readers, crawlers and Electron shells still
 * render a PNG entry as garbage. At 16-48px the size saved is under 10 kB, so
 * the compatible encoding wins.
 */
function buildIco(frames) {
  const dibs = frames.map(({ size, rgba }) => {
    const header = Buffer.alloc(40);
    header.writeUInt32LE(40, 0);
    header.writeInt32LE(size, 4);
    header.writeInt32LE(size * 2, 8); // doubled: colour rows + AND-mask rows
    header.writeUInt16LE(1, 12);
    header.writeUInt16LE(32, 14);
    header.writeUInt32LE(0, 16); // BI_RGB
    header.writeUInt32LE(size * size * 4, 20);

    // BMP stores rows bottom-up and channels as BGRA.
    const pixels = Buffer.alloc(size * size * 4);
    for (let y = 0; y < size; y++) {
      const srcRow = (size - 1 - y) * size * 4;
      for (let x = 0; x < size; x++) {
        const s = srcRow + x * 4;
        const d = (y * size + x) * 4;
        pixels[d] = rgba[s + 2];
        pixels[d + 1] = rgba[s + 1];
        pixels[d + 2] = rgba[s];
        pixels[d + 3] = rgba[s + 3];
      }
    }

    // The 1bpp AND mask is redundant for 32bpp frames but the format still
    // requires the rows to be present; zeroed means "use the alpha channel".
    const maskStride = Math.ceil(size / 32) * 4;
    const mask = Buffer.alloc(maskStride * size, 0);
    return { size, data: Buffer.concat([header, pixels, mask]) };
  });

  const dir = Buffer.alloc(6);
  dir.writeUInt16LE(0, 0);
  dir.writeUInt16LE(1, 2); // 1 = icon
  dir.writeUInt16LE(dibs.length, 4);

  let offset = 6 + dibs.length * 16;
  const entries = dibs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size === 256 ? 0 : size, 0);
    e.writeUInt8(size === 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette size
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });

  return Buffer.concat([dir, ...entries, ...dibs.map((d) => d.data)]);
}

// ---------------------------------------------------------------------------
// Open Graph cards
// ---------------------------------------------------------------------------

/**
 * A 1200x630 card: cream panel carrying the lockup on the reading side, the
 * page's own photograph filling the rest, a gold rule on the seam.
 *
 * No text is drawn beyond the lockup itself. One card is shared by all seven
 * locales, and baking an English headline into the image a `/ar` page shares
 * would put Latin script in front of an Arabic reader with no way to localise
 * it. The headline lives in `og:title`, which every platform renders in the
 * page's own language; the image carries the brand and the crop.
 */
const OG_W = 1200;
const OG_H = 630;
const PANEL = 508;

async function ogCard(photo, out) {
  const lockup = await sharp(SRC_LOCKUP)
    .resize({ width: 336, kernel: "lanczos3" })
    .toBuffer();
  const lockupMeta = await sharp(lockup).metadata();

  const shot = await sharp(photo)
    .resize(OG_W - PANEL, OG_H, { fit: "cover", position: "attention" })
    .toBuffer();

  // A short cream-to-transparent feather so the photo does not butt hard
  // against the panel and the gold rule reads as a seam, not a border.
  const feather = Buffer.from(
    `<svg width="${OG_W - PANEL}" height="${OG_H}" xmlns="http://www.w3.org/2000/svg">
       <defs><linearGradient id="f" x1="0" x2="1">
         <stop offset="0" stop-color="${CREAM}" stop-opacity="0.55"/>
         <stop offset="0.14" stop-color="${CREAM}" stop-opacity="0"/>
       </linearGradient></defs>
       <rect width="100%" height="100%" fill="url(#f)"/>
     </svg>`,
  );

  await sharp({
    create: {
      width: OG_W,
      height: OG_H,
      channels: 4,
      background: CREAM,
    },
  })
    .composite([
      { input: shot, left: PANEL, top: 0 },
      { input: feather, left: PANEL, top: 0 },
      {
        input: Buffer.from(
          `<svg width="4" height="${OG_H}" xmlns="http://www.w3.org/2000/svg">
             <rect width="4" height="${OG_H}" fill="${GOLD}"/>
           </svg>`,
        ),
        left: PANEL - 4,
        top: 0,
      },
      {
        input: lockup,
        left: Math.round((PANEL - lockupMeta.width) / 2),
        top: Math.round((OG_H - lockupMeta.height) / 2),
      },
    ])
    .jpeg({ quality: 88, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toFile(out);
}

// ---------------------------------------------------------------------------

async function main() {
  await mkdir(p("public/icons"), { recursive: true });
  await mkdir(p("public/og"), { recursive: true });

  const emblem = await squareEmblem(SRC_LOCKUP);
  const box = await emblemBox(SRC_LOCKUP);
  console.log(
    `emblem source: ${box.width}x${box.height} at ${box.left},${box.top}`,
  );

  // --- favicon.ico -------------------------------------------------------
  // Zero inset: 16px has no room to spend on margin, and the browser already
  // pads the tab slot.
  const icoFrames = [];
  for (const size of [16, 32, 48]) {
    const png = await icon(emblem, size, 0.02, null);
    const { data } = await sharp(png)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    icoFrames.push({ size, rgba: data });
  }
  await writeFile(p("app/favicon.ico"), buildIco(icoFrames));
  console.log("app/favicon.ico  16 + 32 + 48");

  // --- standalone PNG icons ---------------------------------------------
  const pngIcons = [
    ["public/icons/icon-16.png", 16, 0.02, null],
    ["public/icons/icon-32.png", 32, 0.02, null],
    ["public/icons/icon-192.png", 192, 0.06, null],
    ["public/icons/icon-512.png", 512, 0.06, null],
    // Apple composites the touch icon onto the home screen with no alpha
    // handling of its own, so a transparent icon lands on black. Opaque cream,
    // and more inset because iOS rounds the corners off what we send.
    ["public/icons/apple-touch-icon.png", 180, 0.12, CREAM],
    // Maskable: Android crops to an arbitrary shape and only the middle 80%
    // is guaranteed to survive, so the emblem sits inside that safe circle.
    ["public/icons/icon-maskable-512.png", 512, 0.22, CREAM],
    ["public/icons/icon-maskable-192.png", 192, 0.22, CREAM],
  ];
  for (const [out, size, inset, bg] of pngIcons) {
    await writeFile(p(out), await icon(emblem, size, inset, bg));
    console.log(`${out}  ${size}x${size}${bg ? " opaque" : ""}`);
  }

  // --- Open Graph cards --------------------------------------------------
  const cards = [
    ["public/images/land.webp", "public/og/og-default.jpg"],
    ["public/images/Beauregard.webp", "public/og/og-product.jpg"],
    ["public/images/factory.webp", "public/og/og-quality.jpg"],
  ];
  for (const [photo, out] of cards) {
    await ogCard(p(photo), p(out));
    console.log(`${out}  ${OG_W}x${OG_H}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
