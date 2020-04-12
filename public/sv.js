self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open("cube-timer").then(function(cache) {
      return cache.addAll([
        "/",
        "/global.css",
        "/build/bundle.css",
        "/build/bundle.js",
      ]);
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(self.clients.claim());
});
