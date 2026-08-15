import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ListOrdered, 
  Palette, 
  HelpCircle, 
  Sun, 
  Moon, 
  Bell, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle,
  FileCheck,
  Send,
  ShieldAlert,
  LogOut,
  Printer,
  CreditCard
} from 'lucide-react';
import DashboardHome from './components/DashboardHome';
import OrderCalculator from './components/OrderCalculator';
import OrderList from './components/OrderList';
import AdminPanel from './components/AdminPanel';
import AuthGate from './components/AuthGate';
import DirectPay from './components/DirectPay';
import PriceList from './components/PriceList';
import { 
  authAPI, 
  ordersAPI, 
  adminAPI, 
  paymentsAPI, 
  getToken, 
  clearToken 
} from './utils/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [prefilledSpecs, setPrefilledSpecs] = useState(null);

  // Initialize data on mount
  useEffect(() => {
    // 1. Theme
    const storedTheme = localStorage.getItem('camdibi_theme') || 'light';
    setTheme(storedTheme);
    document.documentElement.setAttribute('data-theme', storedTheme);

    // 2. Active Session via JWT Token validation
    const token = getToken();
    if (token) {
      authAPI.me()
        .then(user => {
          setCurrentUser(user);
          setCurrentBalance(user.balance || 0);
          
          // Load orders
          if (user.role === 'Yönetici') {
            adminAPI.getOrders().then(setOrders).catch(console.error);
            adminAPI.getUsers().then(setUsers).catch(console.error);
          } else {
            ordersAPI.list().then(setOrders).catch(console.error);
          }
        })
        .catch(() => {
          clearToken();
          setCurrentUser(null);
        });
    }
  }, []);

  const updateBalance = async (amountPaid) => {
    if (currentUser) {
      try {
        const result = await paymentsAPI.payCari(amountPaid);
        setCurrentBalance(result.new_balance);
        const updatedUser = await authAPI.me();
        setCurrentUser(updatedUser);
      } catch (err) {
        alert('Cari ödeme başarısız: ' + err.message);
      }
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentBalance(user.balance || 0);
    
    // If admin logs in, default to admin panel tab
    if (user.role === 'Yönetici') {
      setActiveTab('admin-panel');
      adminAPI.getOrders().then(setOrders).catch(console.error);
      adminAPI.getUsers().then(setUsers).catch(console.error);
    } else {
      setActiveTab('dashboard');
      ordersAPI.list().then(setOrders).catch(console.error);
    }
  };

  const handleLogout = () => {
    clearToken();
    setCurrentUser(null);
    setCurrentBalance(0);
    setOrders([]);
    setUsers([]);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('camdibi_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const addOrder = async (newOrder) => {
    try {
      const orderPayload = {
        product_name: newOrder.productName,
        qty: parseInt(newOrder.qty),
        specs: newOrder.specs || {},
        total: parseFloat(newOrder.total),
        shipping_name: newOrder.shipping_name || currentUser.name,
        shipping_address: newOrder.shipping_address || 'Belirtilmedi',
        shipping_city: newOrder.shipping_city || 'İzmir',
        payment_method: newOrder.payment_method || 'card'
      };
      
      await ordersAPI.create(orderPayload);

      // Re-fetch orders and profile info (to update balance)
      const updatedOrders = await ordersAPI.list();
      setOrders(updatedOrders);
      
      const updatedUser = await authAPI.me();
      setCurrentUser(updatedUser);
      setCurrentBalance(updatedUser.balance || 0);
    } catch (err) {
      alert('Sipariş eklenirken hata oluştu: ' + err.message);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      const updatedOrders = await adminAPI.getOrders();
      setOrders(updatedOrders);
    } catch (err) {
      alert('Durum güncellenirken hata oluştu: ' + err.message);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormSent(true);

    try {
      await authAPI.sendMessage({
        name: contactForm.name,
        email: contactForm.email,
        message: contactForm.message
      });
      setContactForm({ name: '', email: '', message: '' });
      alert('Talebiniz başarıyla alınmıştır. En kısa sürede geri dönüş yapacağız.');
    } catch (err) {
      alert('Mesaj gönderilemedi: ' + err.message);
    } finally {
      setFormSent(false);
    }
  };

  // If not logged in, show login gate
  if (!currentUser) {
    return <AuthGate onLoginSuccess={handleLoginSuccess} />;
  }

  // Filter orders: Admins see all orders, customers see only their own orders
  const visibleOrders = currentUser.role === 'Yönetici' 
    ? orders 
    : orders.filter(o => {
        const email = o.user_email || o.userEmail || '';
        return email.toLowerCase() === currentUser.email.toLowerCase();
      });

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardHome 
            orders={visibleOrders} 
            setActiveTab={setActiveTab} 
            setSelectedOrder={setSelectedOrder} 
            currentUser={currentUser}
            currentBalance={currentBalance}
          />
        );
      case 'new-order':
        return (
          <OrderCalculator 
            addOrder={addOrder} 
            setActiveTab={setActiveTab} 
            prefilledSpecs={prefilledSpecs}
            setPrefilledSpecs={setPrefilledSpecs}
          />
        );
      case 'price-list':
        return (
          <PriceList 
            setActiveTab={setActiveTab} 
            setPrefilledSpecs={setPrefilledSpecs} 
          />
        );
      case 'orders':
        return (
          <OrderList 
            orders={visibleOrders} 
            selectedOrder={selectedOrder} 
            setSelectedOrder={setSelectedOrder} 
            refreshOrders={async () => {
              try {
                if (currentUser.role === 'Yönetici') {
                  const ords = await adminAPI.getOrders();
                  setOrders(ords);
                } else {
                  const ords = await ordersAPI.list();
                  setOrders(ords);
                }
                const updatedUser = await authAPI.me();
                setCurrentUser(updatedUser);
                setCurrentBalance(updatedUser.balance || 0);
              } catch (e) {
                console.error(e);
              }
            }}
          />
        );
      case 'direct-pay':
        return (
          <DirectPay 
            currentUser={currentUser} 
            currentBalance={currentBalance} 
            updateBalance={updateBalance} 
          />
        );
      case 'admin-panel':
        if (currentUser.role !== 'Yönetici') return <div>Yetkisiz Erişim</div>;
        return (
          <AdminPanel 
            orders={orders} 
            updateOrderStatus={updateOrderStatus} 
            users={users}
          />
        );

      case 'support':
        return (
          <div className="contact-layout">
            <div>
              <div className="section-card" style={{ padding: '24px', marginBottom: '24px' }}>
                <h3 className="section-title" style={{ marginBottom: '16px' }}>
                  <FileCheck size={18} className="text-primary" /> Baskı Öncesi Hazırlık Kılavuzu
                </h3>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li><strong>Renk Formatı:</strong> Çalışmalarınızı mutlaka <strong>CMYK</strong> renk modunda hazırlayın. RGB gönderilen işlerde ton farkı oluşabilir.</li>
                  <li><strong>Çözünürlük:</strong> Net ve kaliteli bir baskı için tasarımlarınızın en az <strong>300 DPI</strong> çözünürlükte olmasına dikkat edin.</li>
                  <li><strong>Kesim Payı (Taşma Payı):</strong> Kesim esnasında görsel kayıpları önlemek için tasarımlarınızın kenarlarından en az <strong>3 mm</strong> kesim payı bırakın.</li>
                  <li><strong>Yazı Tipleri (Fonts):</strong> Gönderdiğiniz vektörel dosyalardaki tüm yazıları convert yapmayı unutmayın.</li>
                </ul>
              </div>

              <div className="section-card" style={{ padding: '24px' }}>
                <h3 className="section-title" style={{ marginBottom: '16px' }}>İletişim Bilgilerimiz</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MapPin size={20} className="text-primary" />
                    <span>Çamdibi, 1. Sanayi Sitesi 2818. Sk. No:24, Bornova / İzmir</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Phone size={20} className="text-primary" />
                    <span>+90 (232) 433 11 22</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Mail size={20} className="text-primary" />
                    <span>destek@camdibimatbaa.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-card" style={{ padding: '24px' }}>
              <h3 className="section-title" style={{ marginBottom: '16px' }}>Destek ve Fiyat Talep Formu</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Özel ebat baskılar, fiyat teklifleri veya teknik sorular için bize anında yazabilirsiniz.
              </p>
              
              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label className="form-label">Adınız Soyadınız</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">E-Posta Adresiniz</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    required 
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mesajınız</label>
                  <textarea 
                    className="form-input" 
                    rows="5" 
                    style={{ resize: 'none' }}
                    required 
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={formSent}>
                  <Send size={16} /> {formSent ? 'Gönderiliyor...' : 'Talebi İlet'}
                </button>
              </form>
            </div>
          </div>
        );
      default:
        return <div>Bulunamadı</div>;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Müşteri Paneli';
      case 'new-order': return 'Online Baskı Siparişi Oluştur';
      case 'orders': return 'Tüm Siparişlerim';
      case 'price-list': return 'Online Fiyat Listesi & Sipariş Paneli';
      case 'direct-pay': return 'Cari Hesap Ödemesi';
      case 'admin-panel': return 'Matbaa Yönetim Paneli';

      case 'support': return 'Destek & Teknik Kılavuz';
      default: return 'Çamdibi Matbaa';
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand-section">
          <div className="brand-logo-card">
            <Printer />
          </div>
          <div className="brand-text-container">
            <span className="brand-main-title">ÇAMDİBİ</span>
            <span className="brand-sub-title">MATBAACILIK</span>
          </div>
        </div>

        <nav>
          <ul className="nav-list">
            {currentUser.role === 'Yönetici' ? (
              <>
                <li 
                  className={`nav-item ${activeTab === 'admin-panel' ? 'active' : ''}`}
                  onClick={() => setActiveTab('admin-panel')}
                >
                  <ShieldAlert className="nav-icon" /> Yönetici Paneli
                </li>
                <li 
                  className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <ListOrdered className="nav-icon" /> Tüm Siparişler
                </li>
              </>
            ) : (
              <>
                <li 
                  className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <LayoutDashboard className="nav-icon" /> Panelim
                </li>
                <li 
                  className={`nav-item ${activeTab === 'new-order' ? 'active' : ''}`}
                  onClick={() => setActiveTab('new-order')}
                >
                  <PlusCircle className="nav-icon" /> Sipariş Oluştur
                </li>
                <li 
                  className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <ListOrdered className="nav-icon" /> Tüm Siparişlerim
                </li>
                <li 
                  className={`nav-item ${activeTab === 'direct-pay' ? 'active' : ''}`}
                  onClick={() => setActiveTab('direct-pay')}
                >
                  <CreditCard className="nav-icon" /> Cari Ödeme
                </li>
              </>
            )}
            
            <li 
              className={`nav-item ${activeTab === 'price-list' ? 'active' : ''}`}
              onClick={() => setActiveTab('price-list')}
            >
              <FileCheck className="nav-icon" /> Fiyat Listesi
            </li>
            

            <li 
              className={`nav-item ${activeTab === 'support' ? 'active' : ''}`}
              onClick={() => setActiveTab('support')}
            >
              <HelpCircle className="nav-icon" /> Destek & İletişim
            </li>
          </ul>
        </nav>

        {/* User Card */}
        <div className="user-profile-section" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
            <div className="user-avatar">{currentUser.name.substring(0, 2).toUpperCase()}</div>
            <div className="user-info" style={{ flexGrow: 1 }}>
              <span className="user-name">{currentUser.name}</span>
              <span className="user-role">{currentUser.role}</span>
            </div>
          </div>
          <button 
            className="btn btn-outline" 
            onClick={handleLogout}
            style={{ width: '100%', padding: '6px 12px', display: 'flex', gap: '6px', justifyContent: 'center', fontSize: '12px', border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8' }}
          >
            <LogOut size={14} /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Screen */}
      <main className="main-panel">
        <header className="top-bar">
          <div className="page-title-section">
            <h1 className="page-heading">{getPageTitle()}</h1>
            <span className="page-subheading">Çamdibi Matbaa Online Sipariş Yönetim Sistemi</span>
          </div>

          <div className="top-bar-actions">
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Tema Değiştir">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button className="notifications-btn" onClick={() => alert('Yeni bir bildiriminiz bulunmuyor.')} title="Bildirimler">
              <Bell size={18} />
            </button>
          </div>
        </header>

        <div className="content-wrapper">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
