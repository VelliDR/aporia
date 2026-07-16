const CACHE_NAME = 'aporia-v2'; // Versiyonu artırdık ki eskisini silsin
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(ASSETS_TO_CACHE.map(asset => cache.add(asset)));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Eski cache'i acımasızca yok et
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First Stratejisi: Önce internetteki YENİ koda bak, yoksa (offline isen) cache'i kullan.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});