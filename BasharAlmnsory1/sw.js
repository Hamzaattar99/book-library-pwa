const CACHE_NAME = 'books-gallery-v2';
const ASSETS = [
    'books.html',
    'books.css',
    'script.js',
    'manifest.json',
    'file_00000000e7547246845e0d0e99ee4c95.png'

];


self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
});



self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {

            return cachedResponse || fetch(event.request).catch(() => {
                return new Response('', {
                    status: 200,
                    headers: { 'Content-Type': 'text/css' }
                });
            });
        })
    );
});