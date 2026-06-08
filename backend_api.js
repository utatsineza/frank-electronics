// ═══════════════════════════════════════════════════
//  FRANK ELECTRONICS — backend_api.js
//  All API calls to Django backend
// ═══════════════════════════════════════════════════

const API_URL = 'https://frank-electronics-api.onrender.com';

// ── TOKEN HELPERS ──────────────────────────────────
function getToken() {
  return localStorage.getItem('fe_access_token');
}

function setTokens(access, refresh) {
  localStorage.setItem('fe_access_token', access);
  localStorage.setItem('fe_refresh_token', refresh);
}

function clearTokens() {
  localStorage.removeItem('fe_access_token');
  localStorage.removeItem('fe_refresh_token');
}

// ── API HELPER ─────────────────────────────────────
async function apiCall(endpoint, method = 'GET', data = null, auth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) headers['Authorization'] = `Bearer ${getToken()}`;

  const options = { method, headers };
  if (data) options.body = JSON.stringify(data);

  const response = await fetch(`${API_URL}${endpoint}`, options);
  const json = await response.json();

  if (!response.ok) throw json;
  return json;
}

// ── AUTH ───────────────────────────────────────────
const Auth = {
  async register(email, name, phone, password) {
    const data = await apiCall('/api/auth/register/', 'POST', { email, name, phone, password });
    setTokens(data.access, data.refresh);
    localStorage.setItem('fe_user', JSON.stringify(data.user));
    return data;
  },

  async login(email, password) {
    const data = await apiCall('/api/auth/login/', 'POST', { email, password });
    setTokens(data.access, data.refresh);
    localStorage.setItem('fe_user', JSON.stringify(data.user));
    return data;
  },

  async logout() {
    try {
      const refresh = localStorage.getItem('fe_refresh_token');
      await apiCall('/api/auth/logout/', 'POST', { refresh }, true);
    } catch(e) {}
    clearTokens();
    localStorage.removeItem('fe_user');
    window.location.href = '/login.html';
  },

  async getProfile() {
    return await apiCall('/api/auth/profile/', 'GET', null, true);
  },

  async updateProfile(data) {
    return await apiCall('/api/auth/profile/', 'PATCH', data, true);
  },

  isLoggedIn() {
    return !!getToken();
  }
};

// ── PRODUCTS ───────────────────────────────────────
const Products = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiCall(`/api/products/?${query}`);
  },

  async detail(id) {
    return await apiCall(`/api/products/${id}/`);
  },

  async categories() {
    return await apiCall('/api/products/categories/');
  }
};

// ── CART ───────────────────────────────────────────
const CartAPI = {
  async get() {
    return await apiCall('/api/orders/cart/', 'GET', null, true);
  },

  async addItem(product_id, quantity = 1) {
    return await apiCall('/api/orders/cart/items/', 'POST', { product_id, quantity }, true);
  },

  async updateItem(id, quantity) {
    return await apiCall(`/api/orders/cart/items/${id}/`, 'PATCH', { quantity }, true);
  },

  async removeItem(id) {
    return await apiCall(`/api/orders/cart/items/${id}/`, 'DELETE', null, true);
  },

  async clear() {
    return await apiCall('/api/orders/cart/', 'DELETE', null, true);
  }
};

// ── WISHLIST ───────────────────────────────────────
const WishlistAPI = {
  async get() {
    return await apiCall('/api/orders/wishlist/', 'GET', null, true);
  },

  async toggle(product_id) {
    return await apiCall('/api/orders/wishlist/', 'POST', { product_id }, true);
  }
};

// ── ORDERS ─────────────────────────────────────────
const OrdersAPI = {
  async list() {
    return await apiCall('/api/orders/orders/', 'GET', null, true);
  },

  async detail(id) {
    return await apiCall(`/api/orders/orders/${id}/`, 'GET', null, true);
  },

  async place(orderData) {
    return await apiCall('/api/orders/orders/place/', 'POST', orderData, true);
  }
};