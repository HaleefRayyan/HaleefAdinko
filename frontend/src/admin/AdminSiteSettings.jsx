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

            {/* ─── Google Reviews Section ─── */}
            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #f3f4f6', paddingTop: '20px', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>Integrasi Google Reviews</span>
                <span style={{ background: '#ecfdf5', color: '#065f46', fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: '50px' }}>Real-time</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '16px', marginTop: 0 }}>
                Masukkan Google Place ID dan API Key untuk menampilkan ulasan Google secara real-time di halaman Testimoni.
                Dapatkan Place ID dari <a href="https://developers.google.com/maps/documentation/places/web-service/place-id" target="_blank" rel="noopener noreferrer" style={{ color: '#1d4d2d', fontWeight: 600 }}>Google Place Finder</a>.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
                <Field label="Google Place ID" name="google_place_id" value={form.google_place_id || ''} onChange={handleChange} />
                <div>
                  <label style={labelStyle}>Google Maps / Places API Key</label>
                  <input
                    type="password"
                    name="google_maps_api_key"
                    value={form.google_maps_api_key || ''}
                    onChange={handleChange}
                    placeholder="AIza..."
                    autoComplete="new-password"
                    style={inputStyle}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '4px 0 0' }}>API Key tersimpan terenkripsi. Jangan bagikan ke siapapun.</p>
                </div>
                <Field label="Link Google Maps / Review (URL)" name="google_reviews_url" value={form.google_reviews_url || ''} onChange={handleChange} />
              </div>
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

