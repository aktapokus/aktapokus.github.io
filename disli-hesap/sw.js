// Disli Hesabi - internetsiz calisma. Sayfa degisince SURUM'u artir.
const SURUM = "disli-v1";
const DOSYALAR = [
  "./", "./index.html", "./manifest.webmanifest",
  "./simge/apple-touch-icon.png", "./simge/simge-192.png",
  "./simge/simge-512.png", "./simge/simge-maskable-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SURUM).then(c => c.addAll(DOSYALAR)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(adlar => Promise.all(adlar.filter(a => a !== SURUM).map(a => caches.delete(a))))
    .then(() => self.clients.claim()));
});

// Sayfa: once agdan dene (guncel kalsin), olmazsa onbellek. Digerleri: once onbellek.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const sayfa = e.request.mode === "navigate";
  e.respondWith(sayfa
    ? fetch(e.request).then(y => { const k = y.clone(); caches.open(SURUM).then(c => c.put(e.request, k)); return y; })
        .catch(() => caches.match(e.request).then(y => y || caches.match("./index.html")))
    : caches.match(e.request).then(y => y || fetch(e.request).then(ag => {
        if (ag.ok || ag.type === "opaque") { const k = ag.clone(); caches.open(SURUM).then(c => c.put(e.request, k)); }
        return ag;
      }))
  );
});
