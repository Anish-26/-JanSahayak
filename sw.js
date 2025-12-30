const CACHE_NAME = 'jansahayak-v3';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './eligibilityRules.js',
    './manifest.json',
    './data/schemes.json',
    './data/centers.json',
    './lang/en.json',
    './lang/hi.json',
    './lang/bn.json'
];

// Install Event: Cache Core Assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching Assets');
                return cache.addAll(ASSETS);
            })
    );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// Fetch Event: Stale-While-Revalidate Strategy
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    // Update Cache
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                }).catch(() => {
                    // Network failed, nothing to do (we rely on cache)
                });
                // Return cached response if available, else wait for network
                return cachedResponse || fetchPromise;
            });
        })
    );
});
