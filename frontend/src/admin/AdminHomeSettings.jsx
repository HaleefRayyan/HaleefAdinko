import React, { useEffect, useState } from 'react';
import { getHomeSettings, updateHomeSettings } from './adminApi';

const initialData = {
  hero_title: 'Bangun ruang luar yang lebih indah dan fungsional',
  hero_subtitle: 'Kita membantu Anda menghadirkan taman, lapangan, dan ruang olahraga yang modern, kuat, dan nyaman digunakan.',
  cta_primary: 'Konsultasi Gratis',
  cta_secondary: 'Lihat Portofolio',
  feature_title: 'Layanan utama kami'
};

export const AdminHomeSettings = () => {
  const [form, setForm] = useState(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getHomeSettings();
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
      await updateHomeSettings(form);
      alert('Home section berhasil diperbarui.');
    } catch (error) {
      console.error(error);
      alert('Gagal memperbarui Home section.');
    }
  };

  return (
    <div>
      <h2 style={pageTitle}>Kelola Halaman Home</h2>
      <p style={pageSubtitle}>Ubah judul utama, CTA, dan konten landing page utama.</p>

      {loading ? (
        <div style={{ background: '#fff', borderRadius: '18px', padding: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>Memuat data...</div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'grid', gap: '18px' }}>
            <Field label="Judul Hero" name="hero_title" value={form.hero_title} onChange={handleChange} />
            <Field label="Subjudul Hero" name="hero_subtitle" value={form.hero_subtitle} onChange={handleChange} />
            <Field label="CTA Utama" name="cta_primary" value={form.cta_primary} onChange={handleChange} />
            <Field label="CTA Sekunder" name="cta_secondary" value={form.cta_secondary} onChange={handleChange} />
            <Field label="Judul Feature" name="feature_title" value={form.feature_title} onChange={handleChange} />
          </div>

          <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" style={{ background: '#1d4d2d', color: '#fff', borderRadius: '12px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>
              Simpan Home Section
            </button>
          </div>
        </form>
      )}
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
