import React, { useState } from 'react';
import { Search, Eye, Download, X, Layers, Printer, FileText, Calendar, DollarSign, Award, Clock, Upload, Loader, Lock } from 'lucide-react';
import { ordersAPI, API_BASE } from '../utils/api';
import PaymentForm from './PaymentForm';

export default function OrderList({ orders, selectedOrder, setSelectedOrder, refreshOrders }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const getFilteredOrders = () => {
    return orders.filter(order => {
      const oId = String(order.order_no || order.id).toLowerCase();
      const oProd = String(order.productName || order.product_name).toLowerCase();

      // Search term match
      const matchesSearch = 
        oId.includes(search.toLowerCase()) ||
        oProd.includes(search.toLowerCase());

      // Filter category match
      if (filter === 'all') return matchesSearch;
      if (filter === 'active') return matchesSearch && order.status !== 'Teslim Edildi' && order.status !== 'İptal Edildi';
      if (filter === 'completed') return matchesSearch && order.status === 'Teslim Edildi';
      if (filter === 'design') return matchesSearch && order.status === 'Tasarım Bekliyor';
      return matchesSearch;
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Teslim Edildi': return 'success';
      case 'Baskıda': return 'info';
      case 'Tasarım Bekliyor': return 'warning';
      case 'Kargoda': return 'info';
      case 'Sipariş Alındı': return 'warning';
      default: return 'warning';
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedOrder) return;

    setUploading(true);
    try {
      await ordersAPI.uploadFile(selectedOrder.id, file);
      alert('Tasarım dosyanız başarıyla yüklenmiştir!');
      
      // Refresh global order list
      if (refreshOrders) await refreshOrders();
      
      // Update local selectedOrder modal view
      const updated = await ordersAPI.get(selectedOrder.id);
      setSelectedOrder(updated);
    } catch (err) {
      alert('Dosya yüklenirken hata oluştu: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    setShowPayment(false);
    if (refreshOrders) await refreshOrders();
    if (selectedOrder) {
      const updated = await ordersAPI.get(selectedOrder.id);
      setSelectedOrder(updated);
    }
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div>
      {/* Filters and Search Bar */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('all')}>Tüm Siparişler</button>
          <button className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('active')}>Devam Edenler</button>
          <button className={`btn ${filter === 'design' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('design')}>Tasarım Onayı</button>
          <button className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('completed')}>Tamamlananlar</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0 12px', width: '280px', backgroundColor: 'var(--bg-card)' }}>
          <Search size={18} className="text-muted" style={{ marginRight: '8px' }} />
          <input 
            type="text" 
            placeholder="Sipariş veya Ürün Ara..." 
            style={{ border: 'none', outline: 'none', background: 'transparent', padding: '10px 0', fontSize: '14px', color: 'var(--text-main)', width: '100%' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="section-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sipariş No</th>
                <th>Ürün</th>
                <th>Tarih</th>
                <th>Adet</th>
                <th>Özellikler</th>
                <th>Toplam Tutar</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: '700' }}>{order.order_no || order.id}</td>
                  <td>{order.productName || order.product_name}</td>
                  <td>{order.date || new Date(order.created_at).toLocaleDateString('tr-TR')}</td>
                  <td>{order.qty} Adet</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {order.specs.paper && `${order.specs.paper}, `}
                    {order.specs.lamination && `${order.specs.lamination}, `}
                    {order.specs.size && `${order.specs.size}`}
                  </td>
                  <td style={{ fontWeight: '600' }}>{order.total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                  <td>
                    <span className={`badge ${getStatusClass(order.status)}`}>{order.status}</span>
                  </td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-outline" style={{ padding: '6px 10px' }} onClick={() => setSelectedOrder(order)}>
                      <Eye size={14} /> Detay
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Kriterlere uygun sipariş bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => { if(!showPayment) setSelectedOrder(null); }}>
          <div className="modal-content" style={{ maxWidth: showPayment ? '500px' : '650px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>
                {showPayment ? 'Güvenli Kart Ödemesi' : `Sipariş Detayı: ${selectedOrder.order_no || selectedOrder.id}`}
              </h3>
              <button className="close-btn" onClick={() => { if(showPayment) { setShowPayment(false); } else { setSelectedOrder(null); } }}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              {showPayment ? (
                <PaymentForm 
                  order={selectedOrder} 
                  onSuccess={handlePaymentSuccess} 
                  onCancel={() => setShowPayment(false)} 
                />
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Sipariş Tarihi</p>
                      <p style={{ fontWeight: '600', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <Calendar size={14} /> {selectedOrder.date || new Date(selectedOrder.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Durum</p>
                      <span className={`badge ${getStatusClass(selectedOrder.status)}`} style={{ marginTop: '4px' }}>{selectedOrder.status}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Toplam Tutar</p>
                      <p style={{ fontWeight: '700', fontSize: '16px', color: 'var(--primary)', marginTop: '4px' }}>
                        ₺{selectedOrder.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {/* Specs segment */}
                  <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px', backgroundColor: 'var(--bg-app)', marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Layers size={16} /> Baskı Konfigürasyonu</h4>
                    
                    <div className="summary-row" style={{ fontSize: '13px', marginBottom: '8px' }}>
                      <span>Ürün:</span>
                      <strong>{selectedOrder.productName || selectedOrder.product_name}</strong>
                    </div>
                    <div className="summary-row" style={{ fontSize: '13px', marginBottom: '8px' }}>
                      <span>Adet / Miktar:</span>
                      <strong>{selectedOrder.qty} Adet</strong>
                    </div>
                    <div className="summary-row" style={{ fontSize: '13px', marginBottom: '8px' }}>
                      <span>Kağıt Türü:</span>
                      <strong>{selectedOrder.specs.paper || 'Belirtilmedi'}</strong>
                    </div>
                    <div className="summary-row" style={{ fontSize: '13px', marginBottom: '8px' }}>
                      <span>Kaplama / Selefon:</span>
                      <strong>{selectedOrder.specs.lamination || 'Belirtilmedi'}</strong>
                    </div>
                    <div className="summary-row" style={{ fontSize: '13px', marginBottom: '8px' }}>
                      <span>Boyut / Kesim:</span>
                      <strong>{selectedOrder.specs.size || 'Belirtilmedi'} ({selectedOrder.specs.corner || 'Düz Kesim'})</strong>
                    </div>
                  </div>

                  {/* Artwork File upload / display */}
                  <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px', backgroundColor: 'var(--bg-app)', marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={16} /> Tasarım Dosyaları</h4>
                    
                    {selectedOrder.fileName || selectedOrder.file_name ? (
                      <div className="summary-row" style={{ fontSize: '13px' }}>
                        <span>Yüklenen Dosya:</span>
                        <strong style={{ maxWidth: '280px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          <a href={`${API_BASE}/uploads/${selectedOrder.fileName || selectedOrder.file_name}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                            {selectedOrder.fileName || selectedOrder.file_name}
                          </a>
                        </strong>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                          Siparişinizi üretime alabilmemiz için tasarım dosyanızı (PDF, AI, PSD, CDR, PNG) yüklemeniz gerekmektedir.
                        </p>
                        <label className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          {uploading ? (
                            <><Loader size={16} className="spin" /> Yükleniyor...</>
                          ) : (
                            <><Upload size={16} /> Tasarım Dosyası Seç</>
                          )}
                          <input type="file" style={{ display: 'none' }} accept=".pdf,.ai,.psd,.cdr,.png,.jpg,.jpeg,.zip" onChange={handleFileUpload} disabled={uploading} />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Actions (Pay button or Close button) */}
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    {selectedOrder.payment_status !== 'Ödendi' && selectedOrder.payment_method === 'card' && (
                      <button 
                        className="btn btn-primary" 
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        onClick={() => setShowPayment(true)}
                      >
                        <Lock size={16} /> Kartla Şimdi Öde
                      </button>
                    )}
                    
                    <button className="btn btn-outline" onClick={() => setSelectedOrder(null)}>Kapat</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
