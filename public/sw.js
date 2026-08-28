// Ishami Service Worker PURGE / SELF-UNREGISTER
// This worker intentionally removes itself and all caches to eliminate
// stale-index.html-with-deleted-chunk-hashes MIME type "text/html" crashes
// on /simulation, /quiz, /ai-assistant, etc.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      if ('caches' in self) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      // Unregister this worker itself
      await self.registration.unregister();
      // Force all clients to reload with fresh server content
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((c) => { try { c.navigate(c.url); } catch (_) {} });
    })()
  );
});

self.addEventListener('fetch', () => { /* no-op, will unregister */ });
