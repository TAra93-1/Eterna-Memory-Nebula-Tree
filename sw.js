const CACHE_NAME = "eterna-v1";

// Install: cache the core shell
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([
        "./%E8%AE%B0%E5%BF%86%E6%98%9F%E4%BA%91%E6%A0%91.html",
        "./%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260213135122_657_54.jpg",
        "./manifest.json"
      ])
    )
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first, fallback to cache
self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Cache a copy of successful responses
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
