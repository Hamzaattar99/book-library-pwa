// ==========================================
// 1. قاعدة بيانات الكتب الحقيقية (المحتوى المخزن)
// ==========================================
const booksDatabase = {
    book1: {
        title: "مقدمة ابن خلدون",
        author: "ابن خلدون",
        content: `تعد "مقدمة ابن خلدون" موسوعة علمية وفلسفية أسست لعلم الاجتماع الحديث واستقراء التاريخ.

تناول ابن خلدون فيها طبيعة العمران البشري، وأثر البيئة والجغرافيا في الشعوب، وكيفية نشوء الدول وسقوطها عبر ما أسماه بـ "العصبية".

أبرز المفاهيم في الكتاب:
1. العصبية وأثرها في بناء الدولة والمُلك.
2. مراحل أطوار الدولة (النشأة، القوة، الترف، ثم الهرم والسقوط).
3. تأثير الاقتصاد والأسواق على استقرار المجتمعات.
4. أهمية التوثيق والتحقيق العلمي للأخبار التاريخية وعدم التسرع في تصديق الشائعات.`
    },
    book2: {
        title: "فن الحرب",
        author: "سون تزو",
        content: `كتاب "فن الحرب" هو أقدم أطروحة عسكرية معروفة في العالم، ألفها القائد الصيني "سون تزو".

تتعدى استراتيجيات الكتاب الشؤون العسكرية لتشمل إدارة الأزمات، والتخطيط الاستراتيجي، وحل المشكلات في الحياة اليومية والأعمال.

أهم القواعد والاستراتيجيات:
1. "Know yourself and know your enemy" - اعلم قدراتك وقدرات منافسك كي لا تُهزم في مئة معركة.
2. التفوق الحقيقي هو إخضاع العدو دون الحاجة إلى القتال.
3. المرونة والتكيف مع التغييرات والمستجدات مثل جريان الماء.
4. الخداع الاستراتيجي والتكتيك السرّي هما مفتاح النجاح في المنافسة.`
    },
    book3: {
        title: "رحلة العقل",
        author: "أحمد حامد",
        content: `يناقش كتاب "رحلة العقل" تطور التفكير البشري وكيف انتقل الإنسان من إدراك الطبيعة البدائية إلى عصر الذكاء الاصطناعي والخوارزميات.

يتطرق الكتاب إلى كيفية معالجة الدماغ للمعلومات واتخاذ القرارات تحت الضغوط، بالإضافة إلى أثر التقنية الحديثة على الذاكرة البشرية.

أبرز المحاور:
1. الوعي والتفكير النقدي في عصر الشاشات.
2. كيف تشكل التكنولوجيا والإشارات الرقمية عاداتنا اليومية.
3. معالجة البيانات والحدس البشري مقابل الذكاء الاصطناعي.`
    },
    book4: {
        title: "واحة الأدب",
        author: "فاطمة علي",
        content: `مجموعة من المقالات والقصص القصيرة التي تتناول مشاعر الإنسان، وأثر الكلمة الطيبة في بناء الروح والوجدان.

تأخذك الكاتبة في رحلة بين صور بلاغية ونصوص تتأمل في فلسفة الجمال، الصبر، والسعي نحو الأهداف بثبات.

اقتباس من الكتاب:
"الكلمات مثل البذور، منها ما ينبت زهرة تزين أيامك، ومنها ما ينبت شجرة يستظل بها كل من مرَّ بطريقك."`
    }
};

// ==========================================
// 2. تهيئة العناصر والتفاعلات (DOM Ready)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // تسجيل الـ Service Worker لتجهيز الـ PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Service Worker Registered Successfully'))
            .catch(err => console.error('Service Worker Registration Failed:', err));
    }

    // عناصر القارئ المنبثق (Modal)
    const modal = document.getElementById('bookReaderModal');
    const modalTitle = document.getElementById('modalBookTitle');
    const modalAuthor = document.getElementById('modalBookAuthor');
    const modalContent = document.getElementById('modalBookContent');
    const closeBtn = document.getElementById('closeReaderBtn');

    // فتح القارئ وقراءة الكتاب
    document.querySelectorAll('.read-book-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const bookKey = e.target.getAttribute('data-book');
            const selectedBook = booksDatabase[bookKey];

            if (selectedBook) {
                modalTitle.textContent = selectedBook.title;
                modalAuthor.textContent = `المؤلف: ${selectedBook.author}`;
                modalContent.textContent = selectedBook.content;
                modal.style.display = 'flex';
            }
        });
    });

    // إغلاق النافذة المنبثقة
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // ==========================================
    // 3. نظام البحث والفلترة السريع
    // ==========================================
    const searchInput = document.getElementById('searchInput');
    const categoryCards = document.querySelectorAll('.category-card');
    const bookCards = document.querySelectorAll('.book-card');

    // البحث بالاسم
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();

            bookCards.forEach(card => {
                const title = card.querySelector('h4').textContent.toLowerCase();
                const author = card.querySelector('.author').textContent.toLowerCase();

                if (title.includes(query) || author.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // الفلترة حسب الفئة
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            categoryCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const selectedCategory = card.getAttribute('data-category');

            bookCards.forEach(book => {
                const bookCategory = book.getAttribute('data-category');
                if (selectedCategory === 'all' || bookCategory === selectedCategory) {
                    book.style.display = 'flex';
                } else {
                    book.style.display = 'none';
                }
            });
        });
    });

    // ==========================================
    // 4. مراقبة حالة الإنترنت (Online / Offline)
    // ==========================================
    const statusBadge = document.getElementById('status-badge');

    function updateOnlineStatus() {
        if (navigator.onLine) {
            statusBadge.textContent = 'أنت متصل';
            statusBadge.className = 'badge online';
        } else {
            statusBadge.textContent = 'أوفلاين (شغال حريقة)';
            statusBadge.className = 'badge offline';
        }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
});