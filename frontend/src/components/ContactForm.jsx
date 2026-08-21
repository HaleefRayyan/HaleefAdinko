import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === 'kategori'
      ? Number(value)
      : name === 'no_whatsapp'
        ? value.replace(/\D/g, '')
        : value;

    setFormData(prev => ({ ...prev, [name]: nextValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare message for WhatsApp
    const kategoriLabel = kategoriOptions.find(k => k.id === formData.kategori)?.label || formData.kategori;
    const message = `Halo Adinko & GhaziSportsHub,%0A%0A*Konsultasi Proyek Baru*%0A- *Nama:* ${encodeURIComponent(formData.nama_lengkap)}%0A- *No. WhatsApp:* ${encodeURIComponent(formData.no_whatsapp)}%0A- *Lokasi Proyek:* ${encodeURIComponent(formData.lokasi)}%0A- *Kebutuhan Layanan:* ${encodeURIComponent(kategoriLabel)}%0A- *Keterangan:* ${encodeURIComponent(formData.keterangan || '-')}%0A%0AMohon info estimasi dan penjadwalan survei. Terima kasih.`;

    // Post to backend; use Vite env or fallback to relative path (works with proxy)
    const apiBase = import.meta.env.VITE_API_URL || '';

    (async () => {
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
          window.open(`https://wa.me/${siteConfig.contacts.directWaNumber}?text=${message}`, '_blank');
        }, 400);
      }
    })();
  };

  return (
    <div className="form-card">
      <h3 className="form-title">{title}</h3>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '30px 20px', background: '#FFFFFF', borderRadius: '12px' }}>
          <CheckCircle2 size={48} color="#486F0C" style={{ margin: '0 auto 12px auto' }} />
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#121212' }}>Pesan Anda Telah Disiapkan!</h4>
          <p style={{ fontSize: '0.9rem', color: '#667068', marginTop: '6px' }}>
            Membuka WhatsApp untuk mengirim detail konsultasi langsung ke tim kami...
          </p>
          <button 
            type="button" 
            onClick={() => setSubmitted(false)}
            style={{ marginTop: '18px', color: '#486F0C', fontWeight: 600, fontSize: '0.85rem' }}
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="submit" className="btn-form-submit">
              <span>Kirim Pesan</span>
              <Send size={15} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
