# Publishing PhonicsQuest to the Google Play Store

PhonicsQuest is already a **PWA** (it ships a `manifest.json`, a service worker, and
maskable icons). That means we don't rebuild it as a native app — we wrap the live
website in a thin Android shell called a **Trusted Web Activity (TWA)**. The shell is a
real, installable Android app that opens `https://ricetogether17.github.io/phonicsquest/`
full-screen with no browser UI.

This guide is the end-to-end checklist, tailored to this repo's GitHub Pages setup.

---

## 0. What you need before you start

| Item | Cost | Notes |
| --- | --- | --- |
| Google Play Console developer account | **US$25 one-time** | Not recurring. This is the only Google account you need — there is no separate "web developer" account. |
| The app hosted at a public URL | free | Already live at `https://ricetogether17.github.io/phonicsquest/` via GitHub Pages. |
| A signed Android `.aab` | free | Generated from the PWA (Step 2). |
| `assetlinks.json` hosted at the **domain root** | free | Proves you own the site (Step 3). **This is the one tricky step for project pages — read it carefully.** |

> **Heads-up for new personal accounts:** Google now requires personal developer
> accounts created after Nov 2023 to run a **closed test with at least 12 testers for
> 14 continuous days** before you can publish to production. Plan for ~2 extra weeks.

---

## 1. Create the Google Play Console account

1. Go to **https://play.google.com/console/signup**.
2. Sign in with the Google account that should own the app.
3. Choose **Personal** (individual) or **Organization** (needs a D-U-N-S number).
4. Pay the **US$25** one-time fee.
5. Complete **identity + address verification** (government ID). Approval can take a few days.

---

## 2. Generate the Android app from the PWA

### Easiest: PWABuilder (no Android Studio needed)

1. Make sure the PWA is live and the manifest is valid: open
   `https://ricetogether17.github.io/phonicsquest/` and confirm it installs.
2. Go to **https://www.pwabuilder.com**, paste the URL, and run the report.
3. Open the **Android** package options:
   - **Package ID:** `io.github.ricetogether17.phonicsquest` (must match `assetlinks.json` — see Step 3).
   - **App name:** PhonicsQuest
   - Leave "signing key" on **Create new** the first time. **Download and back up the
     keystore + passwords it gives you** — losing it means you can never update the app.
4. Click **Download** → you get a `.zip` containing:
   - `app-release-signed.aab` ← upload this to Play
   - `assetlinks.json` ← the real one with your fingerprint (compare against Step 3)
   - the signing keystore

### Alternative: Bubblewrap (command line, more control)

```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest https://ricetogether17.github.io/phonicsquest/manifest.json
bubblewrap build      # produces app-release-signed.aab + assetlinks fingerprint
```

---

## 3. Host `assetlinks.json` — the critical step for this repo

For the app to open **without** a browser address bar, Google must find a Digital Asset
Links file at the **scheme + host root**:

```
https://ricetogether17.github.io/.well-known/assetlinks.json
```

⚠️ **Note the path.** It is at the *host root*, **not** under `/phonicsquest/`. Because
this site is a GitHub Pages **project page**, files in *this* repo are served under
`/phonicsquest/...`, so you **cannot** place the file at the required location from here.

You have three options:

- **Option A (recommended) — user/root Pages repo.** Create a repo named
  `ricetogether17.github.io` and add `.well-known/assetlinks.json` there; it serves at
  `https://ricetogether17.github.io/.well-known/assetlinks.json`. ✅ A **ready-to-commit
  bundle** (asset-links file, `.nojekyll`, landing page, and step-by-step README) is in
  **`play-store/well-known-repo/`** — just add your fingerprint and push it.
- **Option B — custom domain.** Point a custom domain (e.g. `phonicsquest.app`) at the
  Pages site, then host `assetlinks.json` at that domain's root and change the PWA
  `start_url`/`scope` to the domain root.
- **Option C — move the app to the domain root** so scope is `/` instead of `/phonicsquest/`.

A ready-to-edit template lives at **`play-store/assetlinks.json`** in this repo. Replace
`REPLACE_WITH_YOUR_APP_SIGNING_SHA256_FINGERPRINT` with the SHA-256 you get from:

- **PWABuilder:** it's in the downloaded `assetlinks.json`, **or**
- **Play Console:** after first upload, go to **Release → Setup → App signing** and copy
  the **SHA-256 certificate fingerprint** (use the *App signing key*, not the upload key).

> If the fingerprint is wrong or the file is unreachable, the app still works but shows a
> Chrome address bar at the top. That's the #1 TWA gotcha.

---

## 4. Prepare store listing assets

Google requires:

- **App icon:** 512×512 PNG (you have `public/icons/icon-512.png`).
- **Feature graphic:** 1024×500 PNG/JPG (needs to be created).
- **Screenshots:** at least 2 phone screenshots (1080px+ on the short side). Capture from
  the live app — these also fill the empty `screenshots` array in `manifest.json` for a
  richer install prompt.
- **Short description** (≤80 chars) and **full description** (≤4000 chars).
- **Privacy policy URL** — **required**, and strictly enforced for apps aimed at children.

---

## 5. Kids / Families compliance (important for this app)

PhonicsQuest is categorised `["education", "kids"]`, so Google's **Families policy** applies:

- Complete the **Content Rating** questionnaire honestly.
- In **Play Console → Policy → App content**, set the **Target audience and content** to
  include children, and consider opting into the **Designed for Families** program (adds a
  review but boosts trust + discoverability).
- A compliant **privacy policy** is mandatory (COPPA / GDPR-K). State what data is
  collected. PhonicsQuest stores progress in `localStorage` on-device only — say so plainly.
- No behavioural/personalised ads for child audiences.

---

## 6. Upload and release

1. In **Play Console → Create app**, fill name, language, app/game, free/paid.
2. **Release → Testing → Closed testing:** create a track, add testers, upload the `.aab`.
   (Required for the 14-day / 12-tester rule on new personal accounts.)
3. Fill **all** Dashboard items: store listing, content rating, data safety, target audience.
4. After the test period, promote the release to **Production** and submit for review
   (typically a few days, longer for kids apps).

---

## 7. Updating later

- **Content changes** to the website go live automatically — the TWA loads the live URL,
  so a `git push` to `main` (which redeploys Pages) updates the app instantly. No Play
  resubmission needed for content. 🎉
- **Only** re-upload a new `.aab` when you change the package itself (name, icon, target
  SDK, Android features). Increment `versionCode` and **sign with the same keystore**.

---

## Quick reference

| Thing | Value |
| --- | --- |
| Live URL | `https://ricetogether17.github.io/phonicsquest/` |
| Suggested package ID | `io.github.ricetogether17.phonicsquest` |
| Asset links location | `https://ricetogether17.github.io/.well-known/assetlinks.json` |
| Build tools | [PWABuilder](https://www.pwabuilder.com) or [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) |
| Dev account | https://play.google.com/console/signup ($25 one-time) |
