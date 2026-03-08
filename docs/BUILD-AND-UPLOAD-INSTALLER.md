# Build the installer and get it into your website repo

No GitHub, Forgejo, or Supabase. Build in **atom-browser**, copy the file into your **website repo**, then add the button.

---

## 1. Build in the atom-browser repo

From the **atom-browser** repo:

```bash
cd app
npm install
npm run build
cargo tauri build
```

You’ll get installer(s) under `app/src-tauri/target/release/bundle/` (e.g. `dmg/Atom Browser_0.1.0_aarch64.dmg` on Apple Silicon).

---

## 2. Copy the installer into your website repo

Still in **atom-browser**, run the copy script and point it at the website repo’s downloads folder.

**Create the folder in the website repo first** (if it doesn’t exist), e.g.:

- Next.js / Vite / many static sites: `public/downloads`
- Or: `static/downloads`, `downloads`, etc. — whatever your site serves as static files.

Then from **atom-browser**:

```bash
cd app
node scripts/copy-release-to-website.mjs /absolute/path/to/your-website-repo/public/downloads
```

Example if both repos are next to each other:

```bash
cd app
node scripts/copy-release-to-website.mjs ../../antimatter-website/public/downloads
```

The script copies all built installers (`.dmg`, `.msi`, `.exe`, etc.) and renames them to URL‑friendly names (e.g. `Atom-Browser_0.1.0_aarch64.dmg`). It prints what it copied.

---

## 3. Add the download button in the website repo

In your **website** repo, add a link that points at the file you just copied. The URL path is whatever your site uses for files in that folder (usually `/downloads/...`).

**HTML:**

```html
<a href="/downloads/Atom-Browser_0.1.0_aarch64.dmg"
   download
   target="_blank"
   rel="noopener noreferrer">
  Download Atom Browser
</a>
```

Use the **actual filename** the script printed (e.g. `Atom-Browser_0.1.0_aarch64.dmg` or `Atom-Browser_0.1.0_x64.dmg`). If you have both Mac builds, add two links or a small “Download for Mac (Apple Silicon)” / “Download for Mac (Intel)” section.

**If your site is in a subpath** (e.g. `https://www.antimatterai.com/` with no base path), keep the href as `/downloads/...`. If you use a base path (e.g. `/site/`), use e.g. `/site/downloads/Atom-Browser_0.1.0_aarch64.dmg`.

---

## 4. Commit and deploy

In the **website** repo:

1. Commit the new file(s) in `public/downloads/` (or your chosen folder).
2. Commit the button/link you added.
3. Deploy as usual.

After deploy, the button will serve the installer from your own site.

---

## Quick reference

| Step | Repo        | Command / action |
|------|-------------|-------------------|
| 1    | atom-browser | `cd app && npm run build && cargo tauri build` |
| 2    | atom-browser | `node scripts/copy-release-to-website.mjs /path/to/website/public/downloads` |
| 3    | website     | Create `public/downloads` if needed, add `<a href="/downloads/Filename.dmg" download>Download Atom Browser</a>` |
| 4    | website     | Commit and deploy |
