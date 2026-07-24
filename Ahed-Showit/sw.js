// اسم ذاكرة التخزين المؤقت (Cache) - غيّره لو عدّلت الملفات لتحديث النسخة
const CACHE_NAME = "book-gallery-v1";

// الملفات التي سيتم تخزينها للعمل بدون إنترنت
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icons/books_1.png",
  "./icons/books_5.png",
];

// عند التثبيت: تخزين الملفات الأساسية
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// عند التفعيل: حذف أي نسخ كاش قديمة
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// عند كل طلب: نجرب الكاش أولاً، وإن لم يوجد نذهب للإنترنت
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
