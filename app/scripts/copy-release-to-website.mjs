#!/usr/bin/env node
/**
 * Copy built installer(s) from this repo into your website repo so you can
 * serve them and add a download button.
 *
 * Usage (from atom-browser repo):
 *   cd app && node scripts/copy-release-to-website.mjs /path/to/website-repo/public/downloads
 *
 * Or set WEBSITE_DOWNLOADS_DIR:
 *   export WEBSITE_DOWNLOADS_DIR=/path/to/website-repo/public/downloads
 *   cd app && node scripts/copy-release-to-website.mjs
 *
 * Build first: npm run build && cargo tauri build
 */

import { copyFileSync, mkdirSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const appDir = join(__dirname, "..");
const bundleDir = join(appDir, "src-tauri", "target", "release", "bundle");

const destDir = process.argv[2] || process.env.WEBSITE_DOWNLOADS_DIR;
if (!destDir) {
  console.error("Usage: node scripts/copy-release-to-website.mjs <path-to-website-downloads-folder>");
  console.error("Example: node scripts/copy-release-to-website.mjs ../../antimatter-website/public/downloads");
  process.exit(1);
}

const exts = [".dmg", ".msi", ".exe", ".deb", ".AppImage", ".rpm"];
function isBundleFile(name) {
  return exts.some((ext) => name.endsWith(ext));
}

function* walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

// URL-friendly filename (no spaces)
function safeName(name) {
  return name.replace(/\s+/g, "-");
}

try {
  mkdirSync(destDir, { recursive: true });
} catch (e) {
  if (e.code !== "EEXIST") throw e;
}

if (!statSync(bundleDir, { throwIfNoEntry: false })?.isDirectory()) {
  console.error("Bundle not found. Build first from app/: npm run build && cargo tauri build");
  process.exit(1);
}

let count = 0;
for (const full of walk(bundleDir)) {
  const name = full.split("/").pop().split("\\").pop();
  if (!isBundleFile(name)) continue;
  const destName = safeName(name);
  const destPath = join(destDir, destName);
  copyFileSync(full, destPath);
  console.log("Copied:", destName, "->", destPath);
  count++;
}

if (count === 0) {
  console.error("No installer files found in", bundleDir);
  process.exit(1);
}
console.log("Done. Copied", count, "file(s) to", destDir);
