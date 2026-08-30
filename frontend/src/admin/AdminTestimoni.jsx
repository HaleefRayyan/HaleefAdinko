import React, { useEffect, useState } from 'react';
import { deleteTestimoni, getTestimonials, saveTestimoni } from './adminApi';

const emptyForm = {
  nama_klien: '',
  waktu: '',
  rating: 5,
  deskripsi: ''
};

export const AdminTestimoni = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
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
    try {
      await saveTestimoni({ ...form }, editingId);
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan testimoni');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      nama_klien: item.nama_klien || '',
      waktu: item.waktu || '',
      rating: item.rating || 5,
      deskripsi: item.deskripsi || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus testimoni ini?')) return;
    try {
      await deleteTestimoni(id);
      load();
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus testimoni');
    }
  };

  return (
    <div>
      <h2 style={pageTitle}>Testimoni Management</h2>
      <p style={pageSubtitle}>Kelola ulasan pelanggan yang tampil di halaman testimoni user.</p>

      <form onSubmit={handleSubmit} style={panelStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <Field label="Nama Klien" name="nama_klien" value={form.nama_klien} onChange={handleChange} />
          <Field label="Waktu" name="waktu" value={form.waktu} onChange={handleChange} />
          <Field label="Rating" name="rating" value={form.rating} onChange={handleChange} type="number" min="1" max="5" />
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
            {editingId ? 'Update Testimoni' : 'Tambah Testimoni'}
          </button>
        </div>
      </form>

      <div style={{ marginTop: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
        {loading ? <div style={panelStyle}>Memuat data...</div> : items.map((item) => (
          <div key={item.id} style={panelStyle}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>{item.nama_klien}</div>
            <div style={{ fontSize: '0.84rem', color: '#6b7280', marginTop: '4px' }}>{item.waktu}</div>
            <div style={{ marginTop: '8px', color: '#d4a72c', fontWeight: 700 }}>⭐ {item.rating}/5</div>
            <div style={{ marginTop: '12px', color: '#374151', lineHeight: 1.6 }}>{item.deskripsi}</div>

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
