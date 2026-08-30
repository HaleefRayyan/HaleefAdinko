import React, { useState } from 'react';

const initialData = {
  siteName: 'Haleef Adinko & GhaziSportsHub',
  tagline: 'Jasa instalasi, taman, lapangan, dan project sport arena',
  email: 'hello@haleefadinko.com',
  whatsapp: '6281234567890',
  address: 'Bandung, Indonesia',
  primaryColor: '#1d4d2d',
  secondaryColor: '#d4a72c',
  seoTitle: 'Haleef Adinko | Solusi Lapangan & Taman Modern',
  seoDescription: 'Menyediakan layanan instalasi, rumput sintetis, taman, dan project olahraga yang modern.'
};

export const AdminSiteSettings = () => {
  const [form, setForm] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Konfigurasi website berhasil disimpan (contoh UI demo).');
  };

  return (
    <div>
      <h2 style={pageTitle}>Pengaturan Website</h2>
      <p style={pageSubtitle}>Atur branding, kontak, dan SEO utama website.</p>

      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
          <Field label="Nama Website" name="siteName" value={form.siteName} onChange={handleChange} />
          <Field label="Tagline" name="tagline" value={form.tagline} onChange={handleChange} />
          <Field label="Email" name="email" value={form.email} onChange={handleChange} />
          <Field label="WhatsApp" name="whatsapp" value={form.whatsapp} onChange={handleChange} />
          <Field label="Alamat" name="address" value={form.address} onChange={handleChange} />
          <Field label="Warna Utama" name="primaryColor" value={form.primaryColor} onChange={handleChange} type="color" />
          <Field label="Warna Accent" name="secondaryColor" value={form.secondaryColor} onChange={handleChange} type="color" />
          <Field label="SEO Title" name="seoTitle" value={form.seoTitle} onChange={handleChange} />
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="SEO Description" name="seoDescription" value={form.seoDescription} onChange={handleChange} />
          </div>
        </div>

        <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" style={{ background: '#1d4d2d', color: '#fff', borderRadius: '12px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
};

const Field = ({ label, name, value, onChange, type = 'text' }) => (
  <div>
    <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: 600 }}>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: '12px 14px',
        border: '1px solid #d1d5db',
        borderRadius: '12px',
        fontSize: '0.95rem',
        boxSizing: 'border-box'
      }}
    />
  </div>
);

const pageTitle = { margin: 0, fontSize: '2rem', fontWeight: 800, color: '#111827' };
const pageSubtitle = { margin: '8px 0 20px', color: '#6b7280' };
