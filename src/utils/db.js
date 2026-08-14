// Centralized LocalStorage Database Manager for Çamdibi Matbaa

const INITIAL_USERS = [
  {
    name: 'Admin Yönetici',
    email: 'admin@camdibimatbaa.com',
    password: '123456',
    role: 'Yönetici',
    companyName: 'Çamdibi Matbaacılık A.Ş.',
    taxOffice: 'Bornova V.D.',
    taxNumber: '1122334455',
    phone: '0232 433 11 22',
    balance: 0,
    createdAt: '14 Ağustos 2026'
  },
  {
    name: 'Ege Kolatan',
    email: 'ege@camdibimatbaa.com',
    password: '123456',
    role: 'Müşteri',
    companyName: 'Kolatan Grafik Tasarım',
    taxOffice: 'Bornova V.D.',
    taxNumber: '4829102931',
    phone: '0532 999 88 77',
    balance: 0,
    createdAt: '14 Ağustos 2026'
  }
];

const INITIAL_ORDERS = [];

const INITIAL_PAYMENTS = [];

const INITIAL_MESSAGES = [
  {
    id: 'MSG-382910',
    name: 'Deniz Kaya',
    email: 'deniz@kayaholding.com',
    message: 'Merhabalar, 10.000 adet özel ebat (10x21 cm) 250gr mat kuşe broşür için fiyat teklifi rica edebilir miyim? Katlamasız olacak.',
    date: '12 Ağustos 2026',
    status: 'Açık'
  }
];

// Seed function to initialize all databases
export const initializeDB = () => {
  let users = [];
  const storedUsers = localStorage.getItem('camdibi_users');
  if (storedUsers) {
    try {
      users = JSON.parse(storedUsers);
    } catch (e) {
      users = [];
    }
  }

  // Enforce seeding if default admin account is not present in local storage
  const hasAdmin = users.some(u => u.email.toLowerCase() === 'admin@camdibimatbaa.com');
  if (!hasAdmin) {
    const merged = [...users];
    INITIAL_USERS.forEach(initUser => {
      if (!merged.some(u => u.email.toLowerCase() === initUser.email.toLowerCase())) {
        merged.push(initUser);
      }
    });
    localStorage.setItem('camdibi_users', JSON.stringify(merged));
  }

  // Force clear legacy mockup order cache once
  if (!localStorage.getItem('camdibi_db_cleaned_v3')) {
    localStorage.setItem('camdibi_orders', JSON.stringify([]));
    localStorage.setItem('camdibi_pay_history', JSON.stringify([]));
    localStorage.setItem('camdibi_db_cleaned_v3', 'true');
  }

  if (!localStorage.getItem('camdibi_orders')) {
    localStorage.setItem('camdibi_orders', JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem('camdibi_pay_history')) {
    localStorage.setItem('camdibi_pay_history', JSON.stringify(INITIAL_PAYMENTS));
  }
  if (!localStorage.getItem('camdibi_messages')) {
    localStorage.setItem('camdibi_messages', JSON.stringify(INITIAL_MESSAGES));
  }
};

// --- USER OPERATIONS ---
export const getUsers = () => {
  initializeDB();
  return JSON.parse(localStorage.getItem('camdibi_users') || '[]');
};

export const saveUser = (newUser) => {
  const users = getUsers();
  // Ensure we don't duplicate
  if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
    return false;
  }
  newUser.balance = newUser.balance || 0;
  newUser.createdAt = newUser.createdAt || new Date().toLocaleDateString('tr-TR');
  users.push(newUser);
  localStorage.setItem('camdibi_users', JSON.stringify(users));
  return true;
};

export const updateUserBalance = (email, amountPaid) => {
  const users = getUsers();
  const updated = users.map(u => {
    if (u.email.toLowerCase() === email.toLowerCase()) {
      const current = u.balance || 0;
      return { ...u, balance: Math.max(0, current - amountPaid) };
    }
    return u;
  });
  localStorage.setItem('camdibi_users', JSON.stringify(updated));
  
  // Also update active session if it matches the current user
  const session = localStorage.getItem('camdibi_session');
  if (session) {
    const active = JSON.parse(session);
    if (active.email.toLowerCase() === email.toLowerCase()) {
      active.balance = Math.max(0, (active.balance || 0) - amountPaid);
      localStorage.setItem('camdibi_session', JSON.stringify(active));
    }
  }
};

export const chargeUserBalance = (email, orderTotal) => {
  const users = getUsers();
  const updated = users.map(u => {
    if (u.email.toLowerCase() === email.toLowerCase()) {
      const current = u.balance || 0;
      return { ...u, balance: current + orderTotal };
    }
    return u;
  });
  localStorage.setItem('camdibi_users', JSON.stringify(updated));

  // Also update active session if it matches the current user
  const session = localStorage.getItem('camdibi_session');
  if (session) {
    const active = JSON.parse(session);
    if (active.email.toLowerCase() === email.toLowerCase()) {
      active.balance = (active.balance || 0) + orderTotal;
      localStorage.setItem('camdibi_session', JSON.stringify(active));
    }
  }
};

// --- ORDER OPERATIONS ---
export const getOrders = () => {
  initializeDB();
  return JSON.parse(localStorage.getItem('camdibi_orders') || '[]');
};

export const addOrder = (order) => {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem('camdibi_orders', JSON.stringify(orders));

  // Increase user balance (as accounts payable/outstanding invoice)
  chargeUserBalance(order.userEmail, order.total);
};

export const updateOrderStatus = (orderId, newStatus) => {
  const orders = getOrders();
  const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
  localStorage.setItem('camdibi_orders', JSON.stringify(updated));
};

// --- PAYMENT OPERATIONS ---
export const getPayments = () => {
  initializeDB();
  return JSON.parse(localStorage.getItem('camdibi_pay_history') || '[]');
};

export const addPayment = (payment) => {
  const payments = getPayments();
  payments.unshift(payment);
  localStorage.setItem('camdibi_pay_history', JSON.stringify(payments));

  // Deduct from outstanding balance
  updateUserBalance(payment.userEmail, payment.amount);
};

// --- SUPPORT TICKETS ---
export const getMessages = () => {
  initializeDB();
  return JSON.parse(localStorage.getItem('camdibi_messages') || '[]');
};

export const addMessage = (message) => {
  const messages = getMessages();
  message.id = 'MSG-' + Math.floor(100000 + Math.random() * 900000);
  message.date = message.date || new Date().toLocaleDateString('tr-TR');
  message.status = message.status || 'Açık';
  messages.unshift(message);
  localStorage.setItem('camdibi_messages', JSON.stringify(messages));
};
