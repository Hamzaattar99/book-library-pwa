const defaultBooks = [
    { id: 1, title: "مقدمة في هندسة البرمجيات", author: "م. محمد كمال", category: "تقنية", coverType: "cover-tech", rating: 5, borrowed: false },
    { id: 2, title: "أسرار تطوير المهارات الرقمية", author: "أ. منى التميمي", category: "تطوير الذات", coverType: "cover-green", rating: 4, borrowed: false },
    { id: 3, title: "رياح العاطفة والوجد", author: "عبدالرحمن البكري", category: "أدب وجداني", coverType: "cover-novel", rating: 4, borrowed: true },
    { id: 4, title: "تاريخ بشار في الإسلام", author: "د.بشار المنصوري", category: "تاريخ", coverType: "cover-classic", rating: 5, borrowed: false }
];

let selectedPresetStyle = 'cover-tech';

window.addEventListener('load', () => {
    if (!localStorage.getItem('my_books')) {
        localStorage.setItem('my_books', JSON.stringify(defaultBooks));
    }
    renderBooks();
    updatePreview();
    registerServiceWorker();
});

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log("ServerWorker Active"))
            .catch(err => console.log("SW Error: ", err));
    }
}

function renderBooks() {
    const books = JSON.parse(localStorage.getItem('my_books'));
    const container = document.getElementById('books-grid');
    container.innerHTML = '';

    books.forEach(book => {
                const card = document.createElement('div');
                card.className = "books-card bg-library-cardBg rounded-3xl p-5 shadow-lg border border-library-accent/10 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between";

                let coverStyleClass = "from-indigo-900 to-purple-800";
                if (book.coverType === 'cover-classic') coverStyleClass = "from-amber-800 to-amber-950";
                if (book.coverType === 'cover-novel') coverStyleClass = "from-rose-700 to-orange-800";
                if (book.coverType === 'cover-green') coverStyleClass = "from-emerald-800 to-teal-950";

                const stars = '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating);

                card.innerHTML = `
            <div>
                <div class="w-full h-40 rounded-2xl bg-gradient-to-br ${coverStyleClass} flex flex-col justify-between p-4 text-white shadow-md relative overflow-hidden">
                    <span class="text-[9px] font-bold px-2.5 py-0.5 rounded-full self-start bg-white/20">${book.category}</span>
                    <h4 class="text-sm font-black truncate">${book.title}</h4>
                    <span class="text-[10px] text-amber-200/90">${book.author}</span>
                </div>
                <div class="mt-4 text-center">
                    <h3 class="font-extrabold text-[#2E1A0F] truncate text-base">${book.title}</h3>
                    <p class="text-xs text-library-primary/70 mt-1">المؤلف: ${book.author}</p>
                    <span class="category inline-block mt-2 bg-library-light text-library-primary text-[9px] px-2.5 py-0.5 rounded-full font-bold">${book.category}</span>
                    <div class="text-amber-500 mt-2 text-xs">${stars}</div>
                </div>
            </div>
            <div class="mt-4">
                ${book.borrowed 
                    ? `<button disabled class="w-full bg-red-100 text-red-600 font-bold py-2 rounded-xl text-xs border border-red-200">مستعار حالياً</button>`
                    : `<button onclick="toggleBorrow(${book.id})" class="w-full bg-library-accent hover:bg-library-primary text-library-dark hover:text-white font-bold py-2 rounded-xl text-xs shadow-md transition-all">استعارة الكتاب</button>`
                }
            </div>
        `;
        container.appendChild(card);
    });
}

function toggleBorrow(id) {
    const books = JSON.parse(localStorage.getItem('my_books'));
    const target = books.find(b => b.id === id);
    if (target) {
        target.borrowed = true;
        localStorage.setItem('my_books', JSON.stringify(books));
        renderBooks();
    }
}

function switchView(view) {
    const valGallery = document.getElementById('view-gallery');
    const valAdd = document.getElementById('view-add');
    const navGallery = document.getElementById('nav-gallery');
    const navAdd = document.getElementById('nav-add');
    const searchContainer = document.getElementById('search-container');

    if (view === 'gallery') {
        valAdd.classList.add('hidden');
        valGallery.classList.remove('hidden');
        searchContainer.classList.remove('invisible');
        navGallery.className = "flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 bg-library-accent text-library-dark shadow-md";
        navAdd.className = "flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-amber-100 hover:text-white transition-all duration-300";
    } else {
        valGallery.classList.add('hidden');
        valAdd.classList.remove('hidden');
        searchContainer.classList.add('invisible');
        navAdd.className = "flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 bg-library-accent text-library-dark shadow-md";
        navGallery.className = "flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-amber-100 hover:text-white transition-all duration-300";
    }
}

function filterBooks() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const cards = document.getElementById('books-grid').children;
    let found = false;

    for (let card of cards) {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const author = card.querySelector('p').textContent.toLowerCase();
        if (title.includes(query) || author.includes(query)) {
            card.classList.remove('hidden');
            found = true;
        } else {
            card.classList.add('hidden');
        }
    }
    document.getElementById('no-results').classList.toggle('hidden', found || query === '');
}

function filterCategory(cat) {
    const buttons = document.querySelectorAll('.cat-btn');
    buttons.forEach(btn => {
        btn.className = btn.textContent === cat 
            ? "cat-btn px-4 py-1.5 rounded-full bg-library-primary text-white text-sm font-bold shadow-md transition-all" 
            : "cat-btn px-4 py-1.5 rounded-full bg-white text-library-primary border border-library-primary/20 hover:bg-library-light text-sm font-medium transition-all";
    });

    const cards = document.getElementById('books-grid').children;
    for (let card of cards) {
        const tag = card.querySelector('.category').textContent;
        card.classList.toggle('hidden', cat !== 'الكل' && tag !== cat);
    }
}

function selectPresetCover(type) {
    selectedPresetStyle = type;
    const buttons = document.querySelectorAll('.cover-opt');
    buttons.forEach(btn => btn.classList.replace('border-library-accent', 'border-transparent'));
    document.getElementById(`btn-${type}`).classList.replace('border-transparent', 'border-library-accent');
    updatePreview();
}

function updatePreview() {
    const title = document.getElementById('form-title').value || "عنوان الكتاب الافتراضي";
    const author = document.getElementById('form-author').value || "اسم الكاتب";
    const cat = document.getElementById('form-category').value;

    document.getElementById('preview-cover-title').textContent = title;
    document.getElementById('preview-info-title').textContent = title;
    document.getElementById('preview-cover-author').textContent = author;
    document.getElementById('preview-info-author').textContent = "المؤلف: " + author;
    document.getElementById('preview-tag').textContent = cat;
    document.getElementById('preview-info-tag').textContent = cat;

    const previewImg = document.getElementById('preview-img');
    previewImg.className = "w-full h-48 rounded-2xl flex flex-col justify-between p-4 text-white shadow-md relative overflow-hidden transition-all duration-300";
    
    if (selectedPresetStyle === 'cover-tech') previewImg.classList.add('bg-gradient-to-br', 'from-indigo-900', 'to-purple-800');
    if (selectedPresetStyle === 'cover-classic') previewImg.classList.add('bg-gradient-to-br', 'from-amber-800', 'to-amber-950');
    if (selectedPresetStyle === 'cover-novel') previewImg.classList.add('bg-gradient-to-br', 'from-rose-700', 'to-orange-800');
    if (selectedPresetStyle === 'cover-green') previewImg.classList.add('bg-gradient-to-br', 'from-emerald-800', 'to-teal-950');
}

function saveNewBook(e) {
    e.preventDefault();
    const title = document.getElementById('form-title').value;
    const author = document.getElementById('form-author').value;
    const cat = document.getElementById('form-category').value;

    const books = JSON.parse(localStorage.getItem('my_books'));
    books.unshift({
        id: Date.now(),
        title: title,
        author: author,
        category: cat,
        coverType: selectedPresetStyle,
        rating: 5,
        borrowed: false
    });
    
    localStorage.setItem('my_books', JSON.stringify(books));
    renderBooks();
    resetForm();
    switchView('gallery');
}

function resetForm() {
    document.getElementById('add-book-form').reset();
    selectPresetCover('cover-tech');
    updatePreview();
}

function togglePwaPanel() {
    document.getElementById('pwa-panel').classList.toggle('hidden');
    document.getElementById('pwa-arrow').classList.toggle('rotate-180');
}

function downloadFile(filename, text) {
    const el = document.createElement('a');
    el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    el.setAttribute('download', filename);
    el.style.display = 'none';
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
}

function getManifestContent() {
    return `{\n  "name": "معرض الكتب التقني PWA",\n  "short_name": "معرض الكتب",\n  "start_url": "index.html",\n  "display": "standalone",\n  "background_color": "#f5efe6",\n  "theme_color": "#2E1A0F"\n}`;
}

function getSwContent() {
    return `const CACHE_NAME = 'books-gallery-v2';\nconst ASSETS = ['index.html', 'style.css', 'script.js', 'manifest.json'];\n\nself.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))));\nself.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));`;
}