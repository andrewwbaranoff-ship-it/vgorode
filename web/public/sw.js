const CACHE_NAME = ‘vgorode-v1’;
const OFFLINE_URLS = [
‘/’,
‘/manifest.json’,
];
self.addEventListener(‘install’, (event) => {
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => {
return cache.addAll(OFFLINE_URLS);
}).then(() => self.skipWaiting())
);
});
self.addEventListener(‘activate’, (event) => {
event.waitUntil(
caches.keys().then((keys) =>
Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
).then(() => self.clients.claim())
);
});
self.addEventListener(‘fetch’, (event) => {
if (event.request.method !== ‘GET’) return;
const url = new URL(event.request.url);
if (url.origin !== location.origin) return;
event.respondWith(
caches.match(event.request).then((cached) => {
const networkFetch = fetch(event.request).then((response) => {
if (response.ok) {
const clone = response.clone();
caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
}
return response;
});
return cached || networkFetch;
})
);
});
