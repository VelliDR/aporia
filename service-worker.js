const CACHE_NAME = 'aporia-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  'https://cdn.tailwindcss.com' // Tailwind CDN'ini de lokal belleğe alıyoruz
];

// 1. Kurulum (Install) Aşaması: Varlıkları Önbelleğe Al
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. Aktivasyon (Activate) Aşaması: Eski Önbellekleri Temizle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Yakalama (Fetch) Aşaması: Çevrimdışı Öncelikli Strateji
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Eğer önbellekte varsa oradan döndür, yoksa internetten iste
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});