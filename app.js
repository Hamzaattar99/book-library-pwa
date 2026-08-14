// ===================================================
// معرض الكتب - Book Gallery PWA Application Logic
// ===================================================

// ─── Initial Book Data ───────────────────────────
const INITIAL_BOOKS = [
  {
    id: 1,
    title: 'مئة عام من العزلة',
    author: 'غابرييل غارسيا ماركيز',
    description: 'رواية تحكي قصة عائلة بوينديا عبر سبعة أجيال في بلدة ماكوندو الخيالية.',
    category: 'رواية',
    year: 1967,
    pages: 448,
    rating: 4.9,
    emoji: '📖',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    title: 'الأمير الصغير',
    author: 'أنطوان دو سانت-إكزوبيري',
    description: 'قصة فلسفية شاعرية تحكي عن أمير صغير يزور كواكب مختلفة.',
    category: 'أدب',
    year: 1943,
    pages: 96,
    rating: 4.8,
    emoji: '⭐',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 3,
    title: '١٩٨٤',
    author: 'جورج أورويل',
    description: 'رواية ديستوبية تصور مجتمعاً تحت سيطرة حكومة شمولية مطلقة.',
    category: 'خيال علمي',
    year: 1949,
    pages: 328,
    rating: 4.7,
    emoji: '🔭',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 4,
    title: 'رحلة ابن بطوطة',
    author: 'ابن بطوطة',
    description: 'تحفة النظار في غرائب الأمصار وعجائب الأسفار، مذكرات رحلات المستكشف العظيم.',
    category: 'تاريخ',
    year: 1355,
    pages: 900,
    rating: 4.6,
    emoji: '🗺️',
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    id: 5,
    title: 'عزازيل',
    author: 'يوسف زيدان',
    description: 'رواية تاريخية تجري أحداثها في القرن الخامس الميلادي على مخطوطات راهب مصري.',
    category: 'رواية',
    year: 2008,
    pages: 400,
    rating: 4.5,
    emoji: '📜',
    color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
  },
  {
    id: 6,
    title: 'كيف تقرأ كتاباً',
    author: 'مورتيمر أدلر',
    description: 'دليل شامل لفن القراءة الفعالة والمثمرة وكيفية الاستفادة القصوى من الكتب.',
    category: 'تطوير ذات',
    year: 1940,
    pages: 426,
    rating: 4.4,
    emoji: '💡',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
];

// ─── Category Colors ──────────────────────────────
const CATEGORY_COLORS = {
  'رواية':       { bg: 'rgba(124, 58, 237, 0.25)', color: '#a78bfa' },
  'أدب':         { bg: 'rgba(236, 72, 153, 0.25)', color: '#f472b6' },
  'خيال علمي':  { bg: 'rgba(6, 182, 212, 0.25)',  color: '#22d3ee' },
  'تاريخ':       { bg: 'rgba(245, 158, 11, 0.25)', color: '#fbbf24' },
  'تطوير ذات':  { bg: 'rgba(34, 197, 94, 0.25)',  color: '#4ade80' },
  'فلسفة':       { bg: 'rgba(239, 68, 68, 0.25)',  color: '#f87171' },
  'علوم':        { bg: 'rgba(99, 102, 241, 0.25)', color: '#818cf8' },
  'أخرى':        { bg: 'rgba(156, 163, 175, 0.25)', color: '#9ca3af' }
};

// ─── Available Emojis ─────────────────────────────
const EMOJIS = ['📖', '📚', '📝', '✍️', '🔭', '🗺️', '📜', '💡', '🌍', '⭐', '🏰', '🔮', '🎭', '🧠', '🌙', '🦋'];

// ─── Gradient Colors ──────────────────────────────
const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #f77062 0%, #fe5196 100%)',
  'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
];

// ─── State ────────────────────────────────────────
let books = [];
let selectedEmoji = '📖';
let selectedGradient = GRADIENTS[0];
let currentFilter = 'الكل';
let nextId = 100;

// ─── DOM References ───────────────────────────────
const booksGrid    = document.getElementById('booksGrid');
const emptyState   = document.getElementById('emptyState');
const booksCountEl = document.getElementById('booksCount');
const modalOverlay = document.getElementById('modalOverlay');
const addForm      = document.getElementById('addBookForm');
const offlineBadge = document.getElementById('offlineBadge');
const filterTabs   = document.querySelectorAll('.filter-tab');

// ─── Init ─────────────────────────────────────────
function init() {
  loadBooks();
  renderBooks();
  setupEmojiPicker();
  setupEventListeners();
  registerServiceWorker();
  checkOfflineStatus();
  updateNotifyButtonUI();
  setupInstallPrompt();
}

// ─── LocalStorage ─────────────────────────────────
function loadBooks() {
  const stored = localStorage.getItem('bookGallery');
  books = stored ? JSON.parse(stored) : [...INITIAL_BOOKS];
  nextId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
}

function saveBooks() {
  localStorage.setItem('bookGallery', JSON.stringify(books));
}

// ─── Render ───────────────────────────────────────
function renderBooks() {
  const filtered = currentFilter === 'الكل'
    ? books
    : books.filter(b => b.category === currentFilter);

  booksCountEl.textContent = filtered.length;

  if (filtered.length === 0) {
    booksGrid.innerHTML = '';
    emptyState.classList.add('show');
    return;
  }

  emptyState.classList.remove('show');

  booksGrid.innerHTML = filtered.map((book, index) => createBookCard(book, index)).join('');

  // Animate cards
  booksGrid.querySelectorAll('.book-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 0.05}s`;
  });
}

function createBookCard(book, index) {
  const catStyle = CATEGORY_COLORS[book.category] || CATEGORY_COLORS['أخرى'];
  const stars = '★'.repeat(Math.floor(book.rating)) + (book.rating % 1 >= 0.5 ? '☆' : '');

  return `
    <article class="book-card" onclick="handleCardClick(event, ${book.id})" role="article" aria-label="${book.title}">
      <div class="book-cover">
        <div class="book-cover-bg" style="background: ${book.color}">
          ${book.emoji}
        </div>
        <div class="book-cover-overlay"></div>
        <div class="book-rating">⭐ ${book.rating}</div>
        <div class="book-category-badge" style="background: ${catStyle.bg}; color: ${catStyle.color}">
          ${book.category}
        </div>
        <button class="book-delete-btn" onclick="deleteBook(event, ${book.id})" aria-label="حذف ${book.title}" title="حذف الكتاب">
          🗑️
        </button>
      </div>
      <div class="book-info">
        <h2 class="book-title">${book.title}</h2>
        <p class="book-author">بقلم <span>${book.author}</span></p>
        <p class="book-description">${book.description}</p>
        <div class="book-footer">
          <span class="book-year">📅 ${book.year}</span>
          <span class="book-pages"><span>${book.pages}</span> صفحة</span>
        </div>
      </div>
    </article>
  `;
}

// ─── Filter Tabs ──────────────────────────────────
function setupFilterTabs() {
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderBooks();
    });
  });
}

// ─── Emoji Picker ─────────────────────────────────
function setupEmojiPicker() {
  const grid = document.getElementById('emojiGrid');
  grid.innerHTML = EMOJIS.map(e => `
    <button type="button" class="emoji-btn ${e === selectedEmoji ? 'selected' : ''}"
      onclick="selectEmoji('${e}')" aria-label="${e}">${e}</button>
  `).join('');
}

function selectEmoji(emoji) {
  selectedEmoji = emoji;
  document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.textContent === emoji);
  });
}

// ─── Gradient Picker ──────────────────────────────
function setupGradientPicker() {
  const container = document.getElementById('gradientPicker');
  if (!container) return;
  container.innerHTML = GRADIENTS.map((g, i) => `
    <div class="gradient-swatch ${i === 0 ? 'selected' : ''}"
      style="background: ${g}; width: 36px; height: 36px; border-radius: 8px; cursor: pointer; border: 2px solid transparent; transition: all 0.2s"
      onclick="selectGradient(this, '${g}')"
      title="لون ${i + 1}"></div>
  `).join('');
}

function selectGradient(el, gradient) {
  selectedGradient = gradient;
  document.querySelectorAll('#gradientPicker > div').forEach(d => {
    d.style.borderColor = 'transparent';
    d.style.transform = 'scale(1)';
  });
  el.style.borderColor = '#7c3aed';
  el.style.transform = 'scale(1.15)';
}

// ─── Card Click ───────────────────────────────────
function handleCardClick(event, id) {
  // Don't trigger on delete button click
  if (event.target.closest('.book-delete-btn')) return;
}

// ─── Delete Book ──────────────────────────────────
function deleteBook(event, id) {
  event.stopPropagation();
  const book = books.find(b => b.id === id);
  if (!book) return;

  if (confirm(`هل تريد حذف كتاب "${book.title}"؟`)) {
    books = books.filter(b => b.id !== id);
    saveBooks();
    renderBooks();
    showToast(`🗑️ تم حذف "${book.title}"`, 'error');
  }
}

// ─── Modal ────────────────────────────────────────
function openModal() {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('bookTitle').focus();
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  addForm.reset();
  selectedEmoji = '📖';
  selectedGradient = GRADIENTS[0];
  setupEmojiPicker();
  setupGradientPicker();
}

// ─── Add Book ─────────────────────────────────────
function handleAddBook(event) {
  event.preventDefault();

  const title  = document.getElementById('bookTitle').value.trim();
  const author = document.getElementById('bookAuthor').value.trim();
  const desc   = document.getElementById('bookDesc').value.trim();
  const cat    = document.getElementById('bookCategory').value;
  const year   = parseInt(document.getElementById('bookYear').value) || new Date().getFullYear();
  const pages  = parseInt(document.getElementById('bookPages').value) || 0;
  const rating = parseFloat(document.getElementById('bookRating').value) || 4.0;

  if (!title || !author) {
    showToast('⚠️ يرجى إدخال عنوان الكتاب واسم المؤلف', 'error');
    return;
  }

  const newBook = {
    id: nextId++,
    title,
    author,
    description: desc || 'لا يوجد وصف متاح لهذا الكتاب.',
    category: cat || 'أخرى',
    year,
    pages,
    rating: Math.min(5, Math.max(0, rating)),
    emoji: selectedEmoji,
    color: selectedGradient
  };

  books.unshift(newBook);
  saveBooks();
  closeModal();
  renderBooks();
  showToast(`✅ تمت إضافة "${title}" بنجاح!`, 'success');

  if (Notification.permission === 'granted') {
    sendLocalNotification('📖 كتاب جديد!', `تمت إضافة "${title}" إلى معرضك بنجاح.`);
  }
}

// ─── Toast ────────────────────────────────────────
let toastTimeout;
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ─── Notifications ─────────────────────────────────
const notifyBtn  = document.getElementById('notifyBtn');
const notifyIcon = document.getElementById('notifyIcon');

function updateNotifyButtonUI() {
  if (!('Notification' in window)) {
    notifyBtn.style.display = 'none';
    return;
  }
  const permission = Notification.permission;
  notifyBtn.classList.remove('enabled', 'denied');

  if (permission === 'granted') {
    notifyBtn.classList.add('enabled');
    notifyIcon.textContent = '🔔';
    notifyBtn.title = 'الإشعارات مفعّلة';
    notifyBtn.setAttribute('aria-label', 'الإشعارات مفعّلة');
  } else if (permission === 'denied') {
    notifyBtn.classList.add('denied');
    notifyIcon.textContent = '🔕';
    notifyBtn.title = 'تم حظر الإشعارات من إعدادات المتصفح';
    notifyBtn.setAttribute('aria-label', 'تم حظر الإشعارات');
  } else {
    notifyIcon.textContent = '🔕';
    notifyBtn.title = 'تفعيل الإشعارات';
    notifyBtn.setAttribute('aria-label', 'تفعيل الإشعارات');
  }
}

async function toggleNotifications() {
  if (!('Notification' in window)) {
    showToast('⚠️ متصفحك لا يدعم الإشعارات', 'error');
    return;
  }

  const current = Notification.permission;

  if (current === 'denied') {
    showToast('🔕 الإشعارات محظورة، يرجى تفعيلها من إعدادات المتصفح', 'error');
    return;
  }

  if (current === 'granted') {
    // Already enabled — send a friendly confirmation notification
    sendLocalNotification('📚 معرض الكتب', 'الإشعارات مفعّلة لديك بالفعل ✅');
    return;
  }

  // Not yet decided — request permission
  try {
    const result = await Notification.requestPermission();
    updateNotifyButtonUI();
    if (result === 'granted') {
      showToast('🔔 تم تفعيل الإشعارات بنجاح!', 'success');
      sendLocalNotification('📚 معرض الكتب', 'سنُعلمك عند إضافة كتب جديدة!');
    } else if (result === 'denied') {
      showToast('🔕 تم رفض تفعيل الإشعارات', 'error');
    }
  } catch (err) {
    console.error('[App] Notification permission error:', err);
    showToast('⚠️ حدث خطأ أثناء تفعيل الإشعارات', 'error');
  }
}

async function sendLocalNotification(title, body) {
  if (Notification.permission !== 'granted') return;

  const options = {
    body,
    icon: './icon-192.png',
    badge: './icon-192.png',
    dir: 'rtl',
    lang: 'ar'
  };

  // Prefer showing via the Service Worker registration (works even when
  // the tab is backgrounded, and is required for real push notifications).
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      reg.showNotification(title, options);
      return;
    } catch (err) {
      console.warn('[App] SW showNotification failed, falling back:', err);
    }
  }

  // Fallback: plain Notification API
  new Notification(title, options);
}

// ─── PWA Install ───────────────────────────────────
const installBtn = document.getElementById('installBtn');
let deferredInstallPrompt = null;

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true; // iOS Safari
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isAndroid() {
  return /android/i.test(window.navigator.userAgent);
}

function setupInstallPrompt() {
  if (isStandalone()) {
    // Already installed / already running as an app — hide the button
    installBtn.classList.add('hide');
    return;
  }

  // Chrome / Edge / Android: browser fires this when the app is installable.
  // We capture it so we can trigger the native prompt on click.
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
  });

  window.addEventListener('appinstalled', () => {
    installBtn.classList.add('hide');
    deferredInstallPrompt = null;
    showToast('📲 تم تثبيت التطبيق بنجاح!', 'success');
  });
}

async function installApp() {
  // Case 1: browser gave us the native install prompt — use it
  if (deferredInstallPrompt) {
    installBtn.disabled = true;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installBtn.disabled = false;

    if (outcome === 'accepted') {
      installBtn.classList.add('hide');
    }
    return;
  }

  // Case 2: iOS Safari never fires beforeinstallprompt
  if (isIOS()) {
    showToast('📲 اضغط على زر المشاركة ⬆️ ثم "إضافة إلى الشاشة الرئيسية"', 'success');
    return;
  }

  // Case 3: Android but Chrome hasn't offered the prompt yet
  if (isAndroid()) {
    showToast('📲 افتح قائمة المتصفح ⋮ واختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"', 'success');
    return;
  }

  // Case 4: Desktop browser (Chrome/Edge address-bar icon, or unsupported browser)
  showToast('📲 ابحث عن أيقونة التثبيت ⊕ في شريط العنوان، أو من قائمة المتصفح ⋮ اختر "تثبيت معرض الكتب"', 'success');
}

// ─── Offline Detection ────────────────────────────
function checkOfflineStatus() {
  const update = () => {
    if (!navigator.onLine) {
      offlineBadge.classList.add('show');
    } else {
      offlineBadge.classList.remove('show');
    }
  };
  update();
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
}

// ─── Service Worker Registration ──────────────────
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[App] Service Worker registered:', reg.scope);

          // Listen for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[App] New SW available');
              }
            });
          });
        })
        .catch((err) => {
          console.error('[App] SW registration failed:', err);
        });
    });
  }
}

// ─── Event Listeners ─────────────────────────────
function setupEventListeners() {
  // Close modal on overlay click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Keyboard: close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Form submit
  addForm.addEventListener('submit', handleAddBook);

  // Filter tabs
  setupFilterTabs();

  // Gradient picker
  setupGradientPicker();
}

// ─── Start App ────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
