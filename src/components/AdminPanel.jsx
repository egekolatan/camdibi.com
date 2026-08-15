import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Users, 
  HelpCircle, 
  CreditCard, 
  Clock, 
  Truck, 
  ChevronRight, 
  Search, 
  Filter, 
  FileText, 
  Mail, 
  ExternalLink,
  CheckCircle,
  Eye,
  User,
  MapPin,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { adminAPI, API_BASE } from '../utils/api';

export default function AdminPanel({ orders, updateOrderStatus, users }) {
  const [activeTab, setActiveTab] = useState('orders');
  const [contactMessages, setContactMessages] = useState([]);

  useEffect(() => {
    adminAPI.getMessages()
      .then(setContactMessages)
      .catch(console.error);
  }, []);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [selectedAdminOrder, setSelectedAdminOrder] = useState(null);

  // Compute aggregated stats
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const printingCount = orders.filter(o => o.status === 'Baskıda').length;
  const deliveryCount = orders.filter(o => o.status === 'Kargoda').length;

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedAdminOrder && selectedAdminOrder.id === orderId) {
      setSelectedAdminOrder(prev => ({ ...prev, status: newStatus }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Teslim Edildi':
        return <span className="badge success"><CheckCircle size={12} /> Teslim Edildi</span>;
      case 'Baskıda':
        return <span className="badge info"><Clock size={12} /> Baskıda</span>;
      case 'Tasarım Bekliyor':
        return <span className="badge warning"><Clock size={12} /> Tasarım Bekliyor</span>;
      case 'Kargoda':
        return <span className="badge info"><Truck size={12} /> Kargoda</span>;
      case 'Sipariş Alındı':
        return <span className="badge warning"><Clock size={12} /> Alındı</span>;
      default:
        return <span className="badge warning">{status}</span>;
    }
  };

  const getFileBadge = (filename) => {
    if (!filename) return <span style={{ color: 'var(--text-muted)' }}>Müşteri Şablonu</span>;
    const ext = filename.split('.').pop().toUpperCase();
    let color = '#4b5563'; // default grey
    if (ext === 'PDF') color = '#ef4444';
    if (ext === 'AI') color = '#f59e0b';
    if (ext === 'PSD') color = '#3b82f6';
    if (ext === 'CDR') color = '#10b981';

    return (
      <span style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '4px',
        fontSize: '11px', 
        fontWeight: '700', 
        padding: '2px 6px', 
        borderRadius: '4px',
        backgroundColor: `${color}15`,
        color: color,
        border: `1px solid ${color}30`
      }}>
        {ext}
      </span>
    );
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const oId = String(order.order_no || order.id).toLowerCase();
    const oProd = String(order.productName || order.product_name).toLowerCase();
    const oEmail = String(order.userEmail || order.user_email || '').toLowerCase();

    const matchesSearch = 
      oId.includes(orderSearch.toLowerCase()) ||
      oProd.includes(orderSearch.toLowerCase()) ||
      oEmail.includes(orderSearch.toLowerCase());

    if (orderFilter === 'all') return matchesSearch;
    return matchesSearch && order.status === orderFilter;
  });

  return (
    <div>
      {/* Premium Admin metrics section with details */}
      <div className="dashboard-grid">
        <div className="metric-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span className="metric-label">Toplam Ciro</span>
            <div className="metric-icon-box success"><CreditCard size={20} /></div>
          </div>
          <div>
            <div className="metric-value">{totalSales.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</div>
            <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '600', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} /> +14.2% bu hafta
            </div>
          </div>
        </div>

        <div className="metric-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span className="metric-label">Gelen Siparişler</span>
            <div className="metric-icon-box" style={{ color: 'var(--primary)', backgroundColor: 'var(--primary-light)' }}><ShoppingBag size={20} /></div>
          </div>
          <div>
            <div className="metric-value">{totalOrders}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Toplam aktif sipariş havuzu</div>
          </div>
        </div>

        <div className="metric-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span className="metric-label">Baskı Aşaması</span>
            <div className="metric-icon-box warning"><Clock size={20} /></div>
          </div>
          <div>
            <div className="metric-value">{printingCount}</div>
            <div style={{ fontSize: '12px', color: 'var(--warning)', fontWeight: '600', marginTop: '4px' }}>
              Baskı makineleri aktif sırada
            </div>
          </div>
        </div>

        <div className="metric-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span className="metric-label">Sevkiyat Kurye</span>
            <div className="metric-icon-box info"><Truck size={20} /></div>
          </div>
          <div>
            <div className="metric-value">{deliveryCount}</div>
            <div style={{ fontSize: '12px', color: 'var(--info)', fontWeight: '600', marginTop: '4px' }}>
              Yola çıkacak kurye paketleri
            </div>
          </div>
        </div>
      </div>

      {/* Admin Tab Buttons */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('orders')}
          style={{ borderRadius: '0', borderBottom: activeTab === 'orders' ? '2.5px solid var(--primary)' : 'none', padding: '12px 16px', background: 'none', color: activeTab === 'orders' ? 'var(--text-main)' : 'var(--text-muted)' }}
        >
          Sipariş Yönetimi ({orders.length})
        </button>
        <button 
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('users')}
          style={{ borderRadius: '0', borderBottom: activeTab === 'users' ? '2.5px solid var(--primary)' : 'none', padding: '12px 16px', background: 'none', color: activeTab === 'users' ? 'var(--text-main)' : 'var(--text-muted)' }}
        >
          Müşteri Hesapları ({users.length})
        </button>
        <button 
          className={`btn ${activeTab === 'messages' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('messages')}
          style={{ borderRadius: '0', borderBottom: activeTab === 'messages' ? '2.5px solid var(--primary)' : 'none', padding: '12px 16px', background: 'none', color: activeTab === 'messages' ? 'var(--text-main)' : 'var(--text-muted)' }}
        >
          Müşteri Talepleri ({contactMessages.length})
        </button>
      </div>

      {/* VIEW 1: All Orders List */}
      {activeTab === 'orders' && (
        <div>
          {/* Table Toolbar */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
            {/* Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0 12px', width: '320px', backgroundColor: 'var(--bg-card)' }}>
              <Search size={16} className="text-muted" style={{ marginRight: '8px' }} />
              <input 
                type="text" 
                placeholder="Sipariş No, Ürün veya Müşteri Ara..." 
                style={{ border: 'none', outline: 'none', background: 'transparent', padding: '10px 0', fontSize: '13px', color: 'var(--text-main)', width: '100%' }}
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
              />
            </div>

            {/* Status Filter Badges */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button className={`btn btn-outline ${orderFilter === 'all' ? 'active' : ''}`} style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setOrderFilter('all')}>Hepsi</button>
              <button className={`btn btn-outline ${orderFilter === 'Sipariş Alındı' ? 'active' : ''}`} style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setOrderFilter('Sipariş Alındı')}>Alındı</button>
              <button className={`btn btn-outline ${orderFilter === 'Tasarım Bekliyor' ? 'active' : ''}`} style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setOrderFilter('Tasarım Bekliyor')}>Tasarım</button>
              <button className={`btn btn-outline ${orderFilter === 'Baskıda' ? 'active' : ''}`} style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setOrderFilter('Baskıda')}>Baskıda</button>
              <button className={`btn btn-outline ${orderFilter === 'Kargoda' ? 'active' : ''}`} style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setOrderFilter('Kargoda')}>Kargoda</button>
              <button className={`btn btn-outline ${orderFilter === 'Teslim Edildi' ? 'active' : ''}`} style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setOrderFilter('Teslim Edildi')}>Teslim</button>
            </div>
          </div>

          <div className="section-card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Sipariş No</th>
                    <th>Müşteri</th>
                    <th>Ürün</th>
                    <th>Tarih</th>
                    <th>Tutar</th>
                    <th>Baskı Dosyası</th>
                    <th>Durum</th>
                    <th>Eylem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: '700' }}>{order.order_no || order.id}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '600', fontSize: '13px' }}>{order.shippingName || order.shipping_name || 'Müşteri'}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.userEmail || order.user_email}</span>
                        </div>
                      </td>
                      <td>{order.productName || order.product_name}</td>
                      <td>{order.date ? order.date : new Date(order.created_at).toLocaleDateString('tr-TR')}</td>
                      <td style={{ fontWeight: '600' }}>{order.total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getFileBadge(order.fileName || order.file_name)}
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                            {order.fileName || order.file_name || 'Dosya Yok'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <select 
                          className="form-select" 
                          style={{ padding: '4px 8px', fontSize: '12px', width: '150px', borderRadius: '6px' }}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          <option value="Sipariş Alındı">Sipariş Alındı</option>
                          <option value="Tasarım Bekliyor">Tasarım Bekliyor</option>
                          <option value="Baskıda">Baskıda</option>
                          <option value="Kargoda">Kargoda</option>
                          <option value="Teslim Edildi">Teslim Edildi</option>
                        </select>
                      </td>
                      <td>
                        <button className="btn btn-outline" style={{ padding: '4px 8px' }} onClick={() => setSelectedAdminOrder(order)}>
                          <Eye size={14} /> Detay
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        Filtrelere uygun sipariş bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Registered Users with detailed cards */}
      {activeTab === 'users' && (
        <div className="section-card">
          <div className="section-header">
            <span className="section-title"><Users size={18} /> Kayıtlı Müşteri Hesapları</span>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Müşteri Bilgisi</th>
                  <th>Telefon</th>
                  <th>Cari Bakiye (Borç)</th>
                  <th>Kurumsal Bilgiler</th>
                  <th>Hesap Tipi</th>
                  <th>Kayıt Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((usr, index) => (
                  <tr key={index}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="user-avatar" style={{ width: '38px', height: '38px', fontSize: '13px' }}>
                          {usr.name ? usr.name.substring(0,2).toUpperCase() : '??'}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '600' }}>{usr.name}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{usr.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px' }}>{usr.phone || '-'}</span>
                    </td>
                    <td style={{ fontWeight: '700', color: (usr.balance || 0) > 0 ? 'var(--danger)' : 'var(--success)' }}>
                      {(usr.balance || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </td>
                    <td>
                      {usr.company_name ? (
                        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '12px' }}>
                          <span style={{ fontWeight: '600' }}>{usr.company_name}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                            {usr.tax_office || '-'} / No: {usr.tax_number || '-'}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Bireysel Cari</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${usr.role === 'Yönetici' ? 'danger' : 'info'}`}>
                        {usr.role || 'Müşteri'}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {usr.created_at ? new Date(usr.created_at).toLocaleDateString('tr-TR') : '14 Ağustos 2026'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: support tickets layout */}
      {activeTab === 'messages' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          {contactMessages.map((msg) => (
            <div key={msg.id} className="section-card" style={{ marginBottom: '0' }}>
              <div className="section-header" style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.005)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="user-avatar" style={{ width: '36px', height: '36px', borderRadius: '8px' }}>
                    {msg.name.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{msg.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{msg.email} • {msg.date}</div>
                  </div>
                </div>
                <span className="badge warning">Talep Açık</span>
              </div>
              <div className="modal-body" style={{ padding: '20px' }}>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-main)', whiteSpace: 'pre-line', marginBottom: '20px' }}>
                  {msg.message}
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <a href={`mailto:${msg.email}`} className="btn btn-primary" style={{ padding: '8px 14px' }}>
                    <Mail size={14} /> E-posta ile Yanıtla
                  </a>
                </div>
              </div>
            </div>
          ))}
          {contactMessages.length === 0 && (
            <div className="section-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Gelen destek talebi veya özel fiyat teklifi formu bulunmamaktadır.
            </div>
          )}
        </div>
      )}

      {/* Order Detail Modal for Admins */}
      {selectedAdminOrder && (
        <div className="modal-overlay" onClick={() => setSelectedAdminOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Sipariş Detayı & Yönetimi: {selectedAdminOrder.id}</h3>
              <button className="close-btn" onClick={() => setSelectedAdminOrder(null)}>Kapat</button>
            </div>
            
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Order Status Selector */}
              <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-app)' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>Sipariş Durumu</h4>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <select 
                    className="form-select" 
                    value={selectedAdminOrder.status}
                    onChange={(e) => handleStatusChange(selectedAdminOrder.id, e.target.value)}
                  >
                    <option value="Sipariş Alındı">Sipariş Alındı</option>
                    <option value="Tasarım Bekliyor">Tasarım Bekliyor</option>
                    <option value="Baskıda">Baskıda</option>
                    <option value="Kargoda">Kargoda</option>
                    <option value="Teslim Edildi">Teslim Edildi</option>
                  </select>
                  {getStatusBadge(selectedAdminOrder.status)}
                </div>
              </div>

              {/* Delivery and Customer details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14} /> Müşteri Bilgileri</h4>
                  <p style={{ fontSize: '13px', fontWeight: '600' }}>{selectedAdminOrder.shippingName}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{selectedAdminOrder.userEmail}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Ödeme Yöntemi: <strong>{selectedAdminOrder.paymentMethod === 'card' ? 'Kredi Kartı' : 'Havale / EFT'}</strong></p>
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> Teslimat Adresi</h4>
                  <p style={{ fontSize: '12px', lineHeight: '1.5' }}>
                    {selectedAdminOrder.shippingAddress}<br />
                    <strong>{selectedAdminOrder.shippingCity}</strong>
                  </p>
                </div>
              </div>

              {/* Technical Specifications */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>Teknik Baskı Detayları</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                  <div><span>Ürün:</span> <strong>{selectedAdminOrder.productName}</strong></div>
                  <div><span>Adet:</span> <strong>{selectedAdminOrder.qty} Adet</strong></div>
                  <div><span>Kağıt:</span> <strong>{selectedAdminOrder.specs.paper || '-'}</strong></div>
                  <div><span>Selefon:</span> <strong>{selectedAdminOrder.specs.lamination || '-'}</strong></div>
                  <div><span>Ebat:</span> <strong>{selectedAdminOrder.specs.size || '-'}</strong></div>
                  <div><span>Kesim/Cilt:</span> <strong>{selectedAdminOrder.specs.corner || 'Düz Kesim'}</strong></div>
                </div>
              </div>

              {/* Uploaded File Detail */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={15} /> Dosya Ayrıntıları</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getFileBadge(selectedAdminOrder.fileName)}
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>{selectedAdminOrder.fileName || 'Dosya Yüklenmemiş'}</span>
                  </div>
                  {selectedAdminOrder.fileName && (
                    <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => window.open(`${API_BASE}/uploads/${selectedAdminOrder.fileName}`, '_blank')}>
                      İndir <ExternalLink size={12} />
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button className="btn btn-outline" onClick={() => setSelectedAdminOrder(null)}>Kapat</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
