const CACHE_NAME = 'neonaut-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Status(Elite-v3) - Initialized');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim()); // Take control of all pages immediately 
});

self.addEventListener('fetch', (event) => {
  // 1. Never cache manifest, API, or Root (Ensures autonomous refresh & kills ghost headers)
  if (event.request.url.includes('/manifest.json') || 
      event.request.url.includes('/api/') || 
      new URL(event.request.url).pathname === '/') {
    return; // Let browser handle normally
  }

  // 2. Cache-First Strategy for Images in /archive (Performance win)
  if (event.request.url.includes('/archive/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // 2. Network-First Strategy for everything else (Fixes the Cmd+Shift+R issue)
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache valid successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
