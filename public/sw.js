// A very basic Service Worker to enable PWA installability

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let the browser do its default thing
  // for non-GET requests.
  if (event.request.method !== 'GET') return;

  // Prevent serving a cached version for API routes
  if (event.request.url.includes('/api/')) return;

  // Stale-while-revalidate strategy for a robust PWA
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const networkFetch = fetch(event.request).then((response) => {
        // Cache the response
        const responseClone = response.clone();
        caches.open('ombram-travel-v1').then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function (reason) {
        console.error('ServiceWorker fetch failed: ', reason);
      });
      return cachedResponse || networkFetch;
    })
  );
});
