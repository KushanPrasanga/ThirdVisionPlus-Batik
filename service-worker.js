const CACHE_NAME = 'bathixen-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/login.html',
  '/admin.html',
  '/manifest.json',
  '/js/app.js',
  '/js/hsop-calculator.js',
  '/js/firebase-init.js',
  '/js/security-enhancer.js',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/assets/logo.png'
];

// Install event - cache files
self.addEventListener('install', event => {
  console.log('🔄 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      console.log('📦 Caching files...');
      // Use Promise.all to handle individual failures
      return Promise.all(
        urlsToCache.map(url => {
          return cache.add(url).catch(err => {
            console.warn(`⚠️ Failed to cache ${url}:`, err);
            // Continue even if one fails
            return Promise.resolve();
          });
        })
      );
    })
    .then(() => {
      console.log('✅ Service Worker installed');
      return self.skipWaiting();
    })
    .catch(err => {
      console.error('❌ Service Worker installation failed:', err);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('🔄 Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) {
        return response; // Return cached response
      }
      // Not in cache, fetch from network
      return fetch(event.request)
        .then(networkResponse => {
          // Optionally cache new requests
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(error => {
          console.warn('⚠️ Fetch failed:', event.request.url, error);
          // You could return a fallback page here if needed
          return new Response('Network error', { status: 408 });
        });
    })
  );
});