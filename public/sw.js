// Este archivo será reemplazado por el generado por VitePWA
// Sirve como placeholder para asegurar que hay un service worker disponible
// en caso de que la generación automática falle

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
}); 