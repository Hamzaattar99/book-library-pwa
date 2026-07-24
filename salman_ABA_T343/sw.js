// اسم الكاش وإصداره
const CACHE_NAME = 'vision-library-v1';

// قائمة الملفات المطلوب تخزينها لتعمل أوفلاين 100%
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './app-icon.png',
    './about.html',
    './about.css'
];

// 1. مرحلة التثبيت (Install): حفظ الملفات الأساسية في الكاش
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('جاري تخزين ملفات المكتبة في الكاش...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// 2. مرحلة التنشيط (Activate): تنظيف الكاش القديم إن وجد
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('حذف الكاش القديم:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3. مرحلة جلب البيانات (Fetch): القراءة من الكاش أولاً إذا كنت أوفلاين
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // إذا كان الملف موجوداً في الكاش ارجعه مباشرة
            if (cachedResponse) {
                return cachedResponse;
            }
            // وإلا جلب من الشبكة
            return fetch(event.request);
        })
    );
});