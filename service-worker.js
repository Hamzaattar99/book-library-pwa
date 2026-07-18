/* ==========================================
   BOOKVERSE SERVICE WORKER
========================================== */

const CACHE_NAME = "bookverse-v1";

/* ==========================================
   FILES TO CACHE
========================================== */

const STATIC_ASSETS = [

    "/",
    "index.html",
    "about.html",
    "contact.html",
    "book1.html",
    "book2.html",
    "book3.html",

    "manifest.json",

    "assets/css/style.css",
    "assets/js/app.js",

    "assets/icons/icon-72.png",
    "assets/icons/icon-96.png",
    "assets/icons/icon-128.png",
    "assets/icons/icon-144.png",
    "assets/icons/icon-152.png",
    "assets/icons/icon-192.png",
    "assets/icons/icon-384.png",
    "assets/icons/icon-512.png",

    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css",

    "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
];

/* ==========================================
   INSTALL
========================================== */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => {

            return cache.addAll(STATIC_ASSETS);

        })

    );

    self.skipWaiting();

});

/* ==========================================
   ACTIVATE
========================================== */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

        .then(keys => {

            return Promise.all(

                keys.map(key => {

                    if (key !== CACHE_NAME) {

                        return caches.delete(key);

                    }

                })

            );

        })

    );

    self.clients.claim();

});

/* ==========================================
   CACHE FIRST STRATEGY
========================================== */

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

        .then(cacheResponse => {

            if (cacheResponse) {

                return cacheResponse;

            }

            return fetch(event.request)

            .then(networkResponse => {

                if (
                    !networkResponse ||
                    networkResponse.status !== 200 ||
                    networkResponse.type !== "basic"
                ) {

                    return networkResponse;

                }

                const responseClone =
                    networkResponse.clone();

                caches.open(CACHE_NAME)

                .then(cache => {
                if(response.status === 200 && response.type === 'basic')
                    {
                    cache.put(
                        event.request,
                        responseClone
                    );
                }
                });

                return networkResponse;

            })

            .catch(() => {

                if (
                    event.request.destination ===
                    "document"
                ) {

                    return caches.match(
                        "./index.html"
                    );

                }

            });

        })

    );

});