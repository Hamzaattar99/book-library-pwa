// 1. تسجيل الـ Service Worker لتشغيل التطبيق بدون إنترنت (Offline)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker تم تسجيله بنجاح!', reg))
            .catch(err => console.log('فشل تسجيل Service Worker:', err));
    });
}

// 2. كود زر الإضافة التجريبي (Demo - بدون قاعدة بيانات)
const addBtn = document.getElementById('add-btn');
const booksContainer = document.getElementById('books-container');

addBtn.addEventListener('click', () => {
    // إنشاء كارت كتاب جديد بشكل عشوائي وتجريبي
    const newCard = document.createElement('div');
    newCard.classList.add('book-card');
    
    newCard.innerHTML = `
        <div class="book-icon">📚</div>
        <h3>كتاب تجريبي جديد (Demo)</h3>
        <p>تمت إضافة هذا الكتاب برمجياً في الواجهة فقط بدون قاعدة بيانات.</p>
    `;
    
    booksContainer.appendChild(newCard);
});
