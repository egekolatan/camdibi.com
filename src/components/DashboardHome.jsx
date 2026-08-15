import React, { useState } from 'react';
import { 
  ShoppingBag, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  ChevronRight, 
  ArrowUpRight, 
  Truck, 
  Building, 
  HelpCircle, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  Send
} from 'lucide-react';
import { authAPI } from '../utils/api';

export default function DashboardHome({ orders, setActiveTab, setSelectedOrder, currentUser, currentBalance }) {
  const [supportMsg, setSupportMsg] = useState('');
  const [supportSent, setSupportSent] = useState(false);

  // Calculate metrics
  const activeOrdersCount = orders.filter(o => o.status !== 'Teslim Edildi' && o.status !== 'İptal Edildi').length;
  const completedOrdersCount = orders.filter(o => o.status === 'Teslim Edildi').length;
  const pendingDesignCount = orders.filter(o => o.status === 'Tasarım Bekliyor').length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);

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
      default:
        return <span className="badge warning">{status}</span>;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Günaydın';
    if (hour < 18) return 'Tünaydın';
    return 'İyi Akşamlar';
  };

  const handleQuickSupportSubmit = async (e) => {
    e.preventDefault();
    if (!supportMsg.trim()) return;

    try {
      await authAPI.sendMessage({
        name: currentUser.name,
        email: currentUser.email,
        message: `[Hızlı Panel Mesajı]: ${supportMsg}`
      });

      setSupportSent(true);
      setSupportMsg('');
      setTimeout(() => {
        setSupportSent(false);
        alert('Destek ekibimize talebiniz iletilmiştir.');
      }, 500);
    } catch (err) {
      alert('Tepki gönderilemedi: ' + err.message);
    }
  };

  return (
    <div>
      {/* Premium Welcome Header Area */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '30px',
        borderRadius: '16px',
        marginBottom: '28px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          right: '-50px',
          bottom: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Hoş Geldiniz, {getGreeting()}!
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1px', margin: '4px 0 12px 0' }}>
              {currentUser.name}
            </h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: '#cbd5e1' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building size={14} /> {currentUser.company_name || 'Bireysel Cari'}
              </span>
              {(currentUser.tax_office || currentUser.tax_number) && (
                <>
                  <span>•</span>
                  <span>Vergi Dairesi: {currentUser.tax_office || '-'}</span>
                  <span>•</span>
                  <span>Vergi No: {currentUser.tax_number || '-'}</span>
                </>
              )}
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            padding: '12px 20px',
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: '600' }}>Cari Hesabınız</div>
            <div style={{ fontSize: '20px', fontWeight: '800', marginTop: '2px', color: currentBalance > 0 ? '#f43f5e' : '#10b981' }}>
              {currentBalance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="dashboard-grid" style={{ marginBottom: '28px' }}>
        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Aktif Siparişler</span>
            <span className="metric-value">{activeOrdersCount}</span>
          </div>
          <div className="metric-icon-box warning">
            <Clock size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Tamamlanan</span>
            <span className="metric-value">{completedOrdersCount}</span>
          </div>
          <div className="metric-icon-box success">
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Tasarım Onayı Bekleyen</span>
            <span className="metric-value">{pendingDesignCount}</span>
          </div>
          <div className="metric-icon-box warning">
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Toplam Harcama</span>
            <span className="metric-value">{totalSpent.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
          </div>
          <div className="metric-icon-box" style={{ color: 'var(--primary)', backgroundColor: 'var(--primary-light)' }}>
            <CreditCard size={24} />
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '28px', alignItems: 'start' }} className="calc-layout">
        
        {/* Left Column: Recent Orders List */}
        <div className="section-card" style={{ margin: 0 }}>
          <div className="section-header" style={{ marginBottom: '20px' }}>
            <span className="section-title">
              <ShoppingBag size={18} /> Son Siparişleriniz
            </span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-outline" style={{ padding: '8px 14px' }} onClick={() => setActiveTab('orders')}>
                Tümünü Gör
              </button>
              <button className="btn btn-primary" style={{ padding: '8px 14px' }} onClick={() => setActiveTab('new-order')}>
                Yeni Sipariş Ver <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sipariş No</th>
                  <th>Ürün</th>
                  <th>Tarih</th>
                  <th>Tutar</th>
                  <th>Durum</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: '700' }}>{order.order_no || order.id}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '600' }}>{order.productName || order.product_name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.qty} Adet</span>
                      </div>
                    </td>
                    <td>{order.date || (order.created_at ? new Date(order.created_at).toLocaleDateString('tr-TR') : '')}</td>
                    <td style={{ fontWeight: '600' }}>{order.total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                        onClick={() => setSelectedOrder(order)}
                      >
                        Detay
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      Henüz siparişiniz bulunmamaktadır.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Financial health and quick messaging widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Outstanding Balance Warning/Success card */}
          <div className="section-card" style={{ margin: 0, padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={18} /> Cari Hesap Durumu
            </h3>
            {currentBalance > 0 ? (
              <div>
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ödenmemiş Borç Bakiye</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#ef4444', margin: '4px 0' }}>
                    {currentBalance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </div>
                  <p style={{ fontSize: '12px', color: '#7f1d1d', lineHeight: '1.4' }}>
                    Gecikmiş borç bakiyenizi kapatarak sonraki siparişlerinizin baskıya alınmasını hızlandırabilirsiniz.
                  </p>
                </div>
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '13px' }}
                  onClick={() => setActiveTab('direct-pay')}
                >
                  Şimdi Ödeme Yap <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyCentent: 'center', margin: '0 auto 12px auto', alignSelf: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={24} />
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#065f46', marginBottom: '4px' }}>Hesabınız Temiz</h4>
                <p style={{ fontSize: '12px', color: '#047857', lineHeight: '1.4' }}>
                  Tebrikler! Ödenmemiş cari borç bakiyeniz bulunmamaktadır. Siparişleriniz doğrudan üretime alınır.
                </p>
              </div>
            )}
          </div>



        </div>

      </div>
    </div>
  );
}
