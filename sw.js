const CACHE_NAME = 'city-elegance-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/main.css',
  './assets/css/components.css',
  './assets/js/app.js',
  './assets/js/state.js',
  './assets/js/mock-data.js',
  './assets/js/services/storage-service.js',
  './assets/js/services/ai-service.js',
  './assets/js/services/speech-service.js',
  './assets/js/components/inbox-view.js',
  './assets/js/components/chat-view.js',
  './assets/js/components/catalog-modal.js',
  './assets/js/components/analytics-view.js',
  './assets/js/components/demo-panel.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Stale-while-revalidate for local assets, network first for API calls
  if (event.request.url.includes('api.anthropic.com')) {
    return; // Don't cache LLM API calls
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {/* Offline fallback */});
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
