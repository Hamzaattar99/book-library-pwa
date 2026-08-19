// استيراد مكتبات Firebase للعمل في الخلفية
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// إعداد Firebase (استبدل القيم ببيانات مشروعك من Firebase Console)
firebase.initializeApp({
    apiKey: "AIzaSyA54YWCxlz6LYFCdwP_yFNY0dsX5VsHErI",
    authDomain: "books-5c9d5.firebaseapp.com",
    projectId: "books-5c9d5",
    storageBucket: "books-5c9d5.firebasestorage.app",
    messagingSenderId: "191558442951",
    appId: "1:191558442951:web:6deae8c5a413f9b080c3e2"
});

const messaging = firebase.messaging();

// استقبال الإشعارات عندما يكون التطبيق مغلقاً أو في الخلفية
messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title || 'تنبيه من معرض الكتب';
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'file_00000000e7547246845e0d0e99ee4c95.png',
        badge: 'file_00000000e7547246845e0d0e99ee4c95.png'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});




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

// معالجة المزامنة في الخلفية عند عودة الاتصال بالإنترنت

self.addEventListener('sync', event => {
    if (event.tag === 'sync-new-books') {
        event.waitUntil(syncOfflineBooks());
    }
});

async function syncOfflineBooks() {
    console.log('تم استرجاع الاتصال بالإنترنت: جاري مزامنة البيانات المخزنة أوفلاين...');
}