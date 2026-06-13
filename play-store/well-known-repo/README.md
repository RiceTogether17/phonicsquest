# `ricetogether17.github.io` — root Pages repo (for Digital Asset Links)

This folder is a **ready-to-commit copy** of the files you need in a **separate GitHub
repository** named exactly **`ricetogether17.github.io`**. Its only job is to serve the
Digital Asset Links file at the host root so your Play Store app (TWA) opens **without**
a browser address bar:

```
https://ricetogether17.github.io/.well-known/assetlinks.json
```

> Why a separate repo? `RiceTogether17/phonicsquest` is a *project* page — its files live
> under `/phonicsquest/...`. The asset-links file must sit at the **host root**, which only
> a **user/organisation** Pages repo (named `<username>.github.io`) can serve.

---

## What's in here

```
.well-known/assetlinks.json   ← the asset-links file (add your fingerprint!)
.nojekyll                      ← ensures the .well-known dot-folder is published
index.html                    ← simple landing page with a link to PhonicsQuest
```

---

## Setup (one time, ~5 minutes)

1. **Get your SHA-256 fingerprint** (you need this first):
   - From **PWABuilder**: open the `assetlinks.json` inside the downloaded Android zip, copy
     the `sha256_cert_fingerprints` value, **or**
   - From **Play Console** after first upload: **Release → Setup → App signing** → copy the
     **SHA-256 certificate fingerprint** of the **App signing key** (not the upload key).

2. **Edit `.well-known/assetlinks.json`** in this folder: replace
   `REPLACE_WITH_YOUR_APP_SIGNING_SHA256_FINGERPRINT` with that value. It looks like:
   `AB:CD:EF:12:...:90` (colon-separated hex).

3. **Create the repo** on GitHub named **`ricetogether17.github.io`** (public).

4. **Push these two files** to its `main` branch. From this folder:
   ```bash
   # from play-store/well-known-repo/
   git init -b main
   git add .well-known/assetlinks.json .nojekyll index.html
   git commit -m "Add Digital Asset Links for PhonicsQuest TWA"
   git remote add origin https://github.com/RiceTogether17/ricetogether17.github.io.git
   git push -u origin main
   ```

5. **Enable GitHub Pages:** repo **Settings → Pages → Source: Deploy from a branch →
   `main` / root**. Wait ~1 minute.

6. **Verify** the file is live and served as JSON:
   ```bash
   curl -s https://ricetogether17.github.io/.well-known/assetlinks.json
   ```
   You should see your JSON with the real fingerprint.

7. **Verify the link is valid** with Google's tester:
   `https://developers.google.com/digital-asset-links/tools/generator`
   — enter the website `https://ricetogether17.github.io`, package
   `io.github.ricetogether17.phonicsquest`, and your fingerprint.

---

## Common gotchas

- **Wrong key:** use the **App signing** SHA-256 (Google re-signs your app), not the upload
  key. If unsure, add **both** fingerprints to the `sha256_cert_fingerprints` array.
- **Served as HTML, not JSON:** GitHub Pages serves `.json` with the right content-type
  automatically — just don't rename the file or put it behind Jekyll processing. (Adding an
  empty `.nojekyll` file to the repo root avoids any Jekyll surprises with the `.well-known`
  dot-folder.)
- **Still see an address bar:** the file must match the package name **and** fingerprint
  exactly, and be reachable over HTTPS at the root. Re-check with the generator tool above.
