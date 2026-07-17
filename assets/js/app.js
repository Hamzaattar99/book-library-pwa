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