import React, { useEffect, useState } from 'react';
import { deletePortfolio, getPortfolios, savePortfolio } from './adminApi';

const emptyForm = {
  nama_proyek: '',
  lokasi: '',
  kategori: 1,
  tahun: new Date().getFullYear(),
  deskripsi: '',
  image_url: ''
};

export const AdminPortfolio = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await getPortfolios();
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
    setForm((prev) => ({ ...prev, [name]: name === 'kategori' || name === 'tahun' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await savePortfolio({ ...form }, editingId);
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan portfolio');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      nama_proyek: item.nama_proyek || '',
      lokasi: item.lokasi || '',
      kategori: item.kategori || 1,
      tahun: item.tahun || new Date().getFullYear(),
      deskripsi: item.deskripsi || '',
      image_url: Array.isArray(item.image_url) ? item.image_url.join(', ') : (item.image_url || '')
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus portfolio ini?')) return;
    try {
      await deletePortfolio(id);
      load();
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus portfolio');
    }
  };

  return (
    <div>
      <h2 style={pageTitle}>Portfolio Management</h2>
      <p style={pageSubtitle}>Tambah, edit, atau hapus proyek yang tampil di halaman user.</p>

      <form onSubmit={handleSubmit} style={panelStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <Field label="Nama Proyek" name="nama_proyek" value={form.nama_proyek} onChange={handleChange} />
          <Field label="Lokasi" name="lokasi" value={form.lokasi} onChange={handleChange} />
          <Field label="Kategori" name="kategori" value={form.kategori} onChange={handleChange} type="number" />
          <Field label="Tahun" name="tahun" value={form.tahun} onChange={handleChange} type="number" />
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="URL Gambar" name="image_url" value={form.image_url} onChange={handleChange} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Deskripsi" name="deskripsi" value={form.deskripsi} onChange={handleChange} />
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} style={{ background: '#e5e7eb', color: '#111827', borderRadius: '12px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>
              Batal
            </button>
          )}
          <button type="submit" style={{ background: '#1d4d2d', color: '#fff', borderRadius: '12px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>
            {editingId ? 'Update Portfolio' : 'Tambah Portfolio'}
          </button>
        </div>
      </form>

      <div style={{ marginTop: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
        {loading ? <div style={panelStyle}>Memuat data...</div> : items.map((item) => (
          <div key={item.id} style={panelStyle}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
              {item.image_url ? <img src={item.image_url} alt={item.nama_proyek} style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '12px' }} /> : <div style={{ width: '72px', height: '72px', borderRadius: '12px', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>IMG</div>}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>{item.nama_proyek}</div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{item.lokasi}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.88rem', color: '#4b5563', marginBottom: '8px' }}>Kategori: {item.kategori}</div>
            <div style={{ fontSize: '0.88rem', color: '#4b5563', marginBottom: '12px' }}>Tahun: {item.tahun}</div>
            <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.6 }}>{item.deskripsi}</div>

            <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => handleEdit(item)} style={{ background: '#edf7ee', color: '#1d4d2d', borderRadius: '10px', padding: '8px 12px', fontWeight: 700, cursor: 'pointer' }}>Edit</button>
              <button onClick={() => handleDelete(item.id)} style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '10px', padding: '8px 12px', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
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
      style={{ width: '100%', padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: '12px', boxSizing: 'border-box' }}
    />
  </div>
);

const pageTitle = { margin: 0, fontSize: '2rem', fontWeight: 800, color: '#111827' };
const pageSubtitle = { margin: '8px 0 20px', color: '#6b7280' };
const panelStyle = {
  background: '#fff',
  borderRadius: '18px',
  padding: '22px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
};
