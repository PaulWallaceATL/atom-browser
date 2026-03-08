# Add "Download Atom Browser" to antimatterai.com

No Supabase needed. Installers are hosted on **GitHub Releases** or **Forgejo Releases** after you push a version tag (e.g. `v0.1.0`). The release workflow builds Windows, macOS, and Linux installers and attaches them to the release.

---

## 1. Where the files come from

- Push a tag like `v0.1.0` to your repo.
- The CI builds the app and creates a **Release** with all installers attached.
- Users can download from the release page.

**Repo URL** (choose one):

- **GitHub**: `https://github.com/YOUR_ORG/atom-browser`  
  Latest release: `https://github.com/YOUR_ORG/atom-browser/releases/latest`
- **Forgejo**: `https://YOUR_FORGEJO_HOST/YOUR_ORG/atom-browser`  
  Releases: `https://YOUR_FORGEJO_HOST/YOUR_ORG/atom-browser/releases`

Replace `YOUR_ORG` and (for Forgejo) `YOUR_FORGEJO_HOST` with your actual values.

---

## 2. Button that links to the release (recommended)

One button: “Download Atom Browser” → opens the release page so users can pick Windows / macOS / Linux.

**HTML (match your site’s styles):**

```html
<a href="https://github.com/YOUR_ORG/atom-browser/releases/latest"
   target="_blank"
   rel="noopener noreferrer"
   class="your-button-class">
  Download Atom Browser
</a>
```

If you use **Forgejo**, change the link to your releases URL, e.g.:

```html
<a href="https://codeberg.org/YOUR_ORG/atom-browser/releases"
   target="_blank"
   rel="noopener noreferrer"
   class="your-button-class">
  Download Atom Browser
</a>
```

---

## 3. Optional: one button that picks the right installer

You can use a single “Download” button that sends the user to the correct file by OS.  
Use the **same** `RELEASES_LATEST_URL` as in section 2 (your GitHub or Forgejo latest/releases page).  
The script below goes to that page; for a direct-download link you’d need the exact asset URLs (e.g. from the Releases API or a small JSON you maintain).

**Simple version – open latest release page (works with GitHub):**

```html
<a href="#" id="download-atom-browser" class="your-button-class">Download Atom Browser</a>

<script>
(function () {
  var repo = 'YOUR_ORG/atom-browser';  // e.g. 'antimatterai/atom-browser'
  var latestUrl = 'https://github.com/' + repo + '/releases/latest';
  document.getElementById('download-atom-browser').addEventListener('click', function (e) {
    e.preventDefault();
    window.open(latestUrl, '_blank', 'noopener,noreferrer');
  });
})();
</script>
```

Replace `YOUR_ORG` with your GitHub org or username. For Forgejo, set `latestUrl` to your releases URL instead.

---

## 4. Where to put it on antimatterai.com

- **Atom section** (e.g. under “Atom Agentic”, “Atom IntentIQ”): add a “Download Atom Browser” button next to or under the product links.
- **Footer**: under “Atom” → “Atom Enterprise”, “Atom Agentic”, etc., add a link “Download Atom Browser” that points to the same release URL.
- **CTA**: reuse the same link in a “Start Your Project”–style CTA if you want to offer the browser as an option.

Use the same `href` as in section 2 so the button always goes to the latest release (or your Forgejo releases page).

---

## 5. Checklist

1. Repo is on GitHub or Forgejo and the **Release** workflow runs on tag push (e.g. `v0.1.0`).
2. On **Forgejo**: if the release job fails with a permission error, add a repo token with release write permission and set it as `GITHUB_TOKEN` (or use the action’s token input if it supports `GITEA_TOKEN`).
3. Replace `YOUR_ORG` (and Forgejo host) in the link and script with your real repo URL.
4. Add the button/link on [antimatterai.com](https://www.antimatterai.com/) and test that it opens the correct release page.

After that, pushing a new tag will publish a new release and your existing “Download Atom Browser” link will still point to the latest release (on GitHub, `/releases/latest` redirects to the newest release).
