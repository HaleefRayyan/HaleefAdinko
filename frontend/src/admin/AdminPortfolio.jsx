import React, { useEffect, useState } from 'react';
import { deletePortfolio, getPortfolios, savePortfolio, getCategories, getMediaList } from './adminApi';
import { useSiteContext } from '../context/SiteContext';

const emptyForm = {
  nama_proyek: '',
  lokasi: '',
  kategori: 1,
  tahun: new Date().getFullYear(),
  deskripsi: '',
  image_url: ''
};

export const AdminPortfolio = () => {
  const { refreshSiteData } = useSiteContext();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const [portfoliosData, categoriesData, mediaData] = await Promise.allSettled([
        getPortfolios(),
        getCategories(),
        getMediaList()
      ]);

      if (portfoliosData.status === 'fulfilled') {
        setItems(portfoliosData.value || []);
      }
      if (categoriesData.status === 'fulfilled' && Array.isArray(categoriesData.value)) {
        setCategories(categoriesData.value);
        if (categoriesData.value.length > 0 && !form.kategori) {
          setForm((prev) => ({ ...prev, kategori: categoriesData.value[0].id || categoriesData.value[0].idkategori_layanan }));
        }
      }
      if (mediaData.status === 'fulfilled' && Array.isArray(mediaData.value)) {
        setMediaFiles(mediaData.value);
      }
    } catch (error) {
      console.error('Error loading portfolio admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'kategori' || name === 'tahun' ? Number(value) : value
    }));
  };

  const parseImageUrls = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map((item) => String(item).trim()).filter(Boolean);
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim()).filter(Boolean);
      } catch {
        // not JSON, fallback to comma
      }
      return raw.split(',').map((item) => item.trim()).filter(Boolean);
    }
    return [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama_proyek.trim()) {
      alert('Nama proyek wajib diisi');
      return;
    }

    try {
      setSubmitting(true);
      setMessage('');
      const imagesArray = parseImageUrls(form.image_url);

      const payload = {
        nama_proyek: form.nama_proyek,
        lokasi: form.lokasi,
        kategori: Number(form.kategori) || 1,
        tahun: Number(form.tahun) || new Date().getFullYear(),
        deskripsi: form.deskripsi,
        image_url: imagesArray
      };

      await savePortfolio(payload, editingId);
      setForm(emptyForm);
      setEditingId(null);
      setMessage(editingId ? 'Portfolio berhasil diperbarui!' : 'Portfolio baru berhasil ditambahkan!');
      await load();
      if (refreshSiteData) refreshSiteData();
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan portfolio: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    const itemId = item.idportfolio || item.id;
    setEditingId(itemId);
    const images = parseImageUrls(item.image_url);
    setForm({
      nama_proyek: item.nama_proyek || '',
      lokasi: item.lokasi || '',
      kategori: item.kategori || (categories[0]?.id || 1),
      tahun: item.tahun || new Date().getFullYear(),
      deskripsi: item.deskripsi || '',
      image_url: images.join(', ')
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (item) => {
    const itemId = item.idportfolio || item.id;
    if (!window.confirm(`Hapus portfolio "${item.nama_proyek}"?`)) return;
    try {
      await deletePortfolio(itemId);
      setMessage('Portfolio berhasil dihapus.');
      await load();
      if (refreshSiteData) refreshSiteData();
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus portfolio');
    }
  };

  const handleSelectMedia = (url) => {
    setForm((prev) => {
      const existing = prev.image_url ? prev.image_url.trim() : '';
      return {
        ...prev,
        image_url: existing ? `${existing}, ${url}` : url
      };
    });
  };

  return (
    <div>
      <h2 style={pageTitle}>Portfolio Management</h2>
      <p style={pageSubtitle}>Kelola proyek portofolio yang tampil di Beranda dan Halaman Portofolio.</p>

      {message && (
        <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontWeight: 600 }}>
          ✓ {message}
        </div>
      )}

      {/* Form Input */}
      <form onSubmit={handleSubmit} style={panelStyle}>
        <h3 style={{ margin: '0 0 18px', color: '#111827', fontSize: '1.2rem', fontWeight: 700 }}>
          {editingId ? 'Edit Proyek Portofolio' : 'Tambah Proyek Portofolio Baru'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Nama Proyek *</label>
            <input
              type="text"
              name="nama_proyek"
              required
              value={form.nama_proyek}
              onChange={handleChange}
              placeholder="Contoh: Taman Sintetis Perumahan Elit"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Lokasi & Kota</label>
            <input
              type="text"
              name="lokasi"
              value={form.lokasi}
              onChange={handleChange}
              placeholder="Contoh: Marpoyan Damai, Pekanbaru 2024"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Kategori Layanan *</label>
            <select
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              style={inputStyle}
            >
              {categories.length > 0 ? (
                categories.map((cat) => {
                  const catId = cat.id || cat.idkategori_layanan;
                  return (
                    <option key={catId} value={catId}>
                      {cat.kategori_layanan}
                    </option>
                  );
                })
              ) : (
                <>
                  <option value={1}>Taman</option>
                  <option value={2}>Lapangan Futsal</option>
                  <option value={3}>Minisoccer</option>
                  <option value={4}>Vertical Garden</option>
                  <option value={5}>Olahraga Lainnya</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Tahun Proyek</label>
            <input
              type="number"
              name="tahun"
              value={form.tahun}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>URL Gambar (Pisahkan dengan koma jika multi-gambar)</label>
              {mediaFiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(!showMediaPicker)}
                  style={{ background: '#edf7ee', color: '#1d4d2d', border: 'none', borderRadius: '8px', padding: '4px 10px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  {showMediaPicker ? '✕ Tutup Pilihan Media' : '🖼 Pilih dari Media Library'}
                </button>
              )}
            </div>
            <input
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/... atau URL gambar lokal /assets/..."
              style={inputStyle}
            />

            {/* Media quick picker */}
            {showMediaPicker && (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', marginTop: '10px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '10px' }}>
                  Klik gambar untuk menyisipkannya ke input URL di atas:
                </div>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
                  {mediaFiles.map((m) => (
                    <div
                      key={m.name}
                      onClick={() => handleSelectMedia(m.url)}
                      style={{ cursor: 'pointer', border: '2px solid #cbd5e1', borderRadius: '10px', overflow: 'hidden', width: '80px', flexShrink: 0, textAlign: 'center' }}
                      title={`Klik untuk menambahkan: ${m.name}`}
                    >
                      <img src={m.url} alt={m.name} style={{ width: '100%', height: '60px', objectFit: 'cover' }} />
                      <div style={{ fontSize: '0.65rem', padding: '2px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Deskripsi Proyek</label>
            <textarea
              name="deskripsi"
              rows={3}
              value={form.deskripsi}
              onChange={handleChange}
              placeholder="Jelaskan detail material, luas, keunggulan pengerjaan, dll..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              style={{ background: '#e5e7eb', color: '#111827', borderRadius: '12px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer', border: 'none' }}
            >
              Batal Edit
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            style={{ background: '#1d4d2d', color: '#fff', borderRadius: '12px', padding: '12px 22px', fontWeight: 700, cursor: 'pointer', border: 'none' }}
          >
            {submitting ? 'Menyimpan...' : editingId ? 'Update Proyek' : 'Simpan Proyek Baru'}
          </button>
        </div>
      </form>

      {/* Grid Portfolio Items */}
      <h3 style={{ margin: '36px 0 16px', color: '#111827', fontSize: '1.3rem', fontWeight: 800 }}>
        Daftar Proyek Aktif ({items.length})
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {loading ? (
          <div style={panelStyle}>Memuat data portofolio...</div>
        ) : items.length === 0 ? (
          <div style={panelStyle}>Belum ada data portofolio. Silakan tambahkan proyek di atas.</div>
        ) : (
          items.map((item) => {
            const itemId = item.idportfolio || item.id;
            const images = parseImageUrls(item.image_url);
            const firstImg = images[0] || 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80';

            return (
              <div key={itemId} style={panelStyle}>
                <div style={{ position: 'relative', height: '160px', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px' }}>
                  <img
                    src={firstImg}
                    alt={item.nama_proyek}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#1d4d2d', color: '#fff', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
                    {item.kategori_layanan || `Kategori ID: ${item.kategori}`}
                  </span>
                  {images.length > 1 && (
                    <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.65)', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>
                      📷 {images.length} Foto
                    </span>
                  )}
                </div>

                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827', marginBottom: '4px' }}>
                  {item.nama_proyek}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '8px' }}>
                  📍 {item.lokasi || '-'} ({item.tahun || '-'})
                </div>
                <div style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.5, marginBottom: '16px', maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.deskripsi || '-'}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <button
                    onClick={() => handleEdit(item)}
                    style={{ background: '#edf7ee', color: '#1d4d2d', border: '1px solid #c7e6ca', borderRadius: '8px', padding: '8px 14px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '8px', padding: '8px 14px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const labelStyle = { display: 'block', marginBottom: '8px', color: '#374151', fontWeight: 600, fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box' };
const pageTitle = { margin: 0, fontSize: '2rem', fontWeight: 800, color: '#111827' };
const pageSubtitle = { margin: '8px 0 20px', color: '#6b7280' };
const panelStyle = { background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', border: '1px solid rgba(17,24,39,0.04)' };

