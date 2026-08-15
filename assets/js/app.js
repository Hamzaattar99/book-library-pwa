/* =====================================================
   BOOKVERSE LIBRARY
   Main JavaScript File
   Author: Hamza Al-attar
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeTheme();
    initializeSearch();
    initializeCategoryFilter();
    initializeScrollTopButton();
    initializeScrollAnimations();
    initializeContactForm();
    initializeLazyLoading();
    registerServiceWorker();

    // تهيئة زر Push Notifications
    initializePushNotifications();

});

/* =====================================================
   THEME MANAGEMENT
===================================================== */

function initializeTheme() {

    const themeToggle = document.getElementById("themeToggle");

    const savedTheme =
        localStorage.getItem("bookverse-theme") || "light";

    document.documentElement.setAttribute(
        "data-theme",
        savedTheme
    );

    updateThemeIcon(savedTheme);

    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            const currentTheme =
                document.documentElement.getAttribute("data-theme");

            const newTheme =
                currentTheme === "light"
                    ? "dark"
                    : "light";

            document.documentElement.setAttribute(
                "data-theme",
                newTheme
            );

            localStorage.setItem(
                "bookverse-theme",
                newTheme
            );

            updateThemeIcon(newTheme);

        });

    }

}

function updateThemeIcon(theme) {

    const icon =
        document.querySelector("#themeToggle i");

    if (!icon) return;

    if (theme === "dark") {

        icon.classList.remove("bi-moon-stars");
        icon.classList.add("bi-sun");

    } else {

        icon.classList.remove("bi-sun");
        icon.classList.add("bi-moon-stars");

    }

}

/* =====================================================
   BOOK SEARCH
===================================================== */

function initializeSearch() {

    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) return;

    searchInput.addEventListener("keyup", () => {

        const value =
            searchInput.value.toLowerCase();

        const books =
            document.querySelectorAll(".book-item");

        books.forEach(book => {

            const title =
                book.querySelector(".book-title")
                .textContent
                .toLowerCase();

            const visible =
                title.includes(value);

            book.style.display =
                visible ? "block" : "none";

        });

    });

}

/* =====================================================
   CATEGORY FILTER
===================================================== */

function initializeCategoryFilter() {

    const filter =
        document.getElementById("categoryFilter");

    if (!filter) return;

    filter.addEventListener("change", () => {

        const selected =
            filter.value;

        const books =
            document.querySelectorAll(".book-item");

        books.forEach(book => {

            const category =
                book.dataset.category;

            if (
                selected === "all" ||
                category === selected
            ) {

                book.style.display = "block";

            } else {

                book.style.display = "none";

            }

        });

    });

}

/* =====================================================
   SCROLL TO TOP BUTTON
===================================================== */

function initializeScrollTopButton() {

    const button =
        document.getElementById("scrollTopBtn");

    if (!button) return;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {

            button.style.display = "flex";
            button.style.alignItems = "center";
            button.style.justifyContent = "center";

        } else {

            button.style.display = "none";

        }

    });

    button.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}

/* =====================================================
   SCROLL ANIMATIONS
===================================================== */

function initializeScrollAnimations() {

    const elements = document.querySelectorAll(
        ".book-card, .feature-box, .modern-card, .service-card, .skill-card"
    );

    elements.forEach(el => {
        el.classList.add("fade-up");
    });

    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("show");

                    }

                });

            },

            {
                threshold: 0.15
            }

        );

    elements.forEach(el => {
        observer.observe(el);
    });

}

/* =====================================================
   CONTACT FORM
===================================================== */

function initializeContactForm() {

    const form =
        document.getElementById("contactForm");

    if (!form) return;

    form.addEventListener("submit", e => {

        e.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const message =
            document.getElementById("message").value.trim();

        const alertBox =
            document.getElementById("formAlert");

        if (
            name === "" ||
            email === "" ||
            message === ""
        ) {

            alertBox.innerHTML = `
                <div class="alert alert-danger">
                    Please fill in all fields.
                </div>
            `;

            return;

        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            alertBox.innerHTML = `
                <div class="alert alert-warning">
                    Please enter a valid email address.
                </div>
            `;

            return;

        }

        alertBox.innerHTML = `
            <div class="alert alert-success">
                Message sent successfully!
                (Simulation Only)
            </div>
        `;

        form.reset();

    });

}

/* =====================================================
   LAZY IMAGE LOADING
===================================================== */

function initializeLazyLoading() {

    const images =
        document.querySelectorAll("img[loading='lazy']");

    if (!("IntersectionObserver" in window))
        return;

    const imageObserver =
        new IntersectionObserver((entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const img =
                        entry.target;

                    img.classList.add("loaded");

                    observer.unobserve(img);

                }

            });

        });

    images.forEach(img => {

        imageObserver.observe(img);

    });

}

/* =====================================================
   ACTIVE NAVIGATION LINK
===================================================== */

(function activeNavigation() {

    const currentPage =
        location.pathname.split("/").pop();

    const links =
        document.querySelectorAll(".nav-link");

    links.forEach(link => {

        const href =
            link.getAttribute("href");

        if (href === currentPage) {

            link.classList.add("active");

        }

    });

})();

/* =====================================================
   BOOK CARD HOVER ENHANCEMENT
===================================================== */

document.addEventListener("mouseover", e => {

    const card =
        e.target.closest(".book-card");

    if (!card) return;

    card.style.transition =
        "all .35s ease";

});

document.addEventListener("mouseout", e => {

    const card =
        e.target.closest(".book-card");

    if (!card) return;

    card.style.transition =
        "all .35s ease";

});

/* =====================================================
   PAGE LOADING EFFECT
===================================================== */

window.addEventListener("load", () => {

    const loader =
        document.querySelector(".loader");

    if (loader) {

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.remove();

        }, 500);

    }

});

/* =====================================================
   SMOOTH ANCHOR SCROLL
===================================================== */

document.querySelectorAll('a[href^="#"]')
.forEach(anchor => {

    anchor.addEventListener("click", function(e) {

        const target =
            document.querySelector(
                this.getAttribute("href")
            );

        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});

/* =====================================================
   DYNAMIC CURRENT YEAR
===================================================== */

(function updateFooterYear() {

    const yearElements =
        document.querySelectorAll(".current-year");

    const currentYear =
        new Date().getFullYear();

    yearElements.forEach(el => {

        el.textContent =
            currentYear;

    });

})();

/* =====================================================
   SERVICE WORKER REGISTRATION
===================================================== */

function registerServiceWorker() {

    if (!("serviceWorker" in navigator))
        return;

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./service-worker.js")

            .then(registration => {

                console.log(
                    "Service Worker Registered:",
                    registration.scope
                );

            })

            .catch(error => {

                console.error(
                    "Service Worker Registration Failed:",
                    error
                );

            });

    });

}

/* =====================================================
   KEYBOARD ACCESSIBILITY
===================================================== */

document.addEventListener("keydown", e => {

    if (
        e.key === "Escape"
    ) {

        const active =
            document.activeElement;

        if (active) {

            active.blur();

        }

    }

});

/* =====================================================
   PERFORMANCE LOG
===================================================== */

console.log(
    "BookVerse Library Initialized Successfully"
);


/* =====================================================
   PUSH NOTIFICATIONS
===================================================== */


/*
    VAPID Public Key

    هذا المفتاح سنحصل عليه لاحقًا
    من الـ Backend.

    حاليًا لا نضع مفتاحًا وهميًا،
    لأن Push Subscription لن يعمل بدونه.
*/
const VAPID_PUBLIC_KEY =
    "BJ7tveFdeRrMMOY7IEXxz2aIjgoCsSGAWdJFu93nwwd6ZT2ClQAaFJB5XBIgCbTOqjb_b0YW1mntMAO_49n3A50";


/* =====================================================
   INITIALIZE PUSH NOTIFICATIONS
===================================================== */

function initializePushNotifications() {

    /*
        نحصل على زر تفعيل الإشعارات
        الموجود في index.html.
    */
    const button =
        document.getElementById(
            "enableNotificationsBtn"
        );


    /*
        إذا لم يكن الزر موجودًا في الصفحة،
        نتوقف بدون أي خطأ.

        هذا مهم لأن app.js يستخدم
        في صفحات أخرى مثل about.html
        و contact.html.
    */
    if (!button) return;


    /*
        عندما يضغط المستخدم على الزر،
        نبدأ عملية تفعيل Push.
    */
    button.addEventListener(
        "click",
        enablePushNotifications
    );

}


/* =====================================================
   ENABLE PUSH NOTIFICATIONS
===================================================== */

async function enablePushNotifications() {

    console.log("=== PUSH BUTTON CLICKED ===");


    /*
        Check Notification API
    */

    if (!("Notification" in window)) {

        alert(
            "Your browser does not support notifications."
        );

        return;

    }


    /*
        Check Service Worker
    */

    if (!("serviceWorker" in navigator)) {

        alert(
            "Your browser does not support Service Workers."
        );

        return;

    }


    /*
        Check Push API
    */

    if (!("PushManager" in window)) {

        alert(
            "Your browser does not support Push Notifications."
        );

        return;

    }


    /*
        Start Push process
    */

    try {


        /* ==========================================
           SERVICE WORKER
        ========================================== */

        const registration =
            await navigator.serviceWorker.ready;


        console.log(
            "=== SERVICE WORKER READY ===",
            registration
        );


        /* ==========================================
           NOTIFICATION PERMISSION
        ========================================== */

        const permission =
            await Notification.requestPermission();


        console.log(
            "=== NOTIFICATION PERMISSION ===",
            permission
        );


        /*
            User did not allow notifications
        */

        if (permission !== "granted") {

            console.log(
                "Notification permission was not granted."
            );

            return;

        }


        /* ==========================================
           EXISTING SUBSCRIPTION
        ========================================== */

        let subscription =
            await registration.pushManager.getSubscription();


        console.log(
            "=== EXISTING SUBSCRIPTION ===",
            subscription
        );


        /* ==========================================
           CREATE NEW SUBSCRIPTION
        ========================================== */

        if (!subscription) {


            console.log(
                "=== CREATING NEW SUBSCRIPTION ==="
            );


            const applicationServerKey =
                urlBase64ToUint8Array(
                    VAPID_PUBLIC_KEY
                );


            subscription =
                await registration.pushManager.subscribe({

                    userVisibleOnly: true,

                    applicationServerKey:
                        applicationServerKey

                });


            console.log(
                "=== NEW SUBSCRIPTION CREATED ===",
                subscription
            );


        } else {


            console.log(
                "=== USING EXISTING SUBSCRIPTION ===",
                subscription
            );

        }


        /* ==========================================
           SEND SUBSCRIPTION TO BACKEND
        ========================================== */

        console.log(
            "=== SENDING SUBSCRIPTION TO BACKEND ==="
        );


        await sendSubscriptionToServer(
            subscription
        );


        /* ==========================================
           UPDATE BUTTON
        ========================================== */

        const button =
            document.getElementById(
                "enableNotificationsBtn"
            );


        if (button) {

            button.innerHTML = `
                <i class="bi bi-bell-fill"></i>
                Notifications Enabled
            `;

            button.disabled = true;

        }


        console.log(
            "=== PUSH NOTIFICATIONS ENABLED ==="
        );


    } catch (error) {


        console.error(
            "=== PUSH NOTIFICATION ERROR ===",
            error
        );


        alert(
            "Failed to enable push notifications. Check the browser console."
        );

    }

}


/* =====================================================
   SEND SUBSCRIPTION TO SERVER
===================================================== */

async function sendSubscriptionToServer(
    subscription
) {

    /*
        عنوان FastAPI Backend
        أثناء التطوير المحلي.
    */
    const API_BASE_URL =
        "http://127.0.0.1:8000";


    /*
        نرسل Push Subscription
        إلى FastAPI Backend.
    */
    try {

        console.log(
            "Sending Push Subscription to Backend..."
        );


        const response =
            await fetch(
                `${API_BASE_URL}/api/push/subscribe`,
                {

                    /*
                        POST لإرسال البيانات.
                    */
                    method: "POST",

                    /*
                        البيانات JSON.
                    */
                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    /*
                        تحويل PushSubscription
                        إلى JSON.
                    */
                    body:
                        JSON.stringify(
                            subscription
                        )

                }
            );


        /*
            قراءة Response من Backend.
        */
        const result =
            await response.json();


        /*
            إذا كان HTTP Status
            غير ناجح.
        */
        if (!response.ok) {

            throw new Error(
                result.detail ||
                `Server Error: ${response.status}`
            );

        }


        console.log(
            "Push Subscription sent successfully:",
            result
        );


        return result;


    } catch (error) {

        console.error(
            "Failed to send subscription:",
            error
        );

        /*
            نرمي الخطأ مرة أخرى
            حتى تعرف الدالة الرئيسية
            أن الإرسال فشل.
        */
        throw error;

    }

}


/* =====================================================
   VAPID KEY CONVERTER
===================================================== */


/*
    PushManager يحتاج VAPID Public Key
    بصيغة Uint8Array.

    المفتاح الذي سنضعه في app.js
    يكون Base64 URL.

    هذه الدالة تقوم بالتحويل.
*/
function urlBase64ToUint8Array(
    base64String
) {

    /*
        إضافة padding إذا كان ناقصًا.
    */
    const padding =
        "=".repeat(
            (4 - base64String.length % 4) % 4
        );


    /*
        تحويل Base64 URL
        إلى Base64 عادي.
    */
    const base64 =
        (
            base64String + padding
        )
        .replace(/-/g, "+")
        .replace(/_/g, "/");


    /*
        تحويل Base64
        إلى Binary String.
    */
    const rawData =
        window.atob(base64);


    /*
        إنشاء Uint8Array.
    */
    const outputArray =
        new Uint8Array(
            rawData.length
        );


    /*
        تحويل كل حرف إلى Byte.
    */
    for (
        let i = 0;
        i < rawData.length;
        ++i
    ) {

        outputArray[i] =
            rawData.charCodeAt(i);

    }


    /*
        إرجاع المفتاح
        بالصيغة المطلوبة.
    */
    return outputArray;

}