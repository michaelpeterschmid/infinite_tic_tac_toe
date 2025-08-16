
/*

1) Important concept (so it behaves how you want)

Do NOT precache HTML/CSS/JS if you want the newest versions immediately.

Instead, use NetworkFirst for HTML, CSS, and JS.

Online → it fetches the network (so you get updates right away).

Offline → it falls back to what’s in the cache.

We’ll only precache small, stable files (e.g., offline.html, icons, manifest). Images can stay CacheFirst.

*/


/* sw.js */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

workbox.setConfig({ debug: false });

// Update immediately
self.skipWaiting();
workbox.core.clientsClaim();

// Clean up old precaches if names change
workbox.precaching.cleanupOutdatedCaches();

// Optional: speed up NetworkFirst for navigations
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

/**
 * PRECACHE ONLY STABLE, NON-HTML/NON-CSS/NON-JS FILES
 * (Do not precache index.html, *.css, or *.js if you want instant updates.)
 */
workbox.precaching.precacheAndRoute([
  { url: './manifest.webmanifest', revision: null },
  { url: './offline.html',         revision: null },
  { url: './circle.png',           revision: null },
  { url: './cross.png',            revision: null }
]);

/**
 * HTML (navigations): NetworkFirst so updates appear immediately when online,
 * fall back to cached/offline when offline.
 */
workbox.routing.registerRoute(
  ({request}) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({
    cacheName: 'pages',
    networkTimeoutSeconds: 3, // don’t hang forever on flaky networks
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60 // 1 day
      })
    ]
  })
);

/**
 * CSS & JS: NetworkFirst (check server for updates first, then cache)
 * Works well on GitHub Pages because it sends ETags/Last-Modified.
 */
workbox.routing.registerRoute(
  ({request}) => request.destination === 'style' || request.destination === 'script',
  new workbox.strategies.NetworkFirst({
    cacheName: 'assets',
    networkTimeoutSeconds: 3,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
      })
    ]
  })
);

/**
 * Images: CacheFirst (fast, offline-friendly), with limits.
 */
workbox.routing.registerRoute(
  ({request}) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      })
    ]
  })
);

/**
 * Offline fallback for navigations that miss cache.
 */
workbox.routing.setCatchHandler(async ({event}) => {
  if (event.request.mode === 'navigate') {
    return workbox.precaching.matchPrecache('./offline.html');
  }
  return Response.error();
});
