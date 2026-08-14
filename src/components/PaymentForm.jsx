import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { paymentsAPI } from '../utils/api';

export default function PaymentForm({ order, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    card_holder_name: '',
    card_number: '',
    card_expire_month: '',
    card_expire_year: '',
    card_cvv: '',
    installment: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paytrIframe, setPaytrIframe] = useState(null);

  const formatCardNumber = (val) =>
    val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);

  const getCardBrand = () => {
    const n = form.card_number.replace(/\s/g, '');
    if (n.startsWith('4')) return 'VISA';
    if (/^5[1-5]/.test(n)) return 'MASTERCARD';
    if (/^3[47]/.test(n)) return 'AMEX';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await paymentsAPI.initCardPayment({
        order_id: order.id,
        card_holder_name: form.card_holder_name,
        card_number: form.card_number.replace(/\s/g, ''),
        card_expire_month: form.card_expire_month,
        card_expire_year: form.card_expire_year,
        card_cvv: form.card_cvv,
        installment: parseInt(form.installment),
      });

      // PayTR iframe URL'si döndü — 3D Secure için göster
      if (result.iframe_url) {
        setPaytrIframe(result.iframe_url);
      } else {
        setSuccess(true);
        onSuccess && onSuccess(result);
      }
    } catch (err) {
      setError(err.message || 'Ödeme işlemi sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // 3D Secure iframe göster
  if (paytrIframe) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          color: '#fff',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          <Lock size={16} style={{ color: '#10b981' }} />
          3D Secure Doğrulama — Bankanızdan SMS kodu bekleniyor
        </div>
        <iframe
          src={paytrIframe}
          style={{ width: '100%', height: '500px', border: 'none', borderRadius: '12px' }}
          title="3D Secure Ödeme"
        />
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
          Bu pencereyi kapatmayın. Ödeme tamamlandıktan sonra otomatik yönlendirileceksiniz.
        </p>
      </div>
    );
  }

  // Başarı ekranı
  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
          <CheckCircle size={32} style={{ color: '#10b981' }} />
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Ödeme Başarılı!</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
          Siparişiniz ödeme onaylandı ve üretime alındı.
        </p>
        <button className="btn btn-primary" style={{ padding: '12px 32px' }} onClick={onSuccess}>
          Siparişlerime Git
        </button>
      </div>
    );
  }

  const cardBrand = getCardBrand();

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Ödeme Özeti */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '16px',
        padding: '20px',
        color: '#fff'
      }}>
        <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Ödeme Tutarı
        </div>
        <div style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1px' }}>
          ₺{order.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
        </div>
        <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
          {order.product_name || order.productName} — Sipariş #{order.order_no || order.id}
        </div>
      </div>

      {/* Kart Bilgileri */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CreditCard size={16} style={{ color: 'var(--primary)' }} />
          Kart Bilgileri
        </div>

        {/* Kart Sahibi */}
        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label className="form-label">Kart Üzerindeki İsim</label>
          <input
            type="text"
            className="form-input"
            placeholder="AD SOYAD"
            required
            value={form.card_holder_name}
            onChange={(e) => setForm({ ...form, card_holder_name: e.target.value.toUpperCase() })}
            style={{ textTransform: 'uppercase', letterSpacing: '1px', borderRadius: '8px' }}
          />
        </div>

        {/* Kart Numarası */}
        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Kart Numarası</span>
            {cardBrand && (
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px' }}>
                {cardBrand}
              </span>
            )}
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="0000 0000 0000 0000"
            required
            maxLength={19}
            value={form.card_number}
            onChange={(e) => setForm({ ...form, card_number: formatCardNumber(e.target.value) })}
            style={{ letterSpacing: '2px', fontFamily: 'monospace', fontSize: '16px', borderRadius: '8px' }}
          />
        </div>

        {/* Son Kullanma + CVV */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Ay</label>
            <select
              className="form-input"
              required
              value={form.card_expire_month}
              onChange={(e) => setForm({ ...form, card_expire_month: e.target.value })}
              style={{ borderRadius: '8px' }}
            >
              <option value="">AA</option>
              {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Yıl</label>
            <select
              className="form-input"
              required
              value={form.card_expire_year}
              onChange={(e) => setForm({ ...form, card_expire_year: e.target.value })}
              style={{ borderRadius: '8px' }}
            >
              <option value="">YYYY</option>
              {Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() + i)).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">CVV</label>
            <input
              type="password"
              className="form-input"
              placeholder="•••"
              required
              maxLength={4}
              value={form.card_cvv}
              onChange={(e) => setForm({ ...form, card_cvv: e.target.value.replace(/\D/g, '') })}
              style={{ letterSpacing: '4px', textAlign: 'center', borderRadius: '8px' }}
            />
          </div>
        </div>

        {/* Taksit */}
        <div className="form-group" style={{ marginTop: '12px' }}>
          <label className="form-label">Taksit Seçeneği</label>
          <select
            className="form-input"
            value={form.installment}
            onChange={(e) => setForm({ ...form, installment: e.target.value })}
            style={{ borderRadius: '8px' }}
          >
            <option value={0}>Tek Çekim</option>
            <option value={2}>2 Taksit</option>
            <option value={3}>3 Taksit</option>
            <option value={6}>6 Taksit</option>
            <option value={9}>9 Taksit</option>
            <option value={12}>12 Taksit</option>
          </select>
        </div>
      </div>

      {/* Hata */}
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#dc2626',
          fontSize: '13px'
        }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Güvenlik Notu */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '12px',
        color: 'var(--text-muted)'
      }}>
        <Lock size={14} style={{ color: '#10b981', flexShrink: 0 }} />
        Kart bilgileriniz 256-bit SSL şifrelemesi ile korunmaktadır. PayTR güvencesiyle işlenmektedir.
      </div>

      {/* Butonlar */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="button"
          className="btn btn-outline"
          style={{ flex: 1 }}
          onClick={onCancel}
          disabled={loading}
        >
          İptal
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          disabled={loading}
        >
          {loading ? (
            <><Loader size={16} className="spin" /> İşleniyor...</>
          ) : (
            <><Lock size={16} /> ₺{order.total?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} Öde</>
          )}
        </button>
      </div>
    </form>
  );
}
