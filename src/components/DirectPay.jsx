import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, FileText, CheckCircle, Clock, ShieldAlert, ArrowRight, UserCheck, Receipt } from 'lucide-react';
import { paymentsAPI } from '../utils/api';

export default function DirectPay({ currentUser, currentBalance, updateBalance }) {
  const [payAmount, setPayAmount] = useState('');
  const [description, setDescription] = useState('');
  const [billingTitle, setBillingTitle] = useState(currentUser.name || '');
  const [taxOffice, setTaxOffice] = useState('Bornova V.D.');
  const [taxNumber, setTaxNumber] = useState('4829102931');
  const [phone, setPhone] = useState(currentUser.phone || '0532 999 88 77');

  // Credit Card Info
  const [cardHolder, setCardHolder] = useState(currentUser.name || '');
  const [cardNumber, setCardNumber] = useState('4355 8899 1122 3456');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('321');

  // Interactive Payment State
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize direct pay history from API
  useEffect(() => {
    paymentsAPI.history()
      .then(setPaymentHistory)
      .catch(console.error);
  }, [currentUser]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!payAmount || Number(payAmount) <= 0) {
      alert('Lütfen geçerli bir ödeme tutarı giriniz.');
      return;
    }

    setIsProcessing(true);

    try {
      await updateBalance(Number(payAmount));
      setIsSuccess(true);
      
      const history = await paymentsAPI.history();
      setPaymentHistory(history);
    } catch (err) {
      alert('Ödeme başarısız: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setPayAmount('');
    setDescription('');
    setIsSuccess(false);
  };

  return (
    <div className="calc-layout">
      {/* Left side: Detailed configuration form */}
      <div className="section-card" style={{ padding: '32px' }}>
        
        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', padding: '16px', borderRadius: '50%' }}>
                <CheckCircle size={56} />
              </div>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--success)', marginBottom: '12px' }}>Ödeme Başarıyla Tamamlandı!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px', maxWidth: '440px', marginInline: 'auto' }}>
              Cari hesabınıza <strong>{Number(payAmount).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</strong> tutarındaki ödemeniz işlenmiştir. Borç bakiyeniz güncellenmiştir.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={handleReset}>Yeni Ödeme Yap</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePayment}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Cari Hesap Hızlı Ödeme</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
              Fatura veya cari hesap borçlarınızı online olarak tek çekim kredi kartı veya banka kartı ile güvenle ödeyebilirsiniz.
            </p>

            {/* 1. Payment amount info */}
            <h4 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}><DollarSign size={16} /> 1. Ödeme Tutarı & Açıklama</h4>
            
            <div className="spec-grid" style={{ marginTop: '0', marginBottom: '24px' }}>
              <div className="form-group">
                <label className="form-label">Ödenecek Tutar (TL)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  required 
                  placeholder="0.00"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Ödeme Açıklaması</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Örn: 2026/08 Fatura No: 48201" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
            </div>

            {/* 2. Corporate billing credentials */}
            <h4 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}><UserCheck size={16} /> 2. Fatura ve İletişim Bilgileri</h4>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Firma Ünvanı / Müşteri Adı</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                value={billingTitle} 
                onChange={(e) => setBillingTitle(e.target.value)}
                disabled={isProcessing}
              />
            </div>

            <div className="spec-grid" style={{ marginTop: '0', marginBottom: '24px' }}>
              <div className="form-group">
                <label className="form-label">Vergi Dairesi</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={taxOffice} 
                  onChange={(e) => setTaxOffice(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Vergi Numarası / T.C.</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={taxNumber} 
                  onChange={(e) => setTaxNumber(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
            </div>

            {/* 3. Secure Card inputs */}
            <h4 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}><CreditCard size={16} /> 3. Kart Bilgileri (256-Bit SSL)</h4>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Kart Üzerindeki İsim</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                value={cardHolder} 
                onChange={(e) => setCardHolder(e.target.value)}
                disabled={isProcessing}
              />
            </div>

            <div className="spec-grid" style={{ marginTop: '0', marginBottom: '32px' }}>
              <div className="form-group">
                <label className="form-label">Kart Numarası</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={cardNumber} 
                  onChange={(e) => setCardNumber(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">S.K.T</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="AA/YY" 
                    required 
                    value={cardExpiry} 
                    onChange={(e) => setCardExpiry(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <label className="form-label">CVV</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="123" 
                    required 
                    value={cardCvv} 
                    onChange={(e) => setCardCvv(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }} disabled={isProcessing}>
              {isProcessing ? 'Güvenli Ödeme İşleniyor...' : 'Ödemeyi Tamamla'} <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* History segment */}
        <div style={{ marginTop: '40px', borderTop: '1px solid var(--border-color)', paddingTop: '32px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Receipt size={16} /> Son Cari Ödemeleriniz</h4>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Referans No</th>
                  <th>Tarih</th>
                  <th>Açıklama</th>
                  <th>Ödeme Şekli</th>
                  <th>Tutar</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map(pay => (
                  <tr key={pay.id}>
                    <td style={{ fontWeight: '700' }}>{pay.id}</td>
                    <td>{pay.date}</td>
                    <td>{pay.desc}</td>
                    <td>{pay.type}</td>
                    <td style={{ fontWeight: '600' }}>{pay.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                    <td><span className="badge success"><CheckCircle size={12} /> {pay.status}</span></td>
                  </tr>
                ))}
                {paymentHistory.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      Kayıtlı cari ödeme bulunmuyor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Right side: Balance and Summary block */}
      <div>
        <div className="summary-card">
          <h3 className="summary-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={18} /> Cari Hesap Bakiye Özeti</h3>
          
          <div className="summary-row" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Toplam Borç Bakiye:</span>
            <strong style={{ fontSize: '18px', color: currentBalance > 0 ? 'var(--danger)' : 'var(--success)' }}>
              {currentBalance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </strong>
          </div>

          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
            <ShieldAlert size={16} style={{ flexShrink: 0, color: 'var(--warning)' }} />
            <span>Kredi kartı ile yapacağınız ödemeler anında cari hesabınıza yansıyarak onay bekleyen siparişlerinizi baskıya sevk eder.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
