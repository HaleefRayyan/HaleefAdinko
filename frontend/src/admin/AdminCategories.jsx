import React, { useEffect, useState } from 'react';
import { getCategories, saveCategory, deleteCategory } from './adminApi';
import { useSiteContext } from '../context/SiteContext';
import { Tag, Plus, Edit2, Trash2, CheckCircle2, Search, AlertCircle } from 'lucide-react';

export const AdminCategories = () => {
  const { refreshSiteData } = useSiteContext();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat daftar kategori.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setError('Nama kategori tidak boleh kosong.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setMessage('');

      await saveCategory({ kategori_layanan: categoryName.trim() }, editingId);
      
      setMessage(editingId ? 'Kategori berhasil diperbarui!' : 'Kategori baru berhasil ditambahkan!');
      setCategoryName('');
      setEditingId(null);
      await load();
      if (refreshSiteData) refreshSiteData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Gagal menyimpan kategori');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat) => {
    const catId = cat.id || cat.idkategori_layanan;
    setEditingId(catId);
    setCategoryName(cat.kategori_layanan);
    setError('');
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (cat) => {
    const catId = cat.id || cat.idkategori_layanan;
    if (!window.confirm(`Hapus kategori "${cat.kategori_layanan}"? Pastikan tidak ada portfolio yang terkait.`)) {
      return;
    }

    try {
      await deleteCategory(catId);
      setMessage('Kategori berhasil dihapus.');
      await load();
      if (refreshSiteData) refreshSiteData();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus kategori: ' + err.message);
    }
  };

  const filteredCategories = categories.filter((c) =>
    (c.kategori_layanan || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={pageTitle}>Kelola Kategori Layanan</h2>
        <p style={pageSubtitle}>
          Kategori ini digunakan untuk mengelompokkan proyek portfolio, form konsultasi klien, dan filter halaman layanan.
        </p>
      </div>

      {message && (
        <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div style={{ background: '#fef2f2', color: '#991b1b', border: '1.5px solid #fecaca', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Form Tambah/Edit Kategori */}
      <form onSubmit={handleSubmit} style={panelStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#edf7ee', color: '#1d4d2d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tag size={20} />
          </div>
          <h3 style={{ margin: 0, color: '#111827', fontSize: '1.15rem', fontWeight: 700 }}>
            {editingId ? 'Edit Kategori Layanan' : 'Tambah Kategori Baru'}
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <input
              type="text"
              required
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Contoh: Rumput Sintetis Lapangan Mini Soccer"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setCategoryName('');
                  setError('');
                }}
                style={{ background: '#f3f4f6', color: '#4b5563', borderRadius: '12px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer', border: 'none' }}
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: 'linear-gradient(135deg, #1d4d2d 0%, #2f7d32 100%)',
                color: '#fff',
                borderRadius: '12px',
                padding: '12px 22px',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(29, 77, 45, 0.25)'
              }}
            >
              <Plus size={18} />
              <span>{submitting ? 'Menyimpan...' : editingId ? 'Update Kategori' : 'Tambah Kategori'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* List Categories */}
      <div style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: '#111827', fontSize: '1.25rem', fontWeight: 800 }}>
            Daftar Kategori Aktif ({categories.length})
          </h3>

          <div style={{ position: 'relative', width: '260px' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kategori..."
              style={{ ...inputStyle, paddingLeft: '36px', paddingRight: '12px', height: '40px', fontSize: '0.88rem' }}
            />
            <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        {loading ? (
          <div style={panelStyle}>Memuat data kategori...</div>
        ) : filteredCategories.length === 0 ? (
          <div style={{ ...panelStyle, textAlign: 'center', color: '#6b7280', padding: '36px 20px' }}>
            {searchTerm ? `Tidak ditemukan kategori dengan kata kunci "${searchTerm}"` : 'Belum ada kategori layanan. Silakan tambahkan di atas.'}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {filteredCategories.map((cat, idx) => {
              const catId = cat.id || cat.idkategori_layanan;
              return (
                <div
                  key={catId}
                  style={{
                    ...panelStyle,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '18px 20px',
                    borderLeft: '4px solid #1d4d2d',
                    transition: 'transform 0.15s, box-shadow 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#9ca3af', background: '#f3f4f6', padding: '2px 8px', borderRadius: '6px' }}>
                        #{idx + 1}
                      </span>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>
                        {cat.kategori_layanan}
                      </h4>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => handleEdit(cat)}
                      style={{
                        background: '#edf7ee',
                        color: '#1d4d2d',
                        border: '1px solid #c7e6ca',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat)}
                      style={{
                        background: '#fee2e2',
                        color: '#991b1b',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const pageTitle = { margin: 0, fontSize: '1.85rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' };
const pageSubtitle = { margin: '6px 0 0', color: '#6b7280', fontSize: '0.92rem' };
const panelStyle = { background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', border: '1px solid rgba(17,24,39,0.04)' };
const inputStyle = { width: '100%', padding: '12px 14px', border: '1.5px solid #d1d5db', borderRadius: '12px', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' };
