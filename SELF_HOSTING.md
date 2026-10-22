# Hosting PhonicsQuest yourself

PhonicsQuest is a static website: HTML, JavaScript, CSS, images and audio.
There is no server or database. Each child's progress is saved in their own
browser. So anywhere that can serve files can host it, with or without GitHub.

## 1. What you need on your computer

- **Node.js 22** (LTS) from <https://nodejs.org>. It includes `npm`.
- The PhonicsQuest folder (unzipped download, or `git clone`).

Open a terminal in the folder and install the tools once:

```bash
npm install
```

## 2. Try it locally

```bash
npm run dev
```

Your browser opens at `http://localhost:3000/phonicsquest/`. Edits to files
in `src/` show up immediately. Press `Ctrl+C` to stop.

## 3. Build the website

The build needs to know **which address path** the app will live at.

| Where it will live                        | Command                               |
| ----------------------------------------- | ------------------------------------- |
| `https://myphonics.com/` (whole domain)   | `BASE_PATH=/ npm run build`           |
| `https://example.com/reading/`            | `BASE_PATH=/reading/ npm run build`   |
| GitHub Pages (`…github.io/phonicsquest/`) | `npm run build` (this is the default) |

On **Windows PowerShell**, set the variable first:

```powershell
$env:BASE_PATH="/"; npm run build
```

The finished website is the **`docs/`** folder. Upload its _contents_ to your
host, not the folder itself.

To check the build before uploading, run the same `BASE_PATH` with `preview`:

```bash
BASE_PATH=/ npx vite preview     # opens http://localhost:4173/
```

## 4. Put it online

Any of these work. All give free HTTPS, which the app needs for the
microphone (story recording) and for installing it as an app.

### Netlify (easiest)

1. Sign up at <https://app.netlify.com> (no GitHub needed. Use email).
2. **Add new site → Deploy manually**, and drag the `docs/` folder in.
3. You get an address like `https://cheerful-otter-123.netlify.app`.
4. To update later: **Deploys** tab, drag the new `docs/` folder in again.

### Cloudflare Pages

1. Sign up at <https://dash.cloudflare.com> → **Workers & Pages → Create →
   Pages → Upload assets**.
2. Name the project, drag in the `docs/` folder, **Deploy**.

### Your own server (nginx, Apache, shared hosting)

Copy the contents of `docs/` into the web root (e.g. `public_html/`) with
FTP or `scp`. No special configuration is needed.

## 5. Use your own domain

1. Buy a domain from any registrar (Cloudflare, Namecheap, Porkbun…).
2. In Netlify: **Domain management → Add a domain**. In Cloudflare Pages:
   **Custom domains → Set up a domain**.
3. The host shows one or two DNS records (usually a `CNAME`). Add them at your
   registrar. HTTPS turns on by itself within a few minutes to an hour.
4. Build with `BASE_PATH=/` since the app now sits at the root of the domain.

## 6. Every time you make a change

```bash
npm test                       # make sure nothing broke
BASE_PATH=/ npm run build      # rebuild
# upload docs/ again
```

The app notices the new version on the child's next visit and updates itself.
Their progress is kept.

## Things to know

- **Progress belongs to the address.** Browsers keep saved data per website
  address. Moving from `…github.io/phonicsquest/` to a new domain starts each
  child fresh. Use the parent dashboard's export and import to carry progress
  across, and pick your final domain early.
- **AI helper keys** (Gemini, Claude, OpenAI) are entered by the parent in
  Settings and stored only in that browser. Nothing to set up on the host.
- **Backups.** Keep a copy of the whole folder (USB drive, cloud storage). If
  you used git, the hidden `.git` folder has the full history of every change.
