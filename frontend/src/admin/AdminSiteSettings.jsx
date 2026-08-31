import React, { useEffect, useState } from 'react';
import { getSiteSettings, updateSiteSettings } from './adminApi';
import { useSiteContext } from '../context/SiteContext';

export const AdminSiteSettings = () => {
  const { siteSettings, refreshSiteData } = useSiteContext();
  const [form, setForm] = useState(siteSettings);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getSiteSettings();
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
      await updateSiteSettings(form);
      setMessage('Konfigurasi website berhasil disimpan! Perubahan langsung aktif di halaman user.');
      if (refreshSiteData) {
        await refreshSiteData();
      }
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan konfigurasi website: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 style={pageTitle}>Pengaturan Website</h2>
      <p style={pageSubtitle}>Atur branding, kontak WhatsApp/Telepon, alamat kantor, warna tema, dan SEO utama website.</p>

      {message && (
        <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontWeight: 600 }}>
          ✓ {message}
        </div>
      )}

      {loading ? (
        <div style={{ background: '#fff', borderRadius: '18px', padding: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>Memuat data...</div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '18px', padding: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', border: '1px solid rgba(17,24,39,0.04)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
            <Field label="Nama Website / Brand" name="site_name" value={form.site_name || ''} onChange={handleChange} />
            <Field label="Tagline / Slogan" name="tagline" value={form.tagline || ''} onChange={handleChange} />
            <Field label="Email Resmi" name="email" value={form.email || ''} onChange={handleChange} />
            <Field label="Nomor WhatsApp (Contoh: 6285264456566)" name="whatsapp" value={form.whatsapp || ''} onChange={handleChange} />
            <Field label="Alamat Kantor / Workshop" name="address" value={form.address || ''} onChange={handleChange} />
            
            <div>
              <label style={labelStyle}>Warna Utama (Primary)</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="color"
                  name="primary_color"
                  value={form.primary_color || '#1d4d2d'}
                  onChange={handleChange}
                  style={{ width: '48px', height: '44px', padding: '2px', border: '1px solid #d1d5db', borderRadius: '10px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  name="primary_color"
                  value={form.primary_color || '#1d4d2d'}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Warna Aksen (Secondary)</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="color"
                  name="secondary_color"
                  value={form.secondary_color || '#d4a72c'}
                  onChange={handleChange}
                  style={{ width: '48px', height: '44px', padding: '2px', border: '1px solid #d1d5db', borderRadius: '10px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  name="secondary_color"
                  value={form.secondary_color || '#d4a72c'}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="SEO Meta Title" name="seo_title" value={form.seo_title || ''} onChange={handleChange} />
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>SEO Meta Description</label>
              <textarea
                name="seo_description"
                rows={2}
                value={form.seo_description || ''}
                onChange={handleChange}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{ background: '#1d4d2d', color: '#fff', borderRadius: '12px', padding: '12px 24px', fontWeight: 700, cursor: 'pointer', border: 'none', fontSize: '0.98rem' }}
            >
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
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

const Field = ({ label, name, value, onChange, type = 'text' }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      style={inputStyle}
    />
  </div>
);

