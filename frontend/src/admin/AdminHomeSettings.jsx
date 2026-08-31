import React, { useEffect, useState } from 'react';
import { getHomeSettings, updateHomeSettings } from './adminApi';
import { useSiteContext } from '../context/SiteContext';

export const AdminHomeSettings = () => {
  const { homeSettings, refreshSiteData } = useSiteContext();
  const [form, setForm] = useState(homeSettings);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getHomeSettings();
        if (data) {
          setForm((prev) => ({ ...prev, ...data }));
        }
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
      setSubmitting(true);
      setMessage('');
      await updateHomeSettings(form);
      setMessage('Konten halaman Home berhasil diperbarui! Perubahan langsung aktif di Beranda.');
      if (refreshSiteData) {
        await refreshSiteData();
      }
    } catch (error) {
      console.error(error);
      alert('Gagal memperbarui Home section: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 style={pageTitle}>Kelola Halaman Home</h2>
      <p style={pageSubtitle}>Ubah judul utama hero, subjudul, teks tombol CTA, dan judul section keunggulan di Beranda.</p>

      {message && (
        <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontWeight: 600 }}>
          ✓ {message}
        </div>
      )}

      {loading ? (
        <div style={{ background: '#fff', borderRadius: '18px', padding: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>Memuat data...</div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '18px', padding: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', border: '1px solid rgba(17,24,39,0.04)' }}>
          <div style={{ display: 'grid', gap: '18px' }}>
            <Field label="Judul Utama Hero (H1)" name="hero_title" value={form.hero_title || ''} onChange={handleChange} />
            
            <div>
              <label style={labelStyle}>Subjudul Hero (Deskripsi)</label>
              <textarea
                name="hero_subtitle"
                rows={2}
                value={form.hero_subtitle || ''}
                onChange={handleChange}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <Field label="Teks Tombol CTA Utama" name="cta_primary" value={form.cta_primary || ''} onChange={handleChange} />
              <Field label="Teks Tombol CTA Sekunder" name="cta_secondary" value={form.cta_secondary || ''} onChange={handleChange} />
            </div>

            <Field label="Judul Bagian Keunggulan (Features)" name="feature_title" value={form.feature_title || ''} onChange={handleChange} />
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{ background: '#1d4d2d', color: '#fff', borderRadius: '12px', padding: '12px 24px', fontWeight: 700, cursor: 'pointer', border: 'none', fontSize: '0.98rem' }}
            >
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan Home'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const labelStyle = { display: 'block', marginBottom: '8px', color: '#374151', fontWeight: 600, fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' };
const pageTitle = { margin: 0, fontSize: '2rem', fontWeight: 800, color: '#111827' };
const pageSubtitle = { margin: '8px 0 20px', color: '#6b7280' };

const Field = ({ label, name, value, onChange }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      style={inputStyle}
    />
  </div>
);

