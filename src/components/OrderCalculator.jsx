import React, { useState, useEffect } from 'react';
import { CreditCard, UploadCloud, CheckCircle, ArrowRight, ArrowLeft, Layers, Percent, FileText, Check } from 'lucide-react';

const PRODUCTS = [
  { id: 'kartvizit', title: 'Kartvizit', basePrice: 250, desc: 'Kurumsal kimliğinizi yansıtın.' },
  { id: 'brosur', title: 'Broşür', basePrice: 650, desc: 'Ürünlerinizi detaylı tanıtın.' },
  { id: 'el-ilani', title: 'El İlanı', basePrice: 400, desc: 'Kampanyalarınızı duyurun.' },
  { id: 'etiket', title: 'Sticker / Etiket', basePrice: 300, desc: 'Ürünlerinizi markalayın.' },
  { id: 'katalog', title: 'Katalog / Dergi', basePrice: 2450, desc: 'Çok sayfalı ürün tanıtımı.' }
];

const SPEC_OPTIONS = {
  kartvizit: {
    papers: [
      { name: '350gr Kuşe Karton', markup: 0 },
      { name: '380gr Mat Kuşe Kağıt', markup: 50 },
      { name: 'Kraft Geri Dönüşümlü', markup: 80 },
      { name: 'Fantazi Tual Karton', markup: 150 }
    ],
    laminations: [
      { name: 'Mat Selefon', markup: 30 },
      { name: 'Parlak Selefon', markup: 30 },
      { name: 'Kabartma Lak + Mat Selefon', markup: 200 },
      { name: 'Selefonsuz', markup: 0 }
    ],
    sizes: [
      { name: 'Standart (8.4 x 5.2 cm)', markup: 0 },
      { name: 'Kare (5.2 x 5.2 cm)', markup: 20 }
    ],
    corners: [
      { name: 'Düz Kesim', markup: 0 },
      { name: 'Oval Kesim', markup: 60 }
    ]
  },
  brosur: {
    papers: [
      { name: '170gr Parlak Kuşe', markup: 0 },
      { name: '130gr Parlak Kuşe', markup: -50 },
      { name: '250gr Kuşe (Kalın)', markup: 120 }
    ],
    laminations: [
      { name: 'Mat Selefon', markup: 80 },
      { name: 'Parlak Selefon', markup: 80 },
      { name: 'Selefonsuz', markup: 0 }
    ],
    sizes: [
      { name: 'A4 Katlamalı', markup: 100 },
      { name: 'A5 Ebat', markup: 0 },
      { name: 'A6 Ebat', markup: -50 }
    ],
    corners: [
      { name: 'Standart Katlamalı', markup: 0 }
    ]
  },
  'el-ilani': {
    papers: [
      { name: '130gr Parlak Kuşe', markup: 0 },
      { name: '170gr Parlak Kuşe', markup: 50 },
      { name: '90gr Parlak Kuşe', markup: -30 }
    ],
    laminations: [
      { name: 'Selefonsuz', markup: 0 }
    ],
    sizes: [
      { name: 'A5 Ebat', markup: 0 },
      { name: 'A4 Ebat', markup: 120 },
      { name: 'A6 Ebat', markup: -40 }
    ],
    corners: [
      { name: 'Düz Kesim', markup: 0 }
    ]
  },
  etiket: {
    papers: [
      { name: 'Kuşe Etiket (Kağıt Bazlı)', markup: 0 },
      { name: 'Şeffaf PP Etiket (Suya Dayanıklı)', markup: 180 },
      { name: 'Opak PP Etiket (Suya Dayanıklı)', markup: 150 }
    ],
    laminations: [
      { name: 'Mat Selefon', markup: 40 },
      { name: 'Parlak Selefon', markup: 40 },
      { name: 'Selefonsuz', markup: 0 }
    ],
    sizes: [
      { name: 'Daire Kesim (5x5 cm)', markup: 0 },
      { name: 'Özel Kesim (Maksimum 8x8 cm)', markup: 150 }
    ],
    corners: [
      { name: 'Özel Kesim', markup: 0 }
    ]
  },
  katalog: {
    papers: [
      { name: 'Kapak 300gr - İç Sayfalar 130gr Kuşe', markup: 0 },
      { name: 'Kapak 350gr - İç Sayfalar 170gr Kuşe', markup: 500 }
    ],
    laminations: [
      { name: 'Mat Selefon (Kapakta)', markup: 100 },
      { name: 'Parlak Selefon (Kapakta)', markup: 100 },
      { name: 'Kısmi Lak + Mat Selefon', markup: 600 }
    ],
    sizes: [
      { name: 'A4 Dikey', markup: 0 },
      { name: 'A5 Dikey', markup: -300 }
    ],
    corners: [
      { name: 'Amerikan Cilt', markup: 0 },
      { name: 'Tel Dikiş (Zımbalı)', markup: -150 }
    ]
  }
};

const QUANTITIES = [100, 250, 500, 1000, 2000, 5000];

export default function OrderCalculator({ addOrder, setActiveTab, prefilledSpecs, setPrefilledSpecs }) {
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  
  // Custom Specs state
  const [paper, setPaper] = useState('');
  const [lamination, setLamination] = useState('');
  const [size, setSize] = useState('');
  const [corner, setCorner] = useState('');
  const [quantity, setQuantity] = useState(1000);

  // Hook to consume prefilled selection from Price List
  useEffect(() => {
    if (prefilledSpecs) {
      const foundProduct = PRODUCTS.find(p => 
        prefilledSpecs.productName.toLowerCase().includes(p.title.toLowerCase()) ||
        p.title.toLowerCase().includes(prefilledSpecs.productName.toLowerCase())
      ) || PRODUCTS[0];
      
      setSelectedProduct(foundProduct);
      setPaper(prefilledSpecs.paper);
      setLamination(prefilledSpecs.lamination);
      setSize(prefilledSpecs.size);
      setQuantity(prefilledSpecs.quantity);
      setStep(2); // Jump straight to configuration step

      // Wipe it out so subsequent user updates work normally
      setPrefilledSpecs(null);
    }
  }, [prefilledSpecs]);

  // File upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Checkout address/payment details
  const [shippingName, setShippingName] = useState('Ege Kolatan');
  const [shippingAddress, setShippingAddress] = useState('Kazımdirik Mah. Fevzi Çakmak Cd. No:45 Bornova / İzmir');
  const [shippingCity, setShippingCity] = useState('İzmir');
  const [paymentMethod, setPaymentMethod] = useState('card'); // card or eft
  const [cardNumber, setCardNumber] = useState('4355 8899 1122 3456');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('321');

  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  const [newOrderId, setNewOrderId] = useState('');

  // Reset specifications when product changes
  useEffect(() => {
    const opts = SPEC_OPTIONS[selectedProduct.id];
    if (opts) {
      setPaper(opts.papers[0]?.name || '');
      setLamination(opts.laminations[0]?.name || '');
      setSize(opts.sizes[0]?.name || '');
      setCorner(opts.corners[0]?.name || '');
    }
  }, [selectedProduct]);

  // Compute live price
  const calculateTotal = () => {
    let price = selectedProduct.basePrice;
    
    // Add markups based on choices
    const opts = SPEC_OPTIONS[selectedProduct.id];
    if (opts) {
      const selectedPaperObj = opts.papers.find(p => p.name === paper);
      const selectedLamObj = opts.laminations.find(l => l.name === lamination);
      const selectedSizeObj = opts.sizes.find(s => s.name === size);
      const selectedCornerObj = opts.corners.find(c => c.name === corner);

      if (selectedPaperObj) price += selectedPaperObj.markup;
      if (selectedLamObj) price += selectedLamObj.markup;
      if (selectedSizeObj) price += selectedSizeObj.markup;
      if (selectedCornerObj) price += selectedCornerObj.markup;
    }

    // Multiply or adjust by quantity index
    const qtyIndex = QUANTITIES.indexOf(quantity);
    const multiplier = 1 + qtyIndex * 0.7; // discount rate per volume tier
    price = price * multiplier;

    return Math.round(price);
  };

  const currentPrice = calculateTotal();
  const kdvPrice = Math.round(currentPrice * 0.20);
  const totalPrice = currentPrice + kdvPrice;

  // File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      simulateUpload(file);
    }
  };

  const simulateUpload = (file) => {
    setUploadFile(file);
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    const orderId = 'CAM-' + Math.floor(100000 + Math.random() * 900000);
    const today = new Date().toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const newOrder = {
      id: orderId,
      productName: selectedProduct.title,
      date: today,
      qty: quantity,
      specs: {
        paper,
        lamination,
        size,
        corner
      },
      status: 'Sipariş Alındı',
      total: totalPrice,
      fileName: uploadFile ? uploadFile.name : 'Müşteri Tasarım Havuzu (Hazır Sablon Seçildi)'
    };

    addOrder(newOrder);
    setNewOrderId(orderId);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="section-card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', padding: '20px', borderRadius: '50%' }}>
            <CheckCircle size={60} />
          </div>
        </div>
        <h2 className="page-heading" style={{ fontSize: '28px', color: 'var(--success)' }}>Siparişiniz Başarıyla Alındı!</h2>
        <p style={{ color: 'var(--text-muted)', margin: '16px 0 24px 0' }}>
          Ödemeniz onaylandı. Siparişiniz <strong>{newOrderId}</strong> referans koduyla sisteme işlendi. Üretim sürecini panelden canlı takip edebilirsiniz.
        </p>
        
        <div style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px', textAlign: 'left', marginBottom: '32px' }}>
          <div className="summary-row"><span>Sipariş No:</span><strong>{newOrderId}</strong></div>
          <div className="summary-row"><span>Ürün:</span><strong>{selectedProduct.title} ({quantity} Adet)</strong></div>
          <div className="summary-row"><span>Toplam Tutar:</span><strong style={{ color: 'var(--primary)' }}>{totalPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</strong></div>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={() => { setActiveTab('dashboard'); }}>Panelim</button>
          <button className="btn btn-primary" onClick={() => {
            setStep(1);
            setUploadFile(null);
            setIsSuccess(false);
            setActiveTab('orders');
          }}>Siparişlerimi Listele</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Wizard Stepper Banner */}
      <div className="stepper">
        <div className={`step-node ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>
          <div className="step-circle">{step > 1 ? <Check size={16} /> : '1'}</div>
          <span className="step-label">Ürün Seçimi</span>
        </div>
        <div className={`step-node ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}>
          <div className="step-circle">{step > 2 ? <Check size={16} /> : '2'}</div>
          <span className="step-label">Özellikler</span>
        </div>
        <div className={`step-node ${step >= 3 ? 'completed' : ''} ${step === 3 ? 'active' : ''}`}>
          <div className="step-circle">{step > 3 ? <Check size={16} /> : '3'}</div>
          <span className="step-label">Tasarım Yükle</span>
        </div>
        <div className={`step-node ${step >= 4 ? 'completed' : ''} ${step === 4 ? 'active' : ''}`}>
          <div className="step-circle">{step > 4 ? <Check size={16} /> : '4'}</div>
          <span className="step-label">Ödeme & Onay</span>
        </div>
      </div>

      <div className="calc-layout">
        {/* Main Work Area */}
        <div className="section-card" style={{ padding: '32px' }}>
          
          {/* STEP 1: Product Selector */}
          {step === 1 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Yazdırmak İstediğiniz Ürünü Seçin</h3>
              <div className="product-selector">
                {PRODUCTS.map(prod => (
                  <div 
                    key={prod.id} 
                    className={`product-card ${selectedProduct.id === prod.id ? 'selected' : ''}`}
                    onClick={() => setSelectedProduct(prod)}
                  >
                    <Layers className="product-icon" />
                    <span className="product-title">{prod.title}</span>
                  </div>
                ))}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>
                Seçilen Ürün Açıklaması: {selectedProduct.desc}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={() => setStep(2)}>
                  Devam Et <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Custom Specifications */}
          {step === 2 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Baskı Özelliklerini Kişiselleştirin</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                {selectedProduct.title} ürünü için kağıt kalınlığı, selefon ve adet seçeneklerini ayarlayın.
              </p>

              <div className="spec-grid">
                {SPEC_OPTIONS[selectedProduct.id]?.papers && (
                  <div className="form-group">
                    <label className="form-label">Kağıt Türü / Kalınlığı</label>
                    <select className="form-select" value={paper} onChange={(e) => setPaper(e.target.value)}>
                      {SPEC_OPTIONS[selectedProduct.id].papers.map(p => (
                        <option key={p.name} value={p.name}>{p.name} {p.markup !== 0 ? `(+${p.markup} TL)` : ''}</option>
                      ))}
                    </select>
                  </div>
                )}

                {SPEC_OPTIONS[selectedProduct.id]?.laminations && (
                  <div className="form-group">
                    <label className="form-label">Kaplama (Selefon / Koruma)</label>
                    <select className="form-select" value={lamination} onChange={(e) => setLamination(e.target.value)}>
                      {SPEC_OPTIONS[selectedProduct.id].laminations.map(l => (
                        <option key={l.name} value={l.name}>{l.name} {l.markup !== 0 ? `(+${l.markup} TL)` : ''}</option>
                      ))}
                    </select>
                  </div>
                )}

                {SPEC_OPTIONS[selectedProduct.id]?.sizes && (
                  <div className="form-group">
                    <label className="form-label">Ebat</label>
                    <select className="form-select" value={size} onChange={(e) => setSize(e.target.value)}>
                      {SPEC_OPTIONS[selectedProduct.id].sizes.map(s => (
                        <option key={s.name} value={s.name}>{s.name} {s.markup !== 0 ? `(+${s.markup} TL)` : ''}</option>
                      ))}
                    </select>
                  </div>
                )}

                {SPEC_OPTIONS[selectedProduct.id]?.corners && (
                  <div className="form-group">
                    <label className="form-label">Kesim / Cilt Detayı</label>
                    <select className="form-select" value={corner} onChange={(e) => setCorner(e.target.value)}>
                      {SPEC_OPTIONS[selectedProduct.id].corners.map(c => (
                        <option key={c.name} value={c.name}>{c.name} {c.markup !== 0 ? `(+${c.markup} TL)` : ''}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Adet / Baskı Miktarı</label>
                  <select className="form-select" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
                    {QUANTITIES.map(q => (
                      <option key={q} value={q}>{q.toLocaleString('tr-TR')} Adet</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Geri Dön
                </button>
                <button className="btn btn-primary" onClick={() => setStep(3)}>
                  Devam Et <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: File Upload */}
          {step === 3 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Tasarımınızı Sisteme Yükleyin</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                Tasarımınızı PDF, CDR, AI veya yüksek kaliteli JPEG/PNG formatında yükleyin. Ebatların 1:1 kesim payına uygun olduğuna emin olun.
              </p>

              <div className="drag-drop-area" onClick={() => document.getElementById('design-file-input').click()}>
                <input 
                  type="file" 
                  id="design-file-input" 
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <UploadCloud className="upload-icon" />
                <p style={{ fontSize: '15px', fontWeight: '600' }}>Tasarım Dosyasını Sürükleyin veya Seçin</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>PDF, ZIP, CDR, AI, PSD, JPG (Maks. 50MB)</p>
              </div>

              {uploadFile && (
                <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                  <div className="summary-row" style={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600' }}>{uploadFile.name}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', backgroundColor: isUploading ? 'var(--primary)' : 'var(--success)', width: `${uploadProgress}%`, transition: 'width 0.1s ease' }}></div>
                  </div>
                  <p style={{ fontSize: '12px', marginTop: '6px', color: isUploading ? 'var(--text-muted)' : 'var(--success)', fontWeight: '600' }}>
                    {isUploading ? `Yükleniyor... %${uploadProgress}` : 'Dosya başarıyla yüklendi ve doğrulanıyor.'}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                <button className="btn btn-outline" onClick={() => setStep(2)}>
                  <ArrowLeft size={16} /> Geri Dön
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setStep(4)}
                  disabled={isUploading}
                >
                  Dosyasız Devam Et (Onay Havuzu) <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Shipping & Payment Info */}
          {step === 4 && (
            <form onSubmit={handleCheckoutSubmit}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Teslimat ve Ödeme Detayları</h3>
              
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>1. Alıcı ve Adres Bilgileri</h4>
              <div className="spec-grid" style={{ marginTop: '0', marginBottom: '24px' }}>
                <div className="form-group">
                  <label className="form-label">Adı Soyadı</label>
                  <input type="text" className="form-input" required value={shippingName} onChange={(e) => setShippingName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Şehir</label>
                  <input type="text" className="form-input" required value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label className="form-label">Açık Adres</label>
                <textarea className="form-input" rows="2" style={{ resize: 'none' }} required value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)}></textarea>
              </div>

              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>2. Ödeme Yöntemi</h4>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <label style={{ flex: 1, padding: '16px', border: `2px solid ${paymentMethod === 'card' ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: paymentMethod === 'card' ? 'var(--primary-light)' : 'transparent' }}>
                  <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} style={{ accentColor: 'var(--primary)' }} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>Kredi / Banka Kartı</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Anında üretim başlangıcı</div>
                  </div>
                </label>
                <label style={{ flex: 1, padding: '16px', border: `2px solid ${paymentMethod === 'eft' ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: paymentMethod === 'eft' ? 'var(--primary-light)' : 'transparent' }}>
                  <input type="radio" name="payment" checked={paymentMethod === 'eft'} onChange={() => setPaymentMethod('eft')} style={{ accentColor: 'var(--primary)' }} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>Havale / EFT</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Hesaba para yatınca başlar</div>
                  </div>
                </label>
              </div>

              {paymentMethod === 'card' ? (
                <div className="spec-grid" style={{ marginTop: '0', marginBottom: '32px' }}>
                  <div className="form-group">
                    <label className="form-label">Kart Numarası</label>
                    <input type="text" className="form-input" placeholder="4355 8899 1122 3456" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label">S.K.T</label>
                      <input type="text" className="form-input" placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} required />
                    </div>
                    <div>
                      <label className="form-label">CVV</label>
                      <input type="text" className="form-input" placeholder="123" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} required />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '13px', marginBottom: '32px' }}>
                  <p><strong>Banka Alıcı Adı:</strong> Çamdibi Matbaa ve Yayıncılık Ltd. Şti.</p>
                  <p><strong>Garanti Bankası IBAN:</strong> TR44 0006 2000 0001 2345 6789 99</p>
                  <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Açıklama alanına sipariş verdikten sonra oluşacak referans numarasını yazmayı unutmayınız.</p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" className="btn btn-outline" onClick={() => setStep(3)}>
                  <ArrowLeft size={16} /> Geri Dön
                </button>
                <button type="submit" className="btn btn-primary">
                  Öde ve Sipariş Oluştur ({totalPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })})
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Dynamic Cart Summary Sidebar */}
        <div className="checkout-sticky">
          <div className="summary-card">
            <h3 className="summary-title">Sipariş Özeti</h3>
            
            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Ürün Tipi:</span>
              <strong style={{ color: 'var(--text-main)' }}>{selectedProduct.title}</strong>
            </div>

            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Adet:</span>
              <strong>{quantity} Adet</strong>
            </div>

            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Kullanılan Kağıt:</span>
              <span style={{ maxWidth: '180px', textAlign: 'right', fontSize: '13px', fontWeight: '500' }}>{paper}</span>
            </div>

            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Selefon / Koruma:</span>
              <span style={{ maxWidth: '180px', textAlign: 'right', fontSize: '13px', fontWeight: '500' }}>{lamination}</span>
            </div>

            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Kesim Türü:</span>
              <span style={{ maxWidth: '180px', textAlign: 'right', fontSize: '13px', fontWeight: '500' }}>{corner}</span>
            </div>

            {uploadFile && (
              <div className="summary-row" style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '10px', marginTop: '10px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><FileText size={14} /> Tasarım:</span>
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px', fontSize: '12px' }}>{uploadFile.name}</span>
              </div>
            )}

            <div className="summary-row" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px' }}>
              <span>Ara Toplam:</span>
              <span>{currentPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
            </div>

            <div className="summary-row">
              <span>KDV (%20):</span>
              <span>{kdvPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
            </div>

            <div className="summary-row">
              <span>Kargo / Teslimat:</span>
              <span style={{ color: 'var(--success)', fontWeight: '600' }}>Ücretsiz</span>
            </div>

            <div className="summary-row total">
              <span>Toplam Tutar:</span>
              <span>{totalPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
