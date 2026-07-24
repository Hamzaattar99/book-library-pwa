const CACHE_NAME = 'bookstore-cache-v1';
// الملفات المراد كاشها لتعمل بدون إنترنت
const ASSETS = [
    'index.html',
    'style.css',
    'app.js',
    'manifest.json'
];

// مرحلة التثبيت وكاش الملفات
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('جاري حفظ الملفات في الكاش...');
            return cache.addAll(ASSETS);
        })
    );
});

// تفعيل وتحديث الكاش القديم
self.addEventListener('activate', (e) => {
    console.log('الـ Service Worker نشط الآن');
});

// جلب الملفات من الكاش في حال عدم وجود إنترنت (Offline)
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            return cachedResponse || fetch(e.request);
        })
    );
});
