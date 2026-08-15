/* ==========================================
   BOOKVERSE SERVICE WORKER
========================================== */


/*
    اسم الـ Cache الخاص بالتطبيق.

    عندما تغير ملفات التطبيق وتريد إجبار
    المتصفح على إنشاء Cache جديد،
    غيّر رقم الإصدار:

    bookverse-v1
          ↓
    bookverse-v2
*/
const CACHE_NAME = "bookverse-v3";


/* ==========================================
   FILES TO CACHE
========================================== */


/*
    هذه قائمة الملفات التي نريد تخزينها
    داخل Cache حتى يستطيع التطبيق العمل
    حتى عند عدم وجود Internet.
*/
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
    "assets/icons/icon-512.png"

    // "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    // "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
    // "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css",

    // "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
];


/* ==========================================
   INSTALL
========================================== */


/*
    حدث install يحدث عندما يقوم المتصفح
    بتثبيت Service Worker.

    هنا نفتح الـ Cache ثم نضع داخله
    الملفات الموجودة في STATIC_ASSETS.
*/
self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(STATIC_ASSETS);

            })
            .catch(error => {

                console.error(
                    "Cache installation failed:",
                    error
                );

            })

    );

    self.skipWaiting();

});


/* ==========================================
   ACTIVATE
========================================== */


/*
    activate يحدث عندما يصبح Service Worker
    الجديد جاهزًا للعمل.
*/
self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

        .then(keys => {

            return Promise.all(

                keys.map(key => {

                    /*
                        إذا كان الـ Cache قديمًا
                        وليس هو CACHE_NAME الحالي،
                        نحذفه.
                    */
                    if (key !== CACHE_NAME) {

                        return caches.delete(key);

                    }

                })

            );

        })

    );


    /*
        يجعل Service Worker الحالي
        يتحكم بالصفحات المفتوحة مباشرة.
    */
    self.clients.claim();

});


/* ==========================================
   CACHE FIRST STRATEGY
========================================== */


/*
    fetch يحدث عندما يطلب الموقع ملفًا
    أو صفحة أو صورة أو CSS أو JavaScript...
*/
self.addEventListener("fetch", event => {

    event.respondWith(

        /*
            نبحث أولًا داخل Cache.
        */
        caches.match(event.request)

        .then(cacheResponse => {


            /*
                إذا وجدنا الملف داخل Cache،
                نرجعه مباشرة بدون طلب Internet.
            */
            if (cacheResponse) {

                return cacheResponse;

            }


            /*
                إذا لم يكن موجودًا في Cache،
                نحاول الحصول عليه من Internet.
            */
            return fetch(event.request)

            .then(networkResponse => {


                /*
                    إذا كانت الاستجابة غير صالحة
                    نرجعها كما هي بدون تخزينها.
                */
                if (
                    !networkResponse ||
                    networkResponse.status !== 200 ||
                    networkResponse.type !== "basic"
                ) {

                    return networkResponse;

                }


                /*
                    نعمل نسخة من Response.

                    السبب:
                    Response يمكن استهلاكه مرة واحدة،
                    لذلك نحتاج clone حتى نستطيع
                    إرجاع النسخة وتخزين نسخة أخرى.
                */
                const responseClone =
                    networkResponse.clone();


                /*
                    نفتح الـ Cache الحالي.
                */
                caches.open(CACHE_NAME)

                .then(cache => {


                    /*
                        نتأكد أن الاستجابة ناجحة
                        وأنها من نفس المصدر.
                    */
                    if (
                        responseClone &&
                        networkResponse.status === 200 &&
                        networkResponse.type === "basic"
                    ) {

                        /*
                            تخزين الملف في Cache.
                        */
                        cache.put(
                            event.request,
                            responseClone
                        );

                    }

                });


                /*
                    نرجع الاستجابة الأصلية
                    للصفحة.
                */
                return networkResponse;

            })

            .catch(() => {


                /*
                    إذا فشل Internet،
                    وكان الطلب لصفحة HTML،
                    نحاول إرجاع index.html
                    من Cache.
                */
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


/* ==========================================
   PUSH NOTIFICATION
========================================== */


/*
    هذا الحدث هو أهم جزء في Push Notification.

    عندما يرسل السيرفر Push إلى المستخدم،
    المتصفح يشغل هذا الحدث داخل Service Worker.

    لاحظ أننا لا نضع هذا داخل fetch.

    push حدث مستقل تمامًا عن fetch.
*/
self.addEventListener("push", event => {


    /*
        هذه البيانات التي أرسلها السيرفر
        مع الـ Push.

        مثال البيانات التي يمكن أن يرسلها
        السيرفر:

        {
            "title": "كتاب جديد 📚",
            "body": "تمت إضافة كتاب جديد إلى BookVerse",
            "url": "/book1.html"
        }
    */


    /*
        نضع بيانات افتراضية في حالة أن Push
        وصل بدون بيانات.
    */
    let data = {

        title: "BookVerse",

        body: "لديك إشعار جديد 📚",

        url: "/"

    };


    /*
        event.data تعني:
        هل وصلتنا بيانات مع الـ Push؟
    */
    if (event.data) {

        /*
            نحاول تحويل البيانات القادمة
            من JSON إلى JavaScript Object.
        */
        try {

            data = event.data.json();

        } catch (error) {

            /*
                إذا لم تكن البيانات JSON،
                نستخدم البيانات كنص.
            */
            data.body = event.data.text();

        }

    }


    /*
        showNotification()

        هذه الدالة تجعل المتصفح يعرض
        Notification حقيقي للمستخدم.
    */
    const notificationPromise =
        self.registration.showNotification(

            /*
                عنوان الإشعار.
            */
            data.title,

            {

                /*
                    نص الإشعار.
                */
                body: data.body,


                /*
                    أيقونة الإشعار.

                    نحن نستخدم أيقونة BookVerse
                    الموجودة عندك بالفعل.
                */
                icon: "/assets/icons/icon-192.png",


                /*
                    صورة صغيرة تظهر كـ Badge
                    في الأنظمة التي تدعمها.
                */
                badge: "/assets/icons/icon-72.png",


                /*
                    بيانات إضافية نريد الاحتفاظ بها
                    مع الإشعار.

                    هنا نخزن الرابط الذي نريد
                    فتحه عندما يضغط المستخدم
                    على Notification.
                */
                data: {

                    url: data.url || "/"

                }

            }

        );


    /*
        event.waitUntil()

        نقول للمتصفح:

        "لا تعتبر حدث Push منتهيًا
        حتى ينتهي عرض Notification."
    */
    event.waitUntil(
        notificationPromise
    );

});


/* ==========================================
   NOTIFICATION CLICK
========================================== */


/*
    هذا الحدث يحدث عندما يضغط المستخدم
    على Notification.
*/
self.addEventListener(
    "notificationclick",
    event => {


        /*
            نغلق Notification بعد الضغط عليه.
        */
        event.notification.close();


        /*
            نحصل على الرابط الذي خزناه
            داخل notification.data
        */
        const notificationUrl =
            event.notification.data &&
            event.notification.data.url
                ? event.notification.data.url
                : "/";


        /*
            event.waitUntil()

            نخبر المتصفح أن ينتظر
            حتى ننتهي من فتح/تركيز الصفحة.
        */
        event.waitUntil(

            /*
                نبحث عن الصفحات المفتوحة
                حاليًا والتي يتحكم بها
                Service Worker.
            */
            clients.matchAll({

                /*
                    نريد الصفحات الموجودة
                    داخل نفس الـ origin.
                */
                type: "window",

                /*
                    includeUncontrolled:
                    يسمح أيضًا بالبحث عن بعض
                    النوافذ التي لم تصبح تحت
                    تحكم Service Worker بعد.
                */
                includeUncontrolled: true

            })

            .then(clientList => {


                /*
                    نبحث هل BookVerse مفتوح
                    أصلًا في إحدى النوافذ.
                */
                for (const client of clientList) {


                    /*
                        إذا وجدنا نافذة يمكن التركيز عليها،
                        نحاول استخدامها بدل فتح نافذة جديدة.
                    */
                    if (
                        "focus" in client &&
                        client.url.includes(
                            self.location.origin
                        )
                    ) {

                        /*
                            نركز على النافذة.
                        */
                        return client.focus()

                        .then(() => {

                            /*
                                نحاول الانتقال إلى
                                الصفحة الموجودة في الإشعار.
                            */
                            if (
                                "navigate" in client
                            ) {

                                return client.navigate(
                                    notificationUrl
                                );

                            }

                        });

                    }

                }


                /*
                    إذا لم تكن BookVerse مفتوحة،
                    نفتح نافذة جديدة.
                */
                if (clients.openWindow) {

                    return clients.openWindow(
                        notificationUrl
                    );

                }

            })

        );

    }
);