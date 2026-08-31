import React, { useEffect, useState } from 'react';
import { deleteTestimoni, getTestimonials, saveTestimoni } from './adminApi';
import { useSiteContext } from '../context/SiteContext';

const emptyForm = {
  nama_klien: '',
  waktu: '',
  rating: 5,
  deskripsi: ''
};

export const AdminTestimoni = () => {
  const { refreshSiteData } = useSiteContext();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const data = await getTestimonials();
      setItems(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'rating' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama_klien.trim()) {
      alert('Nama klien wajib diisi');
      return;
    }

    try {
      setSubmitting(true);
      setMessage('');
      await saveTestimoni({ ...form }, editingId);
      setForm(emptyForm);
      setEditingId(null);
      setMessage(editingId ? 'Testimoni berhasil diperbarui!' : 'Testimoni baru berhasil ditambahkan!');
      await load();
      if (refreshSiteData) refreshSiteData();
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan testimoni: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    const itemId = item.id || item.idtestimoni;
    setEditingId(itemId);
    setForm({
      nama_klien: item.nama_klien || '',
      waktu: item.waktu || '',
      rating: Number(item.rating) || 5,
      deskripsi: item.deskripsi || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (item) => {
    const itemId = item.id || item.idtestimoni;
    if (!window.confirm(`Hapus ulasan dari "${item.nama_klien}"?`)) return;
    try {
      await deleteTestimoni(itemId);
      setMessage('Testimoni berhasil dihapus.');
      await load();
      if (refreshSiteData) refreshSiteData();
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus testimoni');
    }
  };

  return (
    <div>
      <h2 style={pageTitle}>Testimoni Management</h2>
      <p style={pageSubtitle}>Kelola ulasan dan rating pelanggan yang tampil di Beranda dan Halaman Testimoni.</p>

      {message && (
        <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontWeight: 600 }}>
          ✓ {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={panelStyle}>
        <h3 style={{ margin: '0 0 18px', color: '#111827', fontSize: '1.2rem', fontWeight: 700 }}>
          {editingId ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Nama Klien *</label>
            <input
              type="text"
              name="nama_klien"
              required
              value={form.nama_klien}
              onChange={handleChange}
              placeholder="Contoh: Bpk. Hendra Gunawan"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Waktu / Tanggal</label>
            <input
              type="text"
              name="waktu"
              value={form.waktu}
              onChange={handleChange}
              placeholder="Contoh: 2024-05-18 atau 1 bulan yang lalu"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Rating Bintang (1 - 5)</label>
            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang - Sangat Puas)</option>
              <option value={4}>⭐⭐⭐⭐ (4 Bintang - Puas)</option>
              <option value={3}>⭐⭐⭐ (3 Bintang - Cukup)</option>
              <option value={2}>⭐⭐ (2 Bintang)</option>
              <option value={1}>⭐ (1 Bintang)</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Isi Ulasan / Review *</label>
            <textarea
              name="deskripsi"
              required
              rows={3}
              value={form.deskripsi}
              onChange={handleChange}
              placeholder="Tulis ulasan klien mengenai kualitas rumput sintetis, kecepatan pengerjaan, dan pelayanan..."
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
              Batal
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            style={{ background: '#1d4d2d', color: '#fff', borderRadius: '12px', padding: '12px 22px', fontWeight: 700, cursor: 'pointer', border: 'none' }}
          >
            {submitting ? 'Menyimpan...' : editingId ? 'Update Testimoni' : 'Tambah Testimoni'}
          </button>
        </div>
      </form>

      <h3 style={{ margin: '36px 0 16px', color: '#111827', fontSize: '1.3rem', fontWeight: 800 }}>
        Daftar Ulasan Klien ({items.length})
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {loading ? (
          <div style={panelStyle}>Memuat data testimoni...</div>
        ) : items.length === 0 ? (
          <div style={panelStyle}>Belum ada data testimoni. Silakan tambahkan ulasan di atas.</div>
        ) : (
          items.map((item) => {
            const itemId = item.id || item.idtestimoni;
            const ratingNum = Number(item.rating) || 5;

            return (
              <div key={itemId} style={panelStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>{item.nama_klien}</div>
                    <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '2px' }}>{item.waktu || 'Baru-baru ini'}</div>
                  </div>
                  <div style={{ color: '#d4a72c', fontSize: '0.95rem', fontWeight: 700 }}>
                    {'⭐'.repeat(ratingNum)} ({ratingNum}/5)
                  </div>
                </div>

                <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.6, marginTop: '12px', minHeight: '60px' }}>
                  "{item.deskripsi}"
                </div>

                <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
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

