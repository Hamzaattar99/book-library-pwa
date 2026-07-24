// ===== بيانات مبدئية (بدون قاعدة بيانات، مجرد مصفوفة) =====
const defaultBooks = [
  { title: "الأسود يليق بك", author: "أحلام مستغانمي", cover: "" },
  { title: "مئة عام من العزلة", author: "غابرييل غارثيا ماركيز", cover: "" },
  { title: "الخيميائي", author: "باولو كويلو", cover: "" },
];

const placeholderCover =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='260'>
       <rect width='100%' height='100%' fill='#ddd'/>
       <text x='50%' y='50%' font-size='18' text-anchor='middle' fill='#888'>📖</text>
     </svg>`
  );

// ===== التعامل مع التخزين المحلي (localStorage) بدلاً من قاعدة بيانات =====
function loadBooks() {
  const saved = localStorage.getItem("books");
  return saved ? JSON.parse(saved) : defaultBooks;
}

function saveBooks(books) {
  localStorage.setItem("books", JSON.stringify(books));
}

let books = loadBooks();

// ===== عناصر الصفحة =====
const grid = document.getElementById("booksGrid");
const addBtn = document.getElementById("addBtn");
const overlay = document.getElementById("formOverlay");
const form = document.getElementById("bookForm");
const cancelBtn = document.getElementById("cancelBtn");

// ===== رسم الكتب على الصفحة =====
function renderBooks() {
  grid.innerHTML = "";
  books.forEach((book, index) => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <img src="${book.cover || placeholderCover}" alt="${book.title}">
      <div class="info">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <button class="delBtn" data-index="${index}">حذف</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// حذف كتاب
grid.addEventListener("click", (e) => {
  if (e.target.classList.contains("delBtn")) {
    const i = e.target.dataset.index;
    books.splice(i, 1);
    saveBooks(books);
    renderBooks();
  }
});

// ===== فتح/إغلاق نموذج الإضافة =====
addBtn.addEventListener("click", () => overlay.classList.remove("hidden"));
cancelBtn.addEventListener("click", () => {
  form.reset();
  overlay.classList.add("hidden");
});

// ===== إضافة كتاب جديد =====
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("titleInput").value.trim();
  const author = document.getElementById("authorInput").value.trim();
  const cover = document.getElementById("coverInput").value.trim();

  if (!title || !author) return;

  books.push({ title, author, cover });
  saveBooks(books);
  renderBooks();

  form.reset();
  overlay.classList.add("hidden");
});

// أول رسم عند فتح الصفحة
renderBooks();

// ===== تسجيل الـ Service Worker لتفعيل العمل بدون إنترنت =====
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then(() => console.log("Service Worker مسجل بنجاح "))
      .catch((err) => console.log("فشل تسجيل Service Worker ", err));
  });
}
