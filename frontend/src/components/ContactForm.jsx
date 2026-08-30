import React, { useState } from 'react';
import { Send, CheckCircle2, Phone, MessageCircle } from 'lucide-react';
import { siteConfig } from '../data/siteData';

export const ContactForm = ({ title = "Kirim Pesan Sekarang" }) => {
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    no_whatsapp: '',
    lokasi: '',
    kategori: 1,
    keterangan: ''
  });
  const kategoriOptions = [
    { id: 1, label: 'Instalasi jaring' },
    { id: 2, label: 'Rumput Sintetis Taman' },
    { id: 3, label: 'Vertical Garden' },
    { id: 4, label: 'Lapangan Futsal' },
    { id: 5, label: 'Mini Soccer' },
    { id: 6, label: 'Mini Golf' },
    { id: 7, label: 'Padel & Tenis' },
    { id: 8, label: 'Lainnya' }
  ];
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    }
    if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned;
    }
    return cleaned;
  };

  const generateWhatsAppMessage = () => {
    const kategoriLabel = kategoriOptions.find(k => k.id === formData.kategori)?.label || formData.kategori;
    const timestamp = new Date().toLocaleDateString('id-ID', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    
    const messageParts = [
      '📋 *FORMULIR KONSULTASI ADINKO & GHAZISPORTSHUB*',
      '',
      `📅 Tanggal: ${timestamp}`,
      '',
      '👤 *Data Konsultan:*',
      `• Nama: ${formData.nama_lengkap}`,
      `• WhatsApp: ${formData.no_whatsapp}`,
      `• Lokasi: ${formData.lokasi}`,
      '',
      '🎯 *Detail Kebutuhan:*',
      `• Layanan: ${kategoriLabel}`,
      `• Keterangan: ${formData.keterangan || '(Tidak ada keterangan tambahan)'}`,
      '',
      '✅ Mohon hubungi saya untuk survey dan penawaran terbaik.'
    ];
    
    return messageParts.join('%0A');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === 'kategori'
      ? Number(value)
      : name === 'no_whatsapp'
        ? value.replace(/\D/g, '')
        : value;

    setFormData(prev => ({ ...prev, [name]: nextValue }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.nama_lengkap.trim() || !formData.no_whatsapp.trim() || !formData.lokasi.trim()) {
      setError('Mohon isi semua field yang diperlukan');
      return;
    }
    
    const formattedPhone = formatPhoneNumber(formData.no_whatsapp);
    const message = generateWhatsAppMessage();

    // Post to backend
    const apiBase = import.meta.env.VITE_API_URL || '';

    try {
      const res = await fetch(`${apiBase}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        console.error('Failed to submit contact', res.statusText);
      }
    } catch (err) {
      console.error('Error posting contact', err);
    } finally {
      setSubmitted(true);
      // Open WhatsApp after small feedback delay
      setTimeout(() => {
        window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
      }, 500);
    }
  };

  return (
    <div className="form-card">
      <h3 className="form-title">{title}</h3>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '30px 20px', background: '#FFFFFF', borderRadius: '12px' }}>
          <CheckCircle2 size={48} color="#486F0C" style={{ margin: '0 auto 12px auto' }} />
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#121212' }}>Pesan Anda Telah Disiapkan! ✨</h4>
          <p style={{ fontSize: '0.9rem', color: '#667068', marginTop: '6px' }}>
            Membuka WhatsApp untuk mengirim detail konsultasi lengkap ke tim kami...
          </p>
          <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '12px' }}>
            💡 Tim kami biasanya merespons dalam 1 jam
          </p>
          <button 
            type="button" 
            onClick={() => { setSubmitted(false); setError(''); }}
            style={{ marginTop: '18px', color: '#486F0C', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
          >
            ← Kirim pesan baru
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="nama_lengkap">Nama Lengkap</label>
            <input
              id="nama_lengkap"
              type="text"
              name="nama_lengkap"
              required
              className="form-input"
              placeholder="Nama Anda"
              value={formData.nama_lengkap}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="no_whatsapp">No. WhatsApp</label>
            <input
              id="no_whatsapp"
              type="tel"
              name="no_whatsapp"
              required
              inputMode="numeric"
              pattern="[0-9]+"
              maxLength={15}
              className="form-input"
              placeholder="0822-xxxx-xxxx"
              value={formData.no_whatsapp}
              onChange={handleChange}
            />
            <small style={{ display: 'block', marginTop: '4px', color: '#667068', fontSize: '0.8rem' }}>
              Nomor tanpa +62, boleh dengan 0 di depan atau angka saja
            </small>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="lokasi">Lokasi Proyek</label>
            <input
              id="lokasi"
              type="text"
              name="lokasi"
              required
              className="form-input"
              placeholder="Kota / Kecamatan"
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
              {kategoriOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="keterangan">Keterangan</label>
            <textarea
              id="keterangan"
              name="keterangan"
              className="form-textarea"
              placeholder="Ceritakan detail kebutuhan anda..."
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
                const formattedPhone = formatPhoneNumber(formData.no_whatsapp || siteConfig.contacts.directWaNumber);
                window.open(`tel:+${formattedPhone}`, '_self');
              }}
              className="btn-form-submit"
              style={{ background: '#f0f0f0', color: '#111827' }}
              title="Hubungi langsung via telepon"
            >
              <span>Telepon</span>
              <Phone size={15} />
            </button>
            <button type="submit" className="btn-form-submit">
              <span>Kirim ke WhatsApp</span>
              <MessageCircle size={15} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
