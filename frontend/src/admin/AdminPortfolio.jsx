import React, { useEffect, useState, useRef } from 'react';
import { deletePortfolio, getPortfolios, savePortfolio, getCategories, getMediaList, uploadMediaFile } from './adminApi';
import { useSiteContext } from '../context/SiteContext';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${apiBase}${cleanPath}`;
};

const DEFAULT_CATEGORIES = [
  { id: 1, kategori_layanan: 'Taman Sintetis & Landscaping' },
  { id: 2, kategori_layanan: 'Lapangan Futsal' },
  { id: 3, kategori_layanan: 'Minisoccer Standar FIFA' },
  { id: 4, kategori_layanan: 'Vertical Garden' },
  { id: 5, kategori_layanan: 'Lapangan Padel & Tenis' },
  { id: 6, kategori_layanan: 'Mini Golf & Playground' }
];

const emptyForm = {
  nama_proyek: '',
  lokasi: '',
  kategori: 1,
  tahun: new Date().getFullYear(),
  deskripsi: '',
  images: [] // Array of image URLs
};

export const AdminPortfolio = () => {
  const { refreshSiteData } = useSiteContext();
  const fileInputRef = useRef(null);

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [showManualUrl, setShowManualUrl] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const parseImageUrls = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map((item) => String(item).trim()).filter(Boolean);
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim()).filter(Boolean);
      } catch {
        // fallback to comma separated
      }
      return raw.split(',').map((item) => item.trim()).filter(Boolean);
    }
    return [];
  };

  const load = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const [portfoliosData, categoriesData, mediaData] = await Promise.allSettled([
        getPortfolios(),
        getCategories(),
        getMediaList()
      ]);

      if (portfoliosData.status === 'fulfilled') {
        setItems(portfoliosData.value || []);
      } else {
        console.warn('Portfolio fetch error:', portfoliosData.reason);
      }

      if (categoriesData.status === 'fulfilled' && Array.isArray(categoriesData.value) && categoriesData.value.length > 0) {
        setCategories(categoriesData.value);
        if (!form.kategori) {
          setForm((prev) => ({ ...prev, kategori: categoriesData.value[0].id || categoriesData.value[0].idkategori_layanan }));
        }
      }

      if (mediaData.status === 'fulfilled' && Array.isArray(mediaData.value)) {
        setMediaFiles(mediaData.value);
      }
    } catch (error) {
      console.error('Error loading portfolio admin data:', error);
      setErrorMessage('Gagal memuat data portofolio dari server.');
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

  // Direct File Upload handler (Multi-file support)
  const handleDirectFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploadingImage(true);
      setErrorMessage('');
      const newUrls = [];

      for (const file of files) {
        const uploadedUrl = await uploadMediaFile(file);
        if (uploadedUrl) {
          newUrls.push(uploadedUrl);
        }
      }

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...newUrls]
      }));
      setMessage(`Berhasil mengupload ${newUrls.length} foto!`);
      // Refresh media library list in background
      getMediaList().then((data) => setMediaFiles(data || [])).catch(() => {});
    } catch (err) {
      console.error('Upload error:', err);
      setErrorMessage('Gagal mengupload foto: ' + (err.message || 'Cek koneksi server'));
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddManualUrl = () => {
    if (!manualUrlInput.trim()) return;
    const urlToAdd = manualUrlInput.trim();
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, urlToAdd]
    }));
    setManualUrlInput('');
  };

  const handleSelectMedia = (url) => {
    const resolved = resolveImageUrl(url);
    if (!form.images.includes(resolved)) {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, resolved]
      }));
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSetCoverImage = (indexToCover) => {
    setForm((prev) => {
      const selected = prev.images[indexToCover];
      const rest = prev.images.filter((_, idx) => idx !== indexToCover);
      return {
        ...prev,
        images: [selected, ...rest]
      };
    });
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
      setErrorMessage('');

      const payload = {
        nama_proyek: form.nama_proyek.trim(),
        lokasi: form.lokasi.trim(),
        kategori: Number(form.kategori) || 1,
        tahun: Number(form.tahun) || new Date().getFullYear(),
        deskripsi: form.deskripsi.trim(),
        image_url: form.images
      };

      await savePortfolio(payload, editingId);
      setForm(emptyForm);
      setEditingId(null);
      setMessage(editingId ? 'Proyek portofolio berhasil diperbarui!' : 'Proyek portofolio baru berhasil ditambahkan!');
      await load();
      if (refreshSiteData) refreshSiteData();
    } catch (error) {
      console.error(error);
      setErrorMessage('Gagal menyimpan portofolio: ' + (error.message || 'Cek database backend'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    const itemId = item.idportfolio || item.id;
    setEditingId(itemId);
    const parsedImages = parseImageUrls(item.image_url);
    setForm({
      nama_proyek: item.nama_proyek || '',
      lokasi: item.lokasi || '',
      kategori: Number(item.kategori) || (categories[0]?.id || 1),
      tahun: item.tahun || new Date().getFullYear(),
      deskripsi: item.deskripsi || '',
      images: parsedImages
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (item) => {
    const itemId = item.idportfolio || item.id;
    if (!window.confirm(`Hapus proyek portofolio "${item.nama_proyek}"?`)) return;
    try {
      setSubmitting(true);
      await deletePortfolio(itemId);
      setMessage(`Proyek "${item.nama_proyek}" berhasil dihapus.`);
      await load();
      if (refreshSiteData) refreshSiteData();
    } catch (error) {
      console.error(error);
      setErrorMessage('Gagal menghapus portofolio: ' + (error.message || 'Cek server'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 style={pageTitle}>Portfolio Management</h2>
      <p style={pageSubtitle}>Kelola proyek portofolio, upload foto dokumentasi, dan atur kategori layanan.</p>

      {message && (
        <div style={{ background: '#ecfdf5', color: '#065f46', border: '1.5px solid #a7f3d0', padding: '14px 18px', borderRadius: '14px', marginBottom: '20px', fontWeight: 700 }}>
          ✓ {message}
        </div>
      )}

      {errorMessage && (
        <div style={{ background: '#fef2f2', color: '#991b1b', border: '1.5px solid #fecaca', padding: '14px 18px', borderRadius: '14px', marginBottom: '20px', fontWeight: 700 }}>
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Form Input */}
      <form onSubmit={handleSubmit} style={panelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0, color: '#111827', fontSize: '1.25rem', fontWeight: 800 }}>
            {editingId ? '✏️ Edit Proyek Portofolio' : '➕ Tambah Proyek Portofolio Baru'}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', padding: '6px 12px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
            >
              ✕ Batalkan Edit
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Nama Proyek *</label>
            <input
              type="text"
              name="nama_proyek"
              required
              value={form.nama_proyek}
              onChange={handleChange}
              placeholder="Contoh: Lapangan Minisoccer Garuda Arena"
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
              placeholder="Contoh: Marpoyan Damai, Pekanbaru"
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
              {categories.map((cat) => {
                const catId = cat.id || cat.idkategori_layanan;
                return (
                  <option key={catId} value={catId}>
                    {cat.kategori_layanan}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Tahun Pengerjaan</label>
            <input
              type="number"
              name="tahun"
              value={form.tahun}
              onChange={handleChange}
              placeholder="2024"
              style={inputStyle}
            />
          </div>

          {/* FOTO PROYEK SECTION */}
          <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '18px', borderRadius: '14px', border: '1.5px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <label style={{ ...labelStyle, marginBottom: '2px', fontSize: '1rem', color: '#0f172a' }}>
                  📸 Foto Dokumentasi Proyek ({form.images.length})
                </label>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Upload foto dari laptop/HP Anda atau pilih dari media library
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleDirectFileUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  disabled={uploadingImage}
                  style={{
                    background: '#1d4d2d',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {uploadingImage ? '⏳ Mengupload...' : '📤 Upload Foto Baru'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowMediaPicker(!showMediaPicker)}
                  style={{
                    background: '#ffffff',
                    color: '#1d4d2d',
                    border: '1px solid #a7f3d0',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {showMediaPicker ? '✕ Tutup Library' : '🖼 Pilih dari Library'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowManualUrl(!showManualUrl)}
                  style={{
                    background: '#ffffff',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  🔗 Input URL Manual
                </button>
              </div>
            </div>

            {/* Manual URL Input Bar */}
            {showManualUrl && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <input
                  type="text"
                  value={manualUrlInput}
                  onChange={(e) => setManualUrlInput(e.target.value)}
                  placeholder="Paste URL foto (https://...)"
                  style={{ ...inputStyle, background: '#ffffff' }}
                />
                <button
                  type="button"
                  onClick={handleAddManualUrl}
                  style={{ background: '#334155', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '0 16px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  + Tambahkan
                </button>
              </div>
            )}

            {/* Media quick picker drawer */}
            {showMediaPicker && (
              <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>
                  Pilih foto dari server library (Klik foto untuk menambahkannya ke proyek ini):
                </div>
                {mediaFiles.length === 0 ? (
                  <div style={{ fontSize: '0.82rem', color: '#64748b', fontStyle: 'italic' }}>
                    Belum ada media tersimpan di server. Silakan klik tombol "Upload Foto Baru" di atas.
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
                    {mediaFiles.map((m) => {
                      const mUrl = resolveImageUrl(m.url || m.name);
                      const isSelected = form.images.includes(mUrl);
                      return (
                        <div
                          key={m.name}
                          onClick={() => handleSelectMedia(m.url || m.name)}
                          style={{
                            cursor: 'pointer',
                            border: isSelected ? '3px solid #059669' : '1.5px solid #cbd5e1',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            width: '85px',
                            flexShrink: 0,
                            textAlign: 'center',
                            background: '#f8fafc',
                            position: 'relative'
                          }}
                          title={`Klik untuk menambahkan: ${m.name}`}
                        >
                          <img src={mUrl} alt={m.name} style={{ width: '100%', height: '65px', objectFit: 'cover' }} />
                          <div style={{ fontSize: '0.68rem', padding: '2px', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {m.name}
                          </div>
                          {isSelected && (
                            <span style={{ position: 'absolute', top: '2px', right: '2px', background: '#059669', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              ✓
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Visual Selected Images Gallery inside Form */}
            {form.images.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', border: '2px dashed #cbd5e1', borderRadius: '12px', color: '#64748b', background: '#ffffff' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Belum ada foto yang dipilih untuk proyek ini.</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Klik tombol <strong>"Upload Foto Baru"</strong> untuk mengunggah dari perangkat Anda.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                {form.images.map((imgUrl, idx) => {
                  const resolvedSrc = resolveImageUrl(imgUrl);
                  const isCover = idx === 0;

                  return (
                    <div
                      key={idx}
                      style={{
                        position: 'relative',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: isCover ? '2.5px solid #059669' : '1px solid #cbd5e1',
                        background: '#ffffff',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                      }}
                    >
                      <img
                        src={resolvedSrc}
                        alt={`Dokumentasi ${idx + 1}`}
                        style={{ width: '100%', height: '90px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      {isCover && (
                        <span style={{ position: 'absolute', top: '4px', left: '4px', background: '#059669', color: '#ffffff', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                          COVER UTAMA
                        </span>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                        {!isCover && (
                          <button
                            type="button"
                            onClick={() => handleSetCoverImage(idx)}
                            style={{ background: 'none', border: 'none', color: '#059669', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', padding: '2px' }}
                            title="Jadikan foto cover utama"
                          >
                            ⭐ Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', padding: '2px', marginLeft: 'auto' }}
                          title="Hapus foto ini dari proyek"
                        >
                          ✕ Hapus
                        </button>
                      </div>
                    </div>
                  );
                })}
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
              placeholder="Ceritakan detail pengerjaan, luas lapangan/taman, jenis rumput (Monofilament, Swiss, Golf), fasilitas, dll..."
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
            disabled={submitting || uploadingImage}
            style={{
              background: '#1d4d2d',
              color: '#fff',
              borderRadius: '12px',
              padding: '13px 26px',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: submitting ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: '0 4px 12px rgba(29, 77, 45, 0.25)'
            }}
          >
            {submitting ? '⏳ Menyimpan...' : editingId ? '✓ Update Proyek' : '➕ Simpan Proyek Baru'}
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
          <div style={{ ...panelStyle, gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
            Belum ada proyek portofolio. Silakan tambahkan proyek di formulir atas.
          </div>
        ) : (
          items.map((item) => {
            const itemId = item.idportfolio || item.id;
            const images = parseImageUrls(item.image_url);
            const firstImg = images[0] ? resolveImageUrl(images[0]) : 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80';

            return (
              <div key={itemId} style={panelStyle}>
                <div style={{ position: 'relative', height: '170px', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px', background: '#f1f5f9' }}>
                  <img
                    src={firstImg}
                    alt={item.nama_proyek}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#1d4d2d', color: '#fff', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
                    {item.kategori_layanan || `Kategori: ${item.kategori}`}
                  </span>
                  {images.length > 1 && (
                    <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                      📷 {images.length} Foto
                    </span>
                  )}
                </div>

                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827', marginBottom: '4px' }}>
                  {item.nama_proyek}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '8px' }}>
                  📍 {item.lokasi || '-'} {item.tahun ? `(${item.tahun})` : ''}
                </div>
                <div style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.5, marginBottom: '16px', maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.deskripsi || '-'}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <button
                    onClick={() => handleEdit(item)}
                    style={{ background: '#edf7ee', color: '#1d4d2d', border: '1px solid #c7e6ca', borderRadius: '8px', padding: '8px 14px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '8px', padding: '8px 14px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    🗑️ Hapus
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

const labelStyle = { display: 'block', marginBottom: '8px', color: '#374151', fontWeight: 700, fontSize: '0.88rem' };
const inputStyle = { width: '100%', padding: '12px 14px', border: '1.5px solid #d1d5db', borderRadius: '12px', fontSize: '0.92rem', boxSizing: 'border-box' };
const pageTitle = { margin: 0, fontSize: '2rem', fontWeight: 800, color: '#111827' };
const pageSubtitle = { margin: '8px 0 20px', color: '#6b7280' };
const panelStyle = { background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', border: '1px solid rgba(17,24,39,0.04)' };


