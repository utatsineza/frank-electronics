// ═══════════════════════════════════════════════════
//  FRANK ELECTRONICS — app.js
//  Shared logic: products, cart, wishlist, auth
// ═══════════════════════════════════════════════════

// ── ADMIN EMAILS (any of these = admin access) ──
const ADMIN_EMAILS = [
  'admin@frankelectronics.rw',
  'frank@frankelectronics.rw',
  'manager@frankelectronics.rw',
];

function isAdmin(email) {
  return ADMIN_EMAILS.some(a => a.toLowerCase() === (email||'').toLowerCase());
}

// ── DEFAULT PRODUCTS (fallback if API fails) ──────
const DEFAULT_PRODUCTS = [
  {id:1,  name:"Samsung Galaxy S24 Ultra",   cat:"phones",      em:"📱", price:2200000, old:2500000,  badge:"sale", rating:4.8, rev:234, desc:"Flagship Android with 200MP camera, S-Pen, 5G."},
  {id:2,  name:"MacBook Air M3",             cat:"laptops",     em:"💻", price:3100000, old:null,     badge:"new",  rating:4.9, rev:89,  desc:"Apple M3 chip, all-day battery, ultra-thin design."},
  {id:3,  name:"AirPods Pro 2nd Gen",        cat:"audio",       em:"🎵", price:380000,  old:450000,   badge:"sale", rating:4.7, rev:412, desc:"ANC, Adaptive Audio, 30hrs battery with case."},
  {id:4,  name:'Samsung 65" QLED TV',        cat:"tv",          em:"📺", price:1850000, old:null,     badge:"hot",  rating:4.6, rev:67,  desc:"Quantum Dot, Smart TV, Netflix & YouTube."},
  {id:5,  name:'iPad Pro 12.9"',             cat:"phones",      em:"📲", price:1650000, old:1800000,  badge:"sale", rating:4.8, rev:155, desc:"M2 chip, Liquid Retina XDR display, Apple Pencil 2."},
  {id:6,  name:"Logitech MX Master 3",       cat:"accessories", em:"🖱️", price:145000,  old:null,     badge:"new",  rating:4.7, rev:320, desc:"Advanced wireless mouse, 70-day battery."},
  {id:7,  name:"Sony WH-1000XM5",            cat:"audio",       em:"🎧", price:420000,  old:520000,   badge:"sale", rating:4.9, rev:530, desc:"Industry-leading noise cancellation, 30hr battery."},
  {id:8,  name:"Dell XPS 15",                cat:"laptops",     em:"💻", price:2800000, old:3100000,  badge:"sale", rating:4.7, rev:112, desc:"OLED display, RTX 4060, Intel Core i7."},
  {id:9,  name:"iPhone 15 Pro",              cat:"phones",      em:"📱", price:1850000, old:null,     badge:"hot",  rating:4.9, rev:780, desc:"Titanium, A17 Pro chip, 48MP 5× optical zoom."},
  {id:10, name:'Xiaomi 65" Smart TV',        cat:"tv",          em:"📺", price:980000,  old:1200000,  badge:"sale", rating:4.5, rev:89,  desc:"4K UHD, Android TV, Dolby Vision & Atmos."},
  {id:11, name:"JBL Charge 5",               cat:"audio",       em:"🔊", price:195000,  old:240000,   badge:"sale", rating:4.6, rev:204, desc:"IP67 waterproof, 20hr playtime, power bank."},
  {id:12, name:"Samsung T7 SSD 1TB",         cat:"accessories", em:"💾", price:125000,  old:null,     badge:"new",  rating:4.8, rev:167, desc:"1050MB/s, USB-C, AES 256-bit encryption."},
];

// ── PRODUCTS — load from API, fallback to defaults ──
let PRODUCTS = DEFAULT_PRODUCTS;

async function loadProductsFromAPI() {
  try {
    const data = await Products.list();
    const items = data.results || data;
    if (items && items.length > 0) {
      PRODUCTS = items.map(p => ({
        id:     p.id,
        name:   p.name,
        cat:    p.category_name?.toLowerCase() || 'accessories',
        em:     p.emoji || '📦',
        price:  parseFloat(p.price),
        old:    p.old_price ? parseFloat(p.old_price) : null,
        badge:  p.badge || 'new',
        rating: parseFloat(p.rating) || 0,
        rev:    p.reviews || 0,
        desc:   p.description || '',
      }));
      localStorage.setItem('fe_products', JSON.stringify(PRODUCTS));
    } else {
      const stored = localStorage.getItem('fe_products');
      if (stored) PRODUCTS = JSON.parse(stored);
    }
  } catch(e) {
    const stored = localStorage.getItem('fe_products');
    if (stored) { try { PRODUCTS = JSON.parse(stored); } catch(e) {} }
  }
}

// ── CART ──────────────────────────────────────────
let cart  = JSON.parse(localStorage.getItem('fe_cart')  || '[]');
cart = cart.filter(i => i.id);
localStorage.setItem('fe_cart', JSON.stringify(cart));
let liked = new Set(JSON.parse(localStorage.getItem('fe_liked') || '[]'));

function saveCart()  { localStorage.setItem('fe_cart',  JSON.stringify(cart)); }
function saveLiked() { localStorage.setItem('fe_liked', JSON.stringify([...liked])); }

function fmt(p) { return 'RWF ' + p.toLocaleString(); }
function stars(r) { return '★'.repeat(Math.floor(r)) + '☆'.repeat(5 - Math.floor(r)); }

function addToCart(name, price, em, id) {
  const ex = cart.find(i => i.name === name);
  if (ex) ex.qty++; else cart.push({ id, name, price, em, qty: 1 });
  saveCart(); updateCartUI();
  showToast('✓ Added: ' + name.split(' ').slice(0, 3).join(' '));
}

function removeFromCart(idx) { cart.splice(idx, 1); saveCart(); updateCartUI(); }

function changeCartQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart(); updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const badge   = document.getElementById('cartBadge');
  const totalEl = document.getElementById('cartTotal');
  const subHead = document.getElementById('cartSubHead');
  const emptyEl = document.getElementById('cartEmpty');
  const body    = document.getElementById('cartBody');
  if (badge)   badge.textContent   = count;
  if (totalEl) totalEl.textContent = fmt(total);
  if (subHead) subHead.textContent = count + ' item' + (count !== 1 ? 's' : '');
  if (!body) return;
  body.querySelectorAll('.cart-item').forEach(e => e.remove());
  if (emptyEl) emptyEl.style.display = cart.length ? 'none' : 'block';
  cart.forEach((item, idx) => {
    const d = document.createElement('div');
    d.className = 'cart-item';
    d.innerHTML = `
      <div class="ci-em">${item.em}</div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">${fmt(item.price * item.qty)}</div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
        <button onclick="changeCartQty(${idx},-1)" style="width:26px;height:26px;border:1.5px solid #eee;border-radius:6px;background:#f5f5f5;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center">−</button>
        <span style="font-size:13px;font-weight:700;min-width:16px;text-align:center">${item.qty}</span>
        <button onclick="changeCartQty(${idx},1)" style="width:26px;height:26px;border:1.5px solid #eee;border-radius:6px;background:#f5f5f5;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center">+</button>
        <button onclick="removeFromCart(${idx})" style="width:26px;height:26px;border:none;background:none;cursor:pointer;font-size:14px;color:#ccc;margin-left:2px">✕</button>
      </div>`;
    body.appendChild(d);
  });
}

function openCart()  { document.getElementById('cartOverlay').classList.add('open'); }
function closeCart() { document.getElementById('cartOverlay').classList.remove('open'); }
function closeCartOutside(e) { if (e.target.id === 'cartOverlay') closeCart(); }

// ── WISHLIST ──────────────────────────────────────
function toggleLike(id, btn) {
  if (liked.has(id)) { liked.delete(id); btn.classList.remove('liked'); }
  else               { liked.add(id);    btn.classList.add('liked'); }
  saveLiked();
}

// ── TOAST ─────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── AUTH HELPERS ──────────────────────────────────
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('fe_user') || '{}');
}
function isLoggedIn() {
  return !!getCurrentUser().email;
}

// ── INIT ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  updateCartUI();
  await loadProductsFromAPI();

  const si = document.getElementById('searchInput');
  if (si) {
    si.addEventListener('keydown', e => {
      if (e.key === 'Enter' && si.value.trim()) {
        window.location.href = 'products.html?q=' + encodeURIComponent(si.value.trim());
      }
    });
  }

  if (typeof renderProducts === 'function') renderProducts();
  if (typeof applyFilters === 'function') applyFilters();

  window.dispatchEvent(new Event('productsLoaded'));
});