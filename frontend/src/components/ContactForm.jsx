import React, { useState } from 'react';
import { CheckCircle2, Phone, MessageCircle, Copy, Check, ArrowRight, RotateCcw, ExternalLink } from 'lucide-react';
import { useSiteContext } from '../context/SiteContext';

export const ContactForm = ({ title = "Kirim Pesan Sekarang" }) => {
  const { siteSettings, categories, apiBase, cleanPhone } = useSiteContext();

  const [formData, setFormData] = useState({
    nama_lengkap: '',
    no_whatsapp: '',
    lokasi: '',
    kategori: 1,
    keterangan: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const generateWhatsAppMessage = (data = formData) => {
    const matchedCategory = categories.find(
      (k) => (k.id || k.idkategori_layanan) === Number(data.kategori)
    );
    const kategoriLabel = matchedCategory?.kategori_layanan || 'Layanan Umum';
    const timestamp = new Date().toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const messageParts = [
      `FORMULIR KONSULTASI ${siteSettings.site_name || 'ADINKO & GHAZISPORTSHUB'}`,
      '',
      `Waktu: ${timestamp}`,
      '',
      'DATA KLIEN:',
      `Nama Lengkap: ${data.nama_lengkap}`,
      `No. WhatsApp: ${data.no_whatsapp}`,
      `Lokasi Proyek: ${data.lokasi}`,
      '',
      'DETAIL KEBUTUHAN:',
      `Kategori Layanan: ${kategoriLabel}`,
      `Keterangan/Ukuran: ${data.keterangan ? data.keterangan : '-'}`
    ];

    return messageParts.join('\n');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === 'kategori'
      ? Number(value)
      : name === 'no_whatsapp'
        ? value.replace(/\D/g, '')
        : value;

    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (error) setError('');
  };

  const handleCopyMessage = () => {
    if (!submittedData) return;
    const msg = generateWhatsAppMessage(submittedData);
    navigator.clipboard.writeText(msg).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const DEST_WA = '6282187515651';

  const handleOpenWhatsApp = () => {
    if (!submittedData) return;
    const targetCompanyPhone = cleanPhone(siteSettings.whatsapp) || DEST_WA;
    const messageText = generateWhatsAppMessage(submittedData);
    const waUrl = `https://wa.me/${targetCompanyPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama_lengkap.trim() || !formData.no_whatsapp.trim() || !formData.lokasi.trim()) {
      setError('Mohon lengkapi Nama Lengkap, Nomor WhatsApp, dan Lokasi Proyek.');
      return;
    }

    setSending(true);
    const currentData = { ...formData };
    setSubmittedData(currentData);

    // Save lead to backend database
    try {
      await fetch(`${apiBase}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentData,
          kategori: Number(currentData.kategori) || 1
        })
      });
    } catch (err) {
      console.warn('Backend contact save error (proceeding to WhatsApp):', err);
    } finally {
      setSending(false);
      setSubmitted(true);

      // Auto trigger WhatsApp open in background tab
      const targetCompanyPhone = cleanPhone(siteSettings.whatsapp) || DEST_WA;
      const messageText = generateWhatsAppMessage(currentData);
      setTimeout(() => {
        const waUrl = `https://wa.me/${targetCompanyPhone}?text=${encodeURIComponent(messageText)}`;
        window.open(waUrl, '_blank');
      }, 500);
    }
  };

  const getSelectedCategoryName = (kategoriId) => {
    const cat = categories.find((c) => (c.id || c.idkategori_layanan) === Number(kategoriId));
    return cat?.kategori_layanan || 'Layanan Rumput Sintetis & Olahraga';
  };

  return (
    <div className="form-card">
      <h3 className="form-title">{submitted ? 'Konfirmasi Pesan Otomatis' : title}</h3>

      {submitted && submittedData ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header Success Badge */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            background: '#ecfdf5', 
            border: '1.5px solid #a7f3d0', 
            padding: '14px 16px', 
            borderRadius: '14px' 
          }}>
            <CheckCircle2 size={24} color="#059669" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#065f46', margin: 0 }}>
                Pesan Konsultasi Berhasil Dibuat!
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#047857', margin: '2px 0 0' }}>
                Pesan otomatis di bawah siap diteruskan ke WhatsApp Customer Care kami.
              </p>
            </div>
          </div>

          {/* WhatsApp Chat Preview Bubble */}
          <div style={{
            background: '#F9FAFB',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '16px 18px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '1px solid #F3F4F6'
            }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--green-700, #1d4d2d)', marginBottom: '10px', borderBottom: '1px solid #f3f4f6', paddingBottom: '6px' }}>
                FORMULIR KONSULTASI {siteSettings.site_name || 'ADINKO & GHAZISPORTSHUB'}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.86rem', color: '#1f2937', lineHeight: 1.6 }}>
                <div>
                  <span style={{ color: '#6b7280', fontWeight: 600 }}>Nama Lengkap: </span>
                  <strong>{submittedData.nama_lengkap}</strong>
                </div>
                <div>
                  <span style={{ color: '#6b7280', fontWeight: 600 }}>No. WhatsApp: </span>
                  <strong>{submittedData.no_whatsapp}</strong>
                </div>
                <div>
                  <span style={{ color: '#6b7280', fontWeight: 600 }}>Lokasi Proyek: </span>
                  <strong>{submittedData.lokasi}</strong>
                </div>
                <div>
                  <span style={{ color: '#6b7280', fontWeight: 600 }}>Kategori Layanan: </span>
                  <span style={{ background: '#ecfdf5', color: '#065f46', padding: '2px 8px', borderRadius: '50px', fontWeight: 700, fontSize: '0.8rem' }}>
                    {getSelectedCategoryName(submittedData.kategori)}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#6b7280', fontWeight: 600 }}>Keterangan/Ukuran: </span>
                  <span>{submittedData.keterangan || '-'}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right', marginTop: '10px', fontSize: '0.75rem', color: '#9ca3af' }}>
                Disiapkan otomatis
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
            <button 
              type="button" 
              onClick={handleOpenWhatsApp}
              className="btn-primary-hero"
              style={{
                width: '100%',
                justifyContent: 'center',
                background: '#25D366',
                color: '#FFFFFF',
                boxShadow: '0 6px 20px rgba(37, 211, 102, 0.35)',
                padding: '13px 20px',
                fontSize: '0.92rem'
              }}
            >
              <MessageCircle size={18} />
              <span>Buka WhatsApp Sekarang</span>
              <ExternalLink size={15} />
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button" 
                onClick={handleCopyMessage}
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  borderRadius: '50px',
                  background: copied ? '#ecfdf5' : '#FFFFFF',
                  color: copied ? '#065f46' : '#374151',
                  border: '1.5px solid',
                  borderColor: copied ? '#059669' : '#e5e7eb',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Pesan Tersalin!' : 'Salin Teks Pesan'}</span>
              </button>

              <button 
                type="button" 
                onClick={() => {
                  setSubmitted(false);
                  setSubmittedData(null);
                  setError('');
                }}
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  borderRadius: '50px',
                  background: '#f3f4f6',
                  color: '#4b5563',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.2s'
                }}
              >
                <RotateCcw size={15} />
                <span>Kirim Pesan Baru</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="nama_lengkap">Nama Lengkap *</label>
            <input
              id="nama_lengkap"
              type="text"
              name="nama_lengkap"
              required
              className="form-input"
              placeholder="Contoh: Budi Santoso"
              value={formData.nama_lengkap}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="no_whatsapp">No. WhatsApp Anda *</label>
            <input
              id="no_whatsapp"
              type="tel"
              name="no_whatsapp"
              required
              inputMode="numeric"
              pattern="[0-9]+"
              maxLength={15}
              className="form-input"
              placeholder="Contoh: 081234567890"
              value={formData.no_whatsapp}
              onChange={handleChange}
            />
            <small style={{ display: 'block', marginTop: '4px', color: '#667068', fontSize: '0.8rem' }}>
              Masukkan nomor aktif Anda untuk konfirmasi survei / penawaran
            </small>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="lokasi">Lokasi Proyek *</label>
            <input
              id="lokasi"
              type="text"
              name="lokasi"
              required
              className="form-input"
              placeholder="Kota / Kecamatan (Contoh: Marpoyan Damai, Pekanbaru)"
              value={formData.lokasi}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="kategori">Kebutuhan Layanan</label>
            <select
              id="kategori"
              name="kategori"
              className="form-select"
              value={formData.kategori}
              onChange={handleChange}
            >
              {categories.map((opt) => {
                const optId = opt.id || opt.idkategori_layanan;
                return (
                  <option key={optId} value={optId}>
                    {opt.kategori_layanan}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="keterangan">Keterangan / Detail Kebutuhan</label>
            <textarea
              id="keterangan"
              name="keterangan"
              className="form-textarea"
              placeholder="Ceritakan detail kebutuhan ukuran, jenis rumput, atau fasilitas..."
              value={formData.keterangan}
              onChange={handleChange}
            />
          </div>

          {error && (
            <div style={{ marginBottom: '16px', padding: '12px', background: '#FEE2E2', color: '#991B1B', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              onClick={() => {
                const companyPhone = cleanPhone(siteSettings.whatsapp);
                window.open(`tel:+${companyPhone}`, '_self');
              }}
              className="btn-form-submit"
              style={{ background: '#f0f0f0', color: '#111827', flex: '1 1 140px', justifyContent: 'center' }}
              title="Hubungi langsung via telepon"
            >
              <span>Telepon</span>
              <Phone size={15} />
            </button>
            <button 
              type="submit" 
              disabled={sending} 
              className="btn-form-submit"
              style={{ flex: '1 1 180px', justifyContent: 'center' }}
            >
              <span>{sending ? 'Menyiapkan...' : 'Kirim ke WhatsApp'}</span>
              <MessageCircle size={15} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

