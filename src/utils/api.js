/**
 * Çamdibi Matbaacılık — API İstemcisi
 * localStorage yerine FastAPI backend ile iletişim kurar.
 */

const API_BASE = "http://localhost:8000";

// ─── Token Yönetimi ──────────────────────────────────────────────────────────

export const getToken = () => localStorage.getItem("camdibi_jwt");
export const setToken = (token) => localStorage.setItem("camdibi_jwt", token);
export const clearToken = () => localStorage.removeItem("camdibi_jwt");

// ─── Temel Fetch Yardımcısı ───────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.detail || `HTTP ${res.status}`);
  }
  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authAPI = {
  register: (payload) =>
    apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(payload) }),

  login: (email, password) =>
    apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => apiFetch("/api/auth/me"),
  sendMessage: (payload) =>
    apiFetch("/api/auth/message", { method: "POST", body: JSON.stringify(payload) }),
};

const parseOrderSpecs = (order) => {
  if (order && typeof order.specs === 'string') {
    try {
      order.specs = JSON.parse(order.specs);
    } catch (e) {
      order.specs = {};
    }
  } else if (order && !order.specs) {
    order.specs = {};
  }
  return order;
};

// ─── Siparişler ───────────────────────────────────────────────────────────────

export const ordersAPI = {
  create: (data) =>
    apiFetch("/api/orders", { method: "POST", body: JSON.stringify(data) }).then(parseOrderSpecs),

  list: () => apiFetch("/api/orders").then(list => (list || []).map(parseOrderSpecs)),

  get: (id) => apiFetch(`/api/orders/${id}`).then(parseOrderSpecs),

  uploadFile: async (orderId, file) => {
    const token = getToken();
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_BASE}/api/orders/${orderId}/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || "Dosya yükleme başarısız.");
    return data;
  },
};

// ─── Ödemeler ─────────────────────────────────────────────────────────────────

export const paymentsAPI = {
  /** Kart bilgileriyle ödeme başlatır, PayTR token döner */
  initCardPayment: (data) =>
    apiFetch("/api/payments/init", { method: "POST", body: JSON.stringify(data) }),

  /** Cari borç ödemesi (EFT / Havale) */
  payCari: (amount) =>
    apiFetch(`/api/payments/cari?amount=${amount}`, { method: "POST" }),

  /** Ödeme geçmişi */
  history: () => apiFetch("/api/payments/history"),
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminAPI = {
  getOrders: () => apiFetch("/api/admin/orders").then(list => (list || []).map(parseOrderSpecs)),
  updateOrderStatus: (id, status) =>
    apiFetch(`/api/admin/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  getUsers: () => apiFetch("/api/admin/users"),
  toggleUser: (id) => apiFetch(`/api/admin/users/${id}/toggle`, { method: "PUT" }),
  adjustBalance: (id, amount) =>
    apiFetch(`/api/admin/users/${id}/balance?amount=${amount}`, { method: "PUT" }),

  getPayments: () => apiFetch("/api/admin/payments"),
  getMessages: () => apiFetch("/api/admin/messages"),
  updateMessageStatus: (id, status) =>
    apiFetch(`/api/admin/messages/${id}/status?status=${encodeURIComponent(status)}`, {
      method: "PUT",
    }),

  getStats: () => apiFetch("/api/admin/stats"),
};
