# Packaging Atom Browser and Hosting Downloads

This guide covers building installers, uploading them to Supabase Storage, and adding a download button to your website.

---

## 1. What gets packaged

Atom Browser is a **Tauri 2** desktop app. When you run a release build, Tauri produces platform-specific installers in:

- **macOS**: `app/src-tauri/target/release/bundle/dmg/*.dmg` (and `.app` in `macos/`)
- **Windows**: `app/src-tauri/target/release/bundle/msi/*.msi` or `nsis/*.exe`
- **Linux**: `app/src-tauri/target/release/bundle/deb/*.deb`, `appimage/*.AppImage`, etc.

The **release workflow** (on tag push `v*`) builds on Linux, Windows, and macOS and can upload these artifacts to **Supabase Storage** so they are available at stable URLs.

---

## 2. Security and usability (done before release)

These are already addressed in the repo:

- **URL safety**: Before navigating, the app calls the Rust `check_url` command (Atom Shield). **Malicious** URLs are blocked; **suspicious** ones show a “Visit anyway?” prompt. If the backend is unavailable, navigation is allowed so the app still works.
- **CSP**: A minimal Content-Security-Policy is set in `tauri.conf.json` for the UI webview to reduce XSS risk.
- **Keychain**: Passwords are stored via Tauri’s secure store (file on disk). There is a dev fallback to `localStorage` when the Tauri environment isn’t available.

Recommendations for you:

- **Code signing (macOS/Windows)**: For wider distribution, sign the app and installers so the OS doesn’t warn users. This requires Apple/Windows developer certificates and configuring Tauri’s code signing.
- **Keychain**: Ensure users understand that saved passwords are stored locally and are only as safe as their machine.

---

## 3. Supabase setup

### 3.1 Create a Storage bucket

1. In the [Supabase Dashboard](https://supabase.com/dashboard), open your project.
2. Go to **Storage** and create a new bucket, e.g. `releases`.
3. Make the bucket **public** if you want direct download links (e.g. `https://<project>.supabase.co/storage/v1/object/public/releases/...`).  
   Alternatively keep it private and use **signed URLs** for time-limited download links.

### 3.2 Get credentials

- **Project URL**: Project Settings → API → Project URL (`SUPABASE_URL`).
- **Service role key**: Project Settings → API → `service_role` secret (`SUPABASE_SERVICE_ROLE_KEY`).  
  Use this only in CI/backend; never expose it in the frontend.

### 3.3 Configure CI secrets

In your Forgejo/GitHub repo, add **Secrets**:

- `SUPABASE_URL` = your project URL  
- `SUPABASE_SERVICE_ROLE_KEY` = your service role key  

The release workflow uses these to upload artifacts. If they are not set, the build still runs but the “Upload to Supabase Storage” step is skipped.

---

## 4. How the release workflow uploads artifacts

When you push a tag like `v0.1.0`:

1. The **Release** workflow runs and builds the app on Linux, Windows, and macOS.
2. Each job runs `app/scripts/upload-release-supabase.mjs`, which:
   - Reads the version from the tag (e.g. `v0.1.0`).
   - Finds bundle files (`.dmg`, `.msi`, `.exe`, `.deb`, `.AppImage`, etc.) under `app/src-tauri/target/release/bundle/`.
   - Uploads each file to the Supabase bucket at:  
     `atom-browser/<version>/<filename>`  
     e.g. `atom-browser/v0.1.0/Atom Browser_0.1.0_aarch64.dmg`.

**Bucket**: By default the script uses the bucket name `releases`. Override with the env var `SUPABASE_BUCKET` in CI if you use a different name.

**Public URL pattern** (if the bucket is public):

```text
https://<YOUR_PROJECT_REF>.supabase.co/storage/v1/object/public/releases/atom-browser/<VERSION>/<FILENAME>
```

Example:

```text
https://abcdefgh.supabase.co/storage/v1/object/public/releases/atom-browser/v0.1.0/Atom%20Browser_0.1.0_aarch64.dmg
```

Filename is URL-encoded (e.g. spaces → `%20`).

---

## 5. Download button on your website

On your main site, add a “Download” section that points to these URLs. You can:

- **Option A – Single button (recommended)**: Detect the user’s OS and point the button to the right file (e.g. Windows → `.msi` or `.exe`, macOS → `.dmg`, Linux → `.AppImage` or `.deb`).
- **Option B – Multiple buttons**: “Download for Windows”, “Download for macOS (Intel)”, “Download for macOS (Apple Silicon)”, “Download for Linux”.

Example (pseudo-code) for a single smart button:

```js
const base = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/releases/atom-browser/v0.1.0';
const ua = navigator.userAgent;
let url, label;
if (ua.includes('Win')) {
  url = `${base}/Atom%20Browser_0.1.0_x64-setup.exe`;   // or .msi
  label = 'Download for Windows';
} else if (ua.includes('Mac')) {
  url = ua.includes('Intel') || ua.includes('x64')
    ? `${base}/Atom%20Browser_0.1.0_x64.dmg`
    : `${base}/Atom%20Browser_0.1.0_aarch64.dmg`;
  label = 'Download for macOS';
} else {
  url = `${base}/Atom%20Browser_0.1.0_amd64.AppImage`;  // or .deb
  label = 'Download for Linux';
}
// Use <a href={url} download>{label}</a> or window.location.href = url
```

Use the **actual filenames** produced by your Tauri build (they include the version and target, e.g. `Atom Browser_0.1.0_aarch64.dmg`). You can list the bucket folder after a release to copy exact names, or derive them from your `productName` and version in `tauri.conf.json` / `package.json`.

To avoid hardcoding the version on the site, you can:

- Maintain a small JSON or API that returns the latest version and download URLs, or  
- Use a fixed “latest” path and configure Supabase or a redirect to point “latest” to the current version.

---

## 6. Building and uploading manually

If you want to build and upload without CI:

1. **Build** (from repo root):
   ```bash
   cd app && npm run build && cargo tauri build
   ```
   For macOS ARM + Intel:
   ```bash
   cargo tauri build --target aarch64-apple-darwin
   cargo tauri build --target x86_64-apple-darwin
   ```

2. **Upload** (from repo root, after setting env vars):
   ```bash
   cd app
   export SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   export RELEASE_VERSION=v0.1.0   # optional; defaults to app/package.json version
   node scripts/upload-release-supabase.mjs
   ```

Artifacts will appear under `atom-browser/<version>/` in your Supabase bucket.

---

## 7. Checklist

- [ ] Supabase project created; Storage bucket `releases` (or custom) created and set to public if you want direct links.
- [ ] CI secrets `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set in your Forgejo/GitHub repo.
- [ ] Tag pushed (e.g. `v0.1.0`) to trigger the release workflow; artifacts uploaded to Supabase.
- [ ] Main website has a Download button that links to the correct Supabase Storage URLs (with correct version and filenames).
- [ ] (Optional) Code signing configured for macOS/Windows for better trust and fewer OS warnings.
