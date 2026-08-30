import React, { useState } from 'react';

const initialData = {
  heroTitle: 'Bangun ruang luar yang lebih indah dan fungsional',
  heroSubtitle: 'Kita membantu Anda menghadirkan taman, lapangan, dan ruang olahraga yang modern, kuat, dan nyaman digunakan.',
  ctaPrimary: 'Konsultasi Gratis',
  ctaSecondary: 'Lihat Portofolio',
  featureTitle: 'Layanan utama kami'
};

export const AdminHomeSettings = () => {
  const [form, setForm] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Hero section berhasil diperbarui (contoh UI demo).');
  };

  return (
    <div>
      <h2 style={pageTitle}>Kelola Halaman Home</h2>
      <p style={pageSubtitle}>Ubah judul utama, CTA, dan konten landing page utama.</p>

      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'grid', gap: '18px' }}>
          <Field label="Judul Hero" name="heroTitle" value={form.heroTitle} onChange={handleChange} />
          <Field label="Subjudul Hero" name="heroSubtitle" value={form.heroSubtitle} onChange={handleChange} />
          <Field label="CTA Utama" name="ctaPrimary" value={form.ctaPrimary} onChange={handleChange} />
          <Field label="CTA Sekunder" name="ctaSecondary" value={form.ctaSecondary} onChange={handleChange} />
          <Field label="Judul Feature" name="featureTitle" value={form.featureTitle} onChange={handleChange} />
        </div>

        <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" style={{ background: '#1d4d2d', color: '#fff', borderRadius: '12px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>
            Simpan Home Section
          </button>
        </div>
      </form>
    </div>
  );
};

const Field = ({ label, name, value, onChange }) => (
  <div>
    <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: 600 }}>{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      style={{ width: '100%', padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
    />
  </div>
);

const pageTitle = { margin: 0, fontSize: '2rem', fontWeight: 800, color: '#111827' };
const pageSubtitle = { margin: '8px 0 20px', color: '#6b7280' };
