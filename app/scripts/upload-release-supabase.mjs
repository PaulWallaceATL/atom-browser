#!/usr/bin/env node
/**
 * Upload Tauri bundle artifacts from src-tauri/target/release/bundle/ to Supabase Storage.
 * Run from repo root or from app/ with: node app/scripts/upload-release-supabase.mjs
 *   or from app/: node scripts/upload-release-supabase.mjs
 *
 * Requires env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Optional: SUPABASE_BUCKET (default: releases), RELEASE_VERSION (default: from app/package.json)
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || "releases";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Resolve app dir: script lives in app/scripts/, so app is parent of script's parent
const appDir = join(__dirname, "..");
const bundleDir = join(appDir, "src-tauri", "target", "release", "bundle");

let version = process.env.RELEASE_VERSION;
if (!version) {
  try {
    const pkg = JSON.parse(
      readFileSync(join(appDir, "package.json"), "utf8")
    );
    version = pkg.version || "0.0.0";
  } catch {
    version = "0.0.0";
  }
}
if (!version.startsWith("v")) version = `v${version}`;

const prefix = `atom-browser/${version}`;

function* walk(dir, base = dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(full, base);
    } else {
      yield relative(base, full);
    }
  }
}

const exts = [".dmg", ".msi", ".exe", ".deb", ".AppImage", ".rpm"];
function isBundleFile(name) {
  return exts.some((ext) => name.endsWith(ext));
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  let found = 0;
  let uploaded = 0;

  if (statSync(bundleDir, { throwIfNoEntry: false })?.isDirectory !== true) {
    console.error("Bundle directory not found:", bundleDir);
    process.exit(1);
  }

  for (const rel of walk(bundleDir)) {
    if (!isBundleFile(rel)) continue;
    found++;
    const fullPath = join(bundleDir, rel);
    const storagePath = `${prefix}/${rel.split("/").pop()}`;
    const body = readFileSync(fullPath);
    const contentType =
      rel.endsWith(".dmg") || rel.endsWith(".msi") || rel.endsWith(".exe")
        ? "application/octet-stream"
        : rel.endsWith(".deb") || rel.endsWith(".rpm")
          ? "application/vnd.debian.binary-package"
          : "application/octet-stream";

    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, body, {
      contentType,
      upsert: true,
    });
    if (error) {
      console.error("Upload failed:", storagePath, error.message);
    } else {
      console.log("Uploaded:", storagePath);
      uploaded++;
    }
  }

  console.log(`Done. Found ${found} bundle file(s), uploaded ${uploaded}.`);
  if (uploaded === 0 && found === 0) {
    console.warn("No bundle files found. Check that tauri build produced artifacts in", bundleDir);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
