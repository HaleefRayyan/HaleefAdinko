import React, { useState } from 'react';
import { CheckCircle2, Phone, MessageCircle } from 'lucide-react';
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
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const generateWhatsAppMessage = () => {
    const matchedCategory = categories.find(
      (k) => (k.id || k.idkategori_layanan) === Number(formData.kategori)
    );
    const kategoriLabel = matchedCategory?.kategori_layanan || 'Layanan Umum';
    const timestamp = new Date().toLocaleDateString('id-ID', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

    const messageParts = [
      `📋 *FORMULIR KONSULTASI ${siteSettings.site_name || 'ADINKO & GHAZISPORTSHUB'}*`,
      '',
      `📅 Tanggal: ${timestamp}`,
      '',
      '👤 *Data Klien:*',
      `• Nama: ${formData.nama_lengkap}`,
      `• WhatsApp Klien: ${formData.no_whatsapp}`,
      `• Lokasi Proyek: ${formData.lokasi}`,
      '',
      '🎯 *Detail Kebutuhan:*',
      `• Layanan: ${kategoriLabel}`,
      `• Keterangan: ${formData.keterangan || '(Tidak ada keterangan tambahan)'}`,
      '',
      '✅ Mohon hubungi saya untuk survey dan penawaran terbaik.'
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama_lengkap.trim() || !formData.no_whatsapp.trim() || !formData.lokasi.trim()) {
      setError('Mohon lengkapi Nama, Nomor WhatsApp, dan Lokasi Proyek.');
      return;
    }

    setSending(true);
    const targetCompanyPhone = cleanPhone(siteSettings.whatsapp);
    const messageText = generateWhatsAppMessage();

    // Post inquiry lead to backend database
    try {
      await fetch(`${apiBase}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          kategori: Number(formData.kategori) || 1
        })
      });
    } catch (err) {
      console.warn('Backend contact save error (proceeding to WhatsApp):', err);
    } finally {
      setSending(false);
      setSubmitted(true);
      // Open WhatsApp chat to Company Phone number
      setTimeout(() => {
        const waUrl = `https://wa.me/${targetCompanyPhone}?text=${encodeURIComponent(messageText)}`;
        window.open(waUrl, '_blank');
      }, 400);
    }
  };

  return (
    <div className="form-card">
      <h3 className="form-title">{title}</h3>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '30px 20px', background: '#FFFFFF', borderRadius: '12px' }}>
          <CheckCircle2 size={48} color="#1d4d2d" style={{ margin: '0 auto 12px auto' }} />
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#121212' }}>Pesan Anda Telah Disiapkan! ✨</h4>
          <p style={{ fontSize: '0.9rem', color: '#667068', marginTop: '6px' }}>
            Membuka WhatsApp untuk mengirim detail konsultasi langsung ke tim {siteSettings.site_name || 'Adinko & GhaziSportsHub'}...
          </p>
          <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '12px' }}>
            💡 Tim kami biasanya merespons dalam 1 jam
          </p>
          <button 
            type="button" 
            onClick={() => { setSubmitted(false); setError(''); }}
            style={{ marginTop: '18px', color: '#1d4d2d', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', background: 'none', border: 'none' }}
          >
            ← Kirim pesan baru
          </button>
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button 
              type="button" 
              onClick={() => {
                const companyPhone = cleanPhone(siteSettings.whatsapp);
                window.open(`tel:+${companyPhone}`, '_self');
              }}
              className="btn-form-submit"
              style={{ background: '#f0f0f0', color: '#111827' }}
              title="Hubungi langsung via telepon"
            >
              <span>Telepon Langsung</span>
              <Phone size={15} />
            </button>
            <button type="submit" disabled={sending} className="btn-form-submit">
              <span>{sending ? 'Menyiapkan...' : 'Kirim ke WhatsApp'}</span>
              <MessageCircle size={15} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

