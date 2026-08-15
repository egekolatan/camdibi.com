import React, { useState } from 'react';
import { Mail, Lock, User, Shield, AlertCircle, ArrowRight, Printer, Sparkles, Building, Loader, Phone } from 'lucide-react';
import { authAPI, setToken } from '../utils/api';

export default function AuthGate({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Müşteri');
  const [companyName, setCompanyName] = useState('');
  const [taxOffice, setTaxOffice] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await authAPI.login(email, password);
      } else {
        result = await authAPI.register({ 
          name, 
          email, 
          password, 
          phone: phone || undefined,
          company_name: companyName || undefined,
          tax_office: taxOffice || undefined,
          tax_number: taxNumber || undefined
        });
      }

      // JWT token'ı kaydet
      setToken(result.access_token);
      onLoginSuccess(result.user);
    } catch (err) {
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (type) => {
    setError('');
    if (type === 'admin') {
      setEmail('admin@camdibimatbaa.com');
      setPassword('123456');
      setIsLogin(true);
    } else {
      setEmail('ege@camdibimatbaa.com');
      setPassword('123456');
      setIsLogin(true);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      width: '100vw', 
      backgroundColor: '#f8fafc',
      fontFamily: 'var(--font-sans)',
      overflowX: 'hidden'
    }}>
      {/* Visual Brand Left Panel - White/Light CMYK theme */}
      <div style={{
        flex: 1.2,
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px 60px',
        color: '#0f172a',
        position: 'relative',
        overflow: 'hidden'
      }} className="auth-brand-panel">
        
        {/* CMYK overlapping circles representing modern printing */}
        <div style={{
          position: 'absolute',
          right: '-100px',
          bottom: '-100px',
          width: '500px',
          height: '500px',
          opacity: 0.12,
          pointerEvents: 'none',
          zIndex: 1
        }}>
          {/* Cyan */}
          <div style={{ position: 'absolute', width: '260px', height: '260px', borderRadius: '50%', backgroundColor: '#00ffff', top: '10px', left: '10px', mixBlendMode: 'multiply' }}></div>
          {/* Magenta */}
          <div style={{ position: 'absolute', width: '260px', height: '260px', borderRadius: '50%', backgroundColor: '#ff00ff', top: '10px', right: '10px', mixBlendMode: 'multiply' }}></div>
          {/* Yellow */}
          <div style={{ position: 'absolute', width: '260px', height: '260px', borderRadius: '50%', backgroundColor: '#ffff00', bottom: '10px', left: '110px', mixBlendMode: 'multiply' }}></div>
        </div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '580px' }}>
          {/* Custom Squircle Printer Logo (matches requested image layout exactly) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '16px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.04)'
            }}>
              <Printer size={30} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '22px', fontWeight: '800', color: '#000000', letterSpacing: '-0.5px', lineHeight: '1.05' }}>ÇAMDİBİ</span>
              <span style={{ fontSize: '12px', color: '#475569', fontWeight: '600', letterSpacing: '1px' }}>MATBAACILIK</span>
            </div>
          </div>

          <h2 style={{ 
            fontSize: '44px', 
            fontWeight: '800', 
            lineHeight: '1.15', 
            letterSpacing: '-1.5px', 
            marginBottom: '20px', 
            color: '#0f172a' 
          }}>
            Online Baskı Siparişi ve Canlı Üretim Takibi
          </h2>
          <p style={{ 
            color: '#475569', 
            fontSize: '17px', 
            lineHeight: '1.6', 
            marginBottom: '32px' 
          }}>
            Kartvizitten kurumsal kataloglara, özel etiketlerden broşürlere kadar tüm matbaa ihtiyaçlarınızı online sipariş verin, sipariş aşamalarını anlık olarak izleyin.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#f1f5f9', borderRadius: '50px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
              <Sparkles size={14} style={{ color: '#eab308' }} /> %100 Üretim Garantisi
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#f1f5f9', borderRadius: '50px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
              <Sparkles size={14} style={{ color: '#06b6d4' }} /> Hızlı Kesim & Sevkiyat
            </div>
          </div>
        </div>
      </div>

      {/* Right Login/Signup Form Panel */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '60px 40px', 
        backgroundColor: '#ffffff',
        borderLeft: '1px solid #f1f5f9'
      }}>
        <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '30px', fontWeight: '800', letterSpacing: '-0.8px', marginBottom: '8px', color: '#0f172a' }}>
              {isLogin ? 'Tekrar Hoş Geldiniz' : 'Hesabınızı Oluşturun'}
            </h3>
            <p style={{ color: '#475569', fontSize: '14px' }}>
              {isLogin ? 'Hesabınıza giriş yaparak baskı süreçlerinizi anında izleyin.' : 'Üyelik kaydı oluşturarak kurumsal siparişinizi tamamlayın.'}
            </p>
          </div>

          {/* Form Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', marginBottom: '24px', position: 'relative' }}>
            <button 
              type="button"
              style={{ 
                flex: 1, 
                paddingBottom: '14px', 
                fontWeight: '700', 
                fontSize: '15px', 
                border: 'none', 
                background: 'none', 
                borderBottom: isLogin ? '2px solid #000000' : 'none', 
                color: isLogin ? '#000000' : '#94a3b8', 
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              Giriş Yap
            </button>
            <button 
              type="button"
              style={{ 
                flex: 1, 
                paddingBottom: '14px', 
                fontWeight: '700', 
                fontSize: '15px', 
                border: 'none', 
                background: 'none', 
                borderBottom: !isLogin ? '2px solid #000000' : 'none', 
                color: !isLogin ? '#000000' : '#94a3b8', 
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              Kayıt Ol
            </button>
          </div>

          {error && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '12px 16px', 
              backgroundColor: '#fef2f2', 
              color: '#ef4444', 
              borderRadius: '8px', 
              fontSize: '13px', 
              fontWeight: '600', 
              marginBottom: '20px',
              border: '1px solid #fee2e2'
            }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!isLogin && (
              <>
                <div className="form-group">
                  <label className="form-label">Adınız Soyadınız / Temsilci</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Örn: Ahmet Yılmaz" 
                      required 
                      style={{ paddingLeft: '38px', borderRadius: '8px' }}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>




                <div className="form-group">
                  <label className="form-label">Telefon Numarası</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Örn: 0532 999 88 77" 
                      style={{ paddingLeft: '38px', borderRadius: '8px' }}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Firma Ünvanı (Fatura için)</label>
                  <div style={{ position: 'relative' }}>
                    <Building size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Örn: Çamdibi Matbaacılık A.Ş." 
                      style={{ paddingLeft: '38px', borderRadius: '8px' }}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Vergi Dairesi</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Bornova V.D." 
                      style={{ borderRadius: '8px' }}
                      value={taxOffice}
                      onChange={(e) => setTaxOffice(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vergi Numarası</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="1234567890" 
                      style={{ borderRadius: '8px' }}
                      value={taxNumber}
                      onChange={(e) => setTaxNumber(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">E-Posta Adresi</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="isim@firma.com" 
                  required 
                  style={{ paddingLeft: '38px', borderRadius: '8px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Şifre</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••" 
                  required 
                  style={{ paddingLeft: '38px', borderRadius: '8px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {!isLogin && (
              <div className="form-group" style={{ marginBottom: '8px' }}>
                <label className="form-label">Üyelik Tipi</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{ 
                    flex: 1, 
                    padding: '12px', 
                    border: `1.5px solid ${role === 'Müşteri' ? '#000000' : '#e2e8f0'}`, 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    gap: '8px', 
                    alignItems: 'center', 
                    backgroundColor: role === 'Müşteri' ? '#f8fafc' : 'transparent', 
                    fontSize: '13px', 
                    fontWeight: '600',
                    transition: 'all 0.15s ease'
                  }}>
                    <input type="radio" checked={role === 'Müşteri'} onChange={() => setRole('Müşteri')} style={{ accentColor: '#000000' }} />
                    Müşteri Üyeliği
                  </label>
                  <label style={{ 
                    flex: 1, 
                    padding: '12px', 
                    border: `1.5px solid ${role === 'Yönetici' ? '#000000' : '#e2e8f0'}`, 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    gap: '8px', 
                    alignItems: 'center', 
                    backgroundColor: role === 'Yönetici' ? '#f8fafc' : 'transparent', 
                    fontSize: '13px', 
                    fontWeight: '600',
                    transition: 'all 0.15s ease'
                  }}>
                    <input type="radio" checked={role === 'Yönetici'} onChange={() => setRole('Yönetici')} style={{ accentColor: '#000000' }} />
                    Yönetici Yetkisi
                  </label>
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '12px', padding: '14px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              {loading ? (
                <><Loader size={16} className="spin" /> İşleniyor...</>
              ) : (
                <>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'} <ArrowRight size={16} /></>
              )}
            </button>
          </form>



        </div>
      </div>
    </div>
  );
}
