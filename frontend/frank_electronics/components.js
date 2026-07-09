// ═══════════════════════════════════════════════════
//  FRANK ELECTRONICS — components.js
// ═══════════════════════════════════════════════════

function getBasePath() {
  return window.location.pathname.includes('/pages/') ? '../' : './';
}

function injectNav(activePage) {
  const base = getBasePath();
  const user = JSON.parse(localStorage.getItem('fe_user') || '{}');
  const isLoggedIn = !!user.email;
  const displayName = user.name || user.email || '';
  const initial = displayName ? displayName[0].toUpperCase() : '?';

  const authSection = isLoggedIn
    ? `<a href="${base}profile" style="display:flex;align-items:center;gap:8px;text-decoration:none">
        <div style="width:34px;height:34px;border-radius:50%;background:var(--orange);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#fff;flex-shrink:0;border:2px solid rgba(255,255,255,.15)">${initial}</div>
        <span class="auth-name-label" style="font-size:12px;color:#ccc;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500">${displayName.split(' ')[0]}</span>
      </a>`
    : `<a href="${base}login" class="nav-signin-btn" style="background:var(--orange);color:#fff;padding:7px 12px;font-size:12px;font-weight:700;border-radius:6px;text-decoration:none;white-space:nowrap">Sign in →</a>`;

  document.getElementById('nav-placeholder').innerHTML = `
  <nav class="nav">
    <a class="nav-brand" href="${base}" style="text-decoration:none">
      <div class="logo-circle">
        <img src="${base}assets/logo.png" alt="Frank Electronics" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/>
        <span class="logo-fallback" style="display:none">FE</span>
      </div>
      <div>
        <div class="brand-name">Frank Electronics</div>
        <div class="brand-tag">Your plug for smart electronics</div>
      </div>
    </a>

    <ul class="nav-links">
      <li><a href="${base}" class="${activePage==='home'?'active':''}">Home</a></li>
      <li class="nav-dropdown" style="position:relative">
        <a href="${base}products" class="${activePage==='products'?'active':''}"
           style="display:flex;align-items:center;gap:4px"
           onmouseenter="document.getElementById('catDropdown').style.display='block'"
           onmouseleave="hideCatDropdown()">
          Shop ▾
        </a>
        <div id="catDropdown"
          style="display:none;position:absolute;top:100%;left:0;background:#fff;border:1.5px solid #eee;border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,.15);min-width:200px;z-index:50;padding:8px 0;margin-top:8px"
          onmouseenter="document.getElementById('catDropdown').style.display='block'"
          onmouseleave="hideCatDropdown()">
          <a href="${base}products" style="display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:13px;color:#1a1a1a;text-decoration:none" onmouseover="this.style.background='#fff8f5'" onmouseout="this.style.background=''"><span style="font-size:16px">⚡</span> All products</a>
          <a href="${base}products?cat=phones" style="display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:13px;color:#1a1a1a;text-decoration:none" onmouseover="this.style.background='#fff8f5'" onmouseout="this.style.background=''"><span style="font-size:16px">📱</span> Phones & Tablets</a>
          <a href="${base}products?cat=laptops" style="display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:13px;color:#1a1a1a;text-decoration:none" onmouseover="this.style.background='#fff8f5'" onmouseout="this.style.background=''"><span style="font-size:16px">💻</span> Laptops</a>
          <a href="${base}products?cat=audio" style="display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:13px;color:#1a1a1a;text-decoration:none" onmouseover="this.style.background='#fff8f5'" onmouseout="this.style.background=''"><span style="font-size:16px">🎧</span> Audio</a>
          <a href="${base}products?cat=tv" style="display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:13px;color:#1a1a1a;text-decoration:none" onmouseover="this.style.background='#fff8f5'" onmouseout="this.style.background=''"><span style="font-size:16px">📺</span> TVs & Displays</a>
          <a href="${base}products?cat=accessories" style="display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:13px;color:#1a1a1a;text-decoration:none" onmouseover="this.style.background='#fff8f5'" onmouseout="this.style.background=''"><span style="font-size:16px">🔌</span> Accessories</a>
          <div style="height:1px;background:#f0f0f0;margin:6px 0"></div>
          <a href="${base}deals" style="display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:13px;color:var(--orange);font-weight:700;text-decoration:none" onmouseover="this.style.background='#fff8f5'" onmouseout="this.style.background=''"><span style="font-size:16px">🔥</span> Deals & Offers</a>
        </div>
      </li>
      <li><a href="${base}deals" class="${activePage==='deals'?'active':''}">Deals</a></li>
      <li><a href="${base}about" class="${activePage==='about'?'active':''}">About</a></li>
      <li><a href="${base}contact" class="${activePage==='contact'?'active':''}">Contact</a></li>
    </ul>

    <div class="nav-right">
      <div class="desktop-search" style="position:relative;display:flex;align-items:center">
        <input class="nav-search" id="searchInput" type="text"
          placeholder="Search electronics..."
          onkeydown="if(event.key==='Enter'&&this.value.trim())window.location.href='${base}products?q='+encodeURIComponent(this.value.trim())"
          style="padding-right:36px"/>
        <button onclick="doNavSearch()" title="Search"
          style="position:absolute;right:10px;background:none;border:none;cursor:pointer;color:#aaa;font-size:16px;line-height:1;padding:0;transition:color .2s"
          onmouseover="this.style.color='var(--orange)'" onmouseout="this.style.color='#aaa'">🔍</button>
      </div>
      <button class="nav-icon" title="Wishlist" onclick="window.location.href='${base}wishlist'">♡</button>
      <button class="nav-icon cart-btn" onclick="openCart()" title="Cart">
        🛒 <span class="nav-badge" id="cartBadge">0</span>
      </button>
      ${authSection}
      <button class="nav-search-icon" onclick="toggleMobileSearch()" id="searchIconBtn" title="Search">🔍</button>
      <button class="nav-hamburger" onclick="toggleMobileMenu()" id="hamburgerBtn">☰</button>
    </div>
  </nav>

  <div class="mobile-search-overlay" id="mobileSearchOverlay">
    <input type="text" id="mobileSearchInput" placeholder="Search electronics..."
      onkeydown="if(event.key==='Enter'&&this.value.trim()){window.location.href='${base}products?q='+encodeURIComponent(this.value.trim())}else if(event.key==='Escape'){toggleMobileSearch()}"/>
  </div>

  <div class="mobile-menu" id="mobileMenu">
    <a href="${base}" class="${activePage==='home'?'active':''}">🏠 Home</a>
    <a href="${base}products" class="${activePage==='products'?'active':''}">📱 Shop</a>
    <a href="${base}deals" class="${activePage==='deals'?'active':''}">🔥 Deals</a>
    <a href="${base}about" class="${activePage==='about'?'active':''}">ℹ️ About</a>
    <a href="${base}contact" class="${activePage==='contact'?'active':''}">📞 Contact</a>
    <div style="height:1px;background:#2a2a2a;margin:4px 0"></div>
    ${isLoggedIn
      ? `<a href="${base}profile">👤 My Profile</a>
         <a href="${base}orders">📦 My Orders</a>`
      : `<a href="${base}login" style="color:var(--orange);font-weight:700">Sign in →</a>
         <a href="${base}register">Create account</a>`
    }
  </div>`;
}

function injectCart() {
  const base = getBasePath();
  document.getElementById('cart-placeholder').innerHTML = `
  <div class="cart-overlay" id="cartOverlay" onclick="closeCartOutside(event)">
    <div class="cart-drawer">
      <div class="cart-head">
        <div>
          <div class="cart-head-title">Your Cart</div>
          <div class="cart-head-sub" id="cartSubHead">0 items</div>
        </div>
        <button class="cart-close" onclick="closeCart()">✕</button>
      </div>
      <div class="cart-body" id="cartBody">
        <div class="cart-empty" id="cartEmpty">
          <div style="font-size:48px;opacity:.3;margin-bottom:12px">🛒</div>
          Your cart is empty.<br/>Start adding items!
        </div>
      </div>
      <div class="cart-foot">
        <div class="cart-total-row">
          <span class="cart-total-lbl">Total</span>
          <span class="cart-total-val" id="cartTotal">RWF 0</span>
        </div>
        <a href="${base}checkout" class="btn btn-orange btn-block">Proceed to checkout →</a>
      </div>
    </div>
  </div>
  <div class="toast" id="toast"></div>`;
}

function injectFooter() {
  const base = getBasePath();
  document.getElementById('footer-placeholder').innerHTML = `
  <footer class="footer">
    <div class="footer-brand">
      <div class="ft-logo-row">
        <div class="ft-logo-circle">
          <img src="${base}assets/logo.png" alt="logo" onerror="this.style.display='none'"/>
        </div>
        <div>
          <div class="ft-brand-name">Frank Electronics</div>
          <div class="ft-brand-tag">Your plug for smart electronics</div>
        </div>
      </div>
      <p class="ft-desc">Rwanda's trusted source for premium electronics. Authorised reseller of Apple, Samsung, Sony & more. Kigali-based, delivering nationwide.</p>
      <div class="ft-social">
        <button class="ft-social-btn" title="Facebook">f</button>
        <button class="ft-social-btn" title="Instagram">in</button>
        <button class="ft-social-btn" title="WhatsApp">W</button>
        <button class="ft-social-btn" title="Twitter">X</button>
      </div>
    </div>
    <div class="footer-col">
      <div class="ft-col-title">Shop</div>
      <ul>
        <li><a href="${base}products">New arrivals</a></li>
        <li><a href="${base}products">Best sellers</a></li>
        <li><a href="${base}deals">Deals & offers</a></li>
        <li><a href="${base}products">All brands</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <div class="ft-col-title">Support</div>
      <ul>
        <li><a href="${base}contact">Track order</a></li>
        <li><a href="${base}contact">Returns</a></li>
        <li><a href="${base}contact">Warranty</a></li>
        <li><a href="${base}contact">Contact us</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <div class="ft-col-title">Company</div>
      <ul>
        <li><a href="${base}about">About Frank</a></li>
        <li><a href="${base}about">Store location</a></li>
        <li><a href="${base}contact">Privacy policy</a></li>
        <li><a href="${base}contact">Terms of service</a></li>
      </ul>
    </div>
  </footer>
  <div class="footer-bottom">
    <span>© 2026 Frank Electronics. All rights reserved.</span>
    <span>💳 MTN MoMo · Visa · Mastercard · Cash on delivery</span>
  </div>`;
}

// ── GLOBAL NAV FUNCTIONS ──
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('hamburgerBtn');
  if (!menu || !btn) return;
  const isOpen = menu.classList.toggle('open');
  btn.textContent = isOpen ? '✕' : '☰';
  // close search if open
  if (isOpen) {
    document.getElementById('mobileSearchOverlay')?.classList.remove('open');
    const sBtn = document.getElementById('searchIconBtn');
    if (sBtn) sBtn.textContent = '🔍';
  }
}

function toggleMobileSearch() {
  const overlay = document.getElementById('mobileSearchOverlay');
  const btn     = document.getElementById('searchIconBtn');
  if (!overlay) return;
  const isOpen = overlay.classList.toggle('open');
  if (isOpen) {
    document.getElementById('mobileSearchInput')?.focus();
    if (btn) btn.textContent = '✕';
    // close hamburger menu if open
    document.getElementById('mobileMenu')?.classList.remove('open');
    const hBtn = document.getElementById('hamburgerBtn');
    if (hBtn) hBtn.textContent = '☰';
  } else {
    if (btn) btn.textContent = '🔍';
  }
}

function hideCatDropdown() {
  setTimeout(() => {
    const d = document.getElementById('catDropdown');
    if (d && !d.matches(':hover')) d.style.display = 'none';
  }, 100);
}

function doNavSearch() {
  const q = document.getElementById('searchInput')?.value.trim();
  if (q) window.location.href = './products?q=' + encodeURIComponent(q);
}

document.addEventListener('click', function(e) {
  // Close mobile menu
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('hamburgerBtn');
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.remove('open');
    btn.textContent = '☰';
  }
  // Close mobile search
  const overlay = document.getElementById('mobileSearchOverlay');
  const sBtn    = document.getElementById('searchIconBtn');
  if (overlay && sBtn && !overlay.contains(e.target) && !sBtn.contains(e.target)) {
    overlay.classList.remove('open');
    sBtn.textContent = '🔍';
  }
});