/**
 * The URL path the app is served from.
 *
 * GitHub Pages serves this repository at `/phonicsquest/`, so that is the
 * default. Any other host can set `BASE_PATH` at build time:
 *
 *   BASE_PATH=/ npm run build            # https://myphonics.example/
 *   BASE_PATH=/reading/ npm run build    # https://example.com/reading/
 *
 * Read by vite.config.js and by gen-sw-manifest.mjs, which must agree: the
 * service worker precaches exactly the URLs the page will ask for.
 */
export function basePath() {
  const raw = (process.env.BASE_PATH || '/phonicsquest/').trim();
  const withLeading = raw.startsWith('/') ? raw : `/${raw}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}
