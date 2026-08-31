import React, { useEffect, useState } from 'react';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const AdminMedia = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      const res = await fetch(`${apiBase}/media`);
      const json = await res.json();
      setItems(json.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const res = await fetch(`${apiBase}/media/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error('Upload gagal');
      }

      await load();
    } catch (error) {
      console.error(error);
      alert('Upload gambar gagal');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`Hapus ${filename}?`)) return;

    try {
      const res = await fetch(`${apiBase}/media/${filename}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete gagal');
      await load();
    } catch (error) {
      console.error(error);
      alert('Delete gambar gagal');
    }
  };

  return (
    <div>
      <h2 style={pageTitle}>Media Library</h2>
      <p style={pageSubtitle}>Upload, lihat, dan hapus gambar yang digunakan di portfolio & website.</p>

      <div style={panelStyle}>
        <label style={{ display: 'block', marginBottom: '12px', color: '#374151', fontWeight: 700 }}>
          Upload Gambar Baru
        </label>
        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
        {uploading && <div style={{ marginTop: '12px', color: '#1d4d2d', fontWeight: 600 }}>Sedang upload...</div>}
      </div>

      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        {loading ? (
          <div style={panelStyle}>Memuat media...</div>
        ) : items.map((item) => (
          <div key={item.name} style={panelStyle}>
            <img src={item.url} alt={item.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }} />
            <div style={{ wordBreak: 'break-all', fontSize: '0.85rem', color: '#374151', marginBottom: '12px' }}>{item.name}</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => handleDelete(item.name)} style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '10px', padding: '8px 12px', fontWeight: 700, cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const pageTitle = { margin: 0, fontSize: '2rem', fontWeight: 800, color: '#111827' };
const pageSubtitle = { margin: '8px 0 20px', color: '#6b7280' };
const panelStyle = {
  background: '#fff',
  borderRadius: '18px',
  padding: '22px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
};
