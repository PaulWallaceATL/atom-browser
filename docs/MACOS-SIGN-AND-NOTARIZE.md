# Get around the “damaged” message: sign and notarize on macOS

To stop macOS from saying the app is “damaged,” you need to **code sign** and **notarize** it with an Apple Developer account. Then Gatekeeper will trust it and users can open it without workarounds.

---

## 1. What you need

- **Apple Developer account** – [developer.apple.com](https://developer.apple.com) ($99/year for distribution outside the App Store).
- **Developer ID Application certificate** – Created in your Apple Developer account, installed on your Mac (or exported for CI).
- **Notarization** – Apple ID + app-specific password + Team ID (so Apple can notarize the app).

---

## 2. One-time setup

### A. Create a Developer ID Application certificate

1. On your Mac, create a **Certificate Signing Request (CSR)**:
   - Open **Keychain Access** → menu **Keychain Access** → **Certificate Assistant** → **Request a Certificate From a Certificate Authority**.
   - Email: your email. Common Name: e.g. “Atom Browser”. CA Email: leave empty.
   - Select **Saved to disk** → Continue → Save the `.certSigningRequest` file.

2. In [Apple Developer → Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/certificates/list):
   - Click **+** to create a certificate.
   - Under **Software**, choose **Developer ID Application** → Continue.
   - Upload the CSR you just created → Continue → **Download** the `.cer` file.

3. **Install the certificate**: double‑click the `.cer` file. It will be added to your **login** keychain under “My Certificates.”

### B. Get your signing identity name

In Terminal:

```bash
security find-identity -v -p codesigning
```

Find the line for **“Developer ID Application: …”** and copy the full name in quotes, e.g.  
`Developer ID Application: John Smith (TEAM_ID)`.

That string is your **signing identity**.

### C. (For notarization) App-specific password and Team ID

1. **Team ID**  
   [developer.apple.com/account](https://developer.apple.com/account) → **Membership** → **Team ID**.

2. **App-specific password**  
   [appleid.apple.com](https://appleid.apple.com) → Sign-In and Security → **App-Specific Passwords** → Generate one. Use this only for notarization; don’t put your main Apple ID password in scripts.

---

## 3. Build a signed and notarized app

From the **atom-browser** repo, in the `app` directory, set the environment variables and build.

**Option A – Sign only (no notarization)**  
Users may still see a Gatekeeper warning once, but “Open” will work. No Apple ID needed for this step.

```bash
cd app
export APPLE_SIGNING_IDENTITY="Developer ID Application: Your Name (TEAM_ID)"
npm run build
CI=false cargo tauri build
```

**Option B – Sign and notarize (recommended)**  
No “damaged” and no extra Gatekeeper prompt after download.

```bash
cd app
export APPLE_SIGNING_IDENTITY="Developer ID Application: Your Name (TEAM_ID)"
export APPLE_ID="your-apple-id@email.com"
export APPLE_PASSWORD="xxxx-xxxx-xxxx-xxxx"
export APPLE_TEAM_ID="YOUR_TEAM_ID"
npm run build
CI=false cargo tauri build
```

Replace:

- `APPLE_SIGNING_IDENTITY` with the exact string from `security find-identity -v -p codesigning`.
- `APPLE_ID` with your Apple ID email.
- `APPLE_PASSWORD` with the **app-specific password** (not your normal password).
- `APPLE_TEAM_ID` with your Team ID.

The built app and DMG will be under `app/src-tauri/target/release/bundle/` (e.g. `macos/Atom Browser.app` and `dmg/Atom Browser_0.1.0_aarch64.dmg`). Zip the `.app` or use the `.dmg` and upload that to GitHub Releases. Users can download and open it without the “damaged” message.

---

## 4. Optional: put the identity in config

Instead of setting `APPLE_SIGNING_IDENTITY` every time, you can set it once in `app/src-tauri/tauri.conf.json` under `bundle.macOS`:

```json
"macOS": {
  "signingIdentity": "Developer ID Application: Your Name (TEAM_ID)",
  "hardenedRuntime": true,
  "minimumSystemVersion": "10.13"
}
```

Do **not** commit your real signing identity if the repo is public; use the env var in that case.

---

## 5. Summary

| Step | What to do |
|------|------------|
| 1 | Apple Developer account → create **Developer ID Application** cert → install on Mac. |
| 2 | Run `security find-identity -v -p codesigning` and copy the **Developer ID Application** name. |
| 3 | Set `APPLE_SIGNING_IDENTITY` (and for notarization: `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`). |
| 4 | Build with `npm run build` and `CI=false cargo tauri build` in `app/`. |
| 5 | Upload the signed/notarized `.app` or `.dmg` (or zip) to GitHub Releases. |

After that, the download link on your site will serve a build that macOS trusts, and users won’t see “damaged” or need Terminal workarounds.
