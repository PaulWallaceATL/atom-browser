# How to let people download Atom Browser

You have **GitHub + Vercel** for the website. Two ways to get the installer to users:

---

## Option A: Host the file somewhere else, link from your site (recommended)

**Why:** The installer (`.dmg` / `.exe`) can be 100MB+. Vercel has deployment size limits and your repo stays small. You host the file once, then your site just links to it.

### 1. Build the installer (in this repo)

```bash
cd app
npm install && npm run build && cargo tauri build
```

The file is at: `app/src-tauri/target/release/bundle/dmg/Atom Browser_0.1.0_aarch64.dmg` (or `_x64.dmg` on Intel Mac).

### 2. Upload that file to a host

Pick one:

- **GitHub Releases (easiest)**  
  1. Open your **website repo** (or any repo) on GitHub.  
  2. **Releases** → **Create a new release**.  
  3. Tag: `v0.1.0` (or any version).  
  4. Drag the `.dmg` (and `.exe` if you have it) into “Attach binaries.”  
  5. Publish.  
  6. Right‑click the file in the release → “Copy link address.”  
  You’ll get a URL like:  
  `https://github.com/YOUR_USERNAME/YOUR_REPO/releases/download/v0.1.0/Atom.Browser_0.1.0_aarch64.dmg`

- **Google Drive / Dropbox**  
  Upload the file, get a “share” link that forces download. Use that URL in the button.

- **Any file host**  
  Upload, get a direct download URL.

### 3. Add the button on your site (GitHub + Vercel repo)

In your **website** repo, add a link that uses the URL you copied:

```html
<a href="https://github.com/YOUR_USERNAME/YOUR_REPO/releases/download/v0.1.0/Atom.Browser_0.1.0_aarch64.dmg"
   download
   target="_blank"
   rel="noopener noreferrer">
  Download Atom Browser
</a>
```

Replace with your real URL. Commit, push → Vercel deploys. No installer file lives in the website repo.

---

## Option B: Put the file in the website repo (Vercel serves it)

**Why:** One repo, one deploy; the file is at `yoursite.com/downloads/...`.

**Catch:** Vercel has a **max deployment size** (e.g. 250MB on free tier). A single `.dmg` can be 100MB+, so this can work for one or two installers but may hit limits if you add more or the app grows.

### 1. Build the installer (in this repo)

Same as above:

```bash
cd app
npm install && npm run build && cargo tauri build
```

### 2. Copy the file into the website repo

From **this** repo:

```bash
cd app
node scripts/copy-release-to-website.mjs /path/to/your-website-repo/public/downloads
```

Example if the website repo is next to this one:

```bash
node scripts/copy-release-to-website.mjs ../../your-website-repo/public/downloads
```

Create `public/downloads` in the website repo first if it doesn’t exist.

### 3. Add the button in the website repo

```html
<a href="/downloads/Atom-Browser_0.1.0_aarch64.dmg"
   download
   target="_blank"
   rel="noopener noreferrer">
  Download Atom Browser
</a>
```

Use the exact filename the script printed (spaces become hyphens).

### 4. Commit and push

Commit the new file in `public/downloads/` and the button. Push to GitHub → Vercel deploys. The file will be at `https://your-site.vercel.app/downloads/Atom-Browser_0.1.0_aarch64.dmg`.

---

## Summary

| | Option A – Host elsewhere | Option B – File in repo |
|--|---------------------------|--------------------------|
| **Where the file lives** | GitHub Release / Drive / etc. | Website repo `public/downloads/` |
| **Button href** | Full URL to the file | `/downloads/Filename.dmg` |
| **Best for** | Any size file, clean repo | Small number of installers, under Vercel limits |

**Recommendation:** Use **Option A** (GitHub Release + link from the site). You get a stable download URL, no big binaries in the website repo, and no Vercel size worries. The button on your site is just a link to that URL.
