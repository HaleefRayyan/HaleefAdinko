import React, { useEffect, useState } from 'react';
import { getSiteSettings, updateSiteSettings } from './adminApi';

const initialData = {
  site_name: 'Haleef Adinko & GhaziSportsHub',
  tagline: 'Jasa instalasi, taman, lapangan, dan project sport arena',
  email: 'hello@haleefadinko.com',
  whatsapp: '6281234567890',
  address: 'Bandung, Indonesia',
  primary_color: '#1d4d2d',
  secondary_color: '#d4a72c',
  seo_title: 'Haleef Adinko | Solusi Lapangan & Taman Modern',
  seo_description: 'Menyediakan layanan instalasi, rumput sintetis, taman, dan project olahraga yang modern.'
};

export const AdminSiteSettings = () => {
  const [form, setForm] = useState(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSiteSettings();
        setForm({ ...initialData, ...data });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSiteSettings(form);
      alert('Konfigurasi website berhasil disimpan.');
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan konfigurasi website.');
    }
  };

  return (
    <div>
      <h2 style={pageTitle}>Pengaturan Website</h2>
      <p style={pageSubtitle}>Atur branding, kontak, dan SEO utama website.</p>

      {loading ? (
        <div style={{ background: '#fff', borderRadius: '18px', padding: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>Memuat data...</div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
            <Field label="Nama Website" name="site_name" value={form.site_name} onChange={handleChange} />
            <Field label="Tagline" name="tagline" value={form.tagline} onChange={handleChange} />
            <Field label="Email" name="email" value={form.email} onChange={handleChange} />
            <Field label="WhatsApp" name="whatsapp" value={form.whatsapp} onChange={handleChange} />
            <Field label="Alamat" name="address" value={form.address} onChange={handleChange} />
            <Field label="Warna Utama" name="primary_color" value={form.primary_color} onChange={handleChange} type="color" />
            <Field label="Warna Accent" name="secondary_color" value={form.secondary_color} onChange={handleChange} type="color" />
            <Field label="SEO Title" name="seo_title" value={form.seo_title} onChange={handleChange} />
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="SEO Description" name="seo_description" value={form.seo_description} onChange={handleChange} />
            </div>
          </div>

          <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" style={{ background: '#1d4d2d', color: '#fff', borderRadius: '12px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>
              Simpan Perubahan
            </button>
          </div>
        </form>
      )}
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
