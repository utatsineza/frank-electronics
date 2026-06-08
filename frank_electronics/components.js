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
        <span style="font-size:12px;color:#ccc;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500">${displayName.split(' ')[0]}</span>
      </a>`
    : `<a href="${base}login" style="background:var(--orange);color:#fff;padding:8px 18px;font-size:13px;font-weight:700;border-radius:6px;text-decoration:none;white-space:nowrap">Sign in →</a>`;

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
      <li><a href="${base}"    class="${activePage==='home'?'active':''}">Home</a></li>

      <!-- SHOP BY CATEGORY DROPDOWN -->
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
          <a href="${base}products" style="display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:13px;color:#1a1a1a;text-decoration:none;transition:background .15s" onmouseover="this.style.background='#fff8f5'" onmouseout="this.style.background=''"><span style="font-size:16px">⚡</span> All products</a>
          <a href="${base}products?cat=phones"      style="display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:13px;color:#1a1a1a;text-decoration:none" onmouseover="this.style.background='#fff8f5'" onmouseout="this.style.background=''"><span style="font-size:16px">📱</span> Phones & Tablets</a>
          <a href="${base}products?cat=laptops"     style="display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:13px;color:#1a1a1a;text-decoration:none" onmouseover="this.style.background='#fff8f5'" onmouseout="this.style.background=''"><span style="font-size:16px">💻</span> Laptops</a>
          <a href="${base}products?cat=audio"       style="display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:13px;color:#1a1a1a;text-decoration:none" onmouseover="this.style.background='#fff8f5'" onmouseout="this.style.background=''"><span style="font-size:16px">🎧</span> Audio</a>
          <a href="${base}products?cat=tv"          style="display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:13px;color:#1a1a1a;text-decoration:none" onmouseover="this.style.background='#fff8f5'" onmouseout="this.style.background=''"><span style="font-size:16px">📺</span> TVs & Displays</a>
          <a href="${base}products?cat=accessories" style="display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:13px;color:#1a1a1a;text-decoration:none" onmouseover="this.style.background='#fff8f5'" onmouseout="this.style.background=''"><span style="font-size:16px">🔌</span> Accessories</a>
          <div style="height:1px;background:#f0f0f0;margin:6px 0"></div>
          <a href="${base}deals" style="display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:13px;color:var(--orange);font-weight:700;text-decoration:none" onmouseover="this.style.background='#fff8f5'" onmouseout="this.style.background=''"><span style="font-size:16px">🔥</span> Deals & Offers</a>
        </div>
      </li>

      <li><a href="${base}deals"   class="${activePage==='deals'?'active':''}">Deals</a></li>
      <li><a href="${base}about"   class="${activePage==='about'?'active':''}">About</a></li>
      <li><a href="${base}contact" class="${activePage==='contact'?'active':''}">Contact</a></li>
    </ul>

    <div class="nav-right">
      <!-- SEARCH BAR -->
      <div style="position:relative;display:flex;align-items:center">
        <input class="nav-search" id="searchInput" type="text"
          placeholder="Search electronics..."
          onkeydown="if(event.key==='Enter'&&this.value.trim())window.location.href='${base}products.html?q='+encodeURIComponent(this.value.trim())"
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
    </div>
  </nav>

  <script>
  function hideCatDropdown() {
    setTimeout(() => {
      const d = document.getElementById('catDropdown');
      if (d && !d.matches(':hover')) d.style.display = 'none';
    }, 100);
  }
  function doNavSearch() {
    const q = document.getElementById('searchInput')?.value.trim();
    if (q) window.location.href = '${base}products?q=' + encodeURIComponent(q);
  }
  <\/script>`;
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
        <li><a href="${base}ddeals">Deals & offers</a></li>
        <li><a href="${base}pproducts">All brands</a></li>
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
