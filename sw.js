const CACHE_NAME = "dami-archive-v4";

const APP_SHELL = [
  "./",
  "./index.html",
  "./archive.html",
  "./calculator.html",
  "./study-companion.html",
  "./study-companion-app.html",
  "./manifest.json",
  "./icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./study-companion-tasks.jpg",
  "./shot01.jpg",
  "./shot02.jpg",
  "./shot03.jpg",
  "./shot04.jpg",
  "./shot05.jpg",
  "./shot06.jpg",
  "./shot07.jpg",
  "./shot08.jpg",
  "./shot09.jpg",
  "./shot10.jpg",
  "./shot11.jpg",
  "./shot12.jpg",
  "./shot13.jpg",
  "./shot14.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          if (response && response.status === 200 && response.type === "basic") {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});