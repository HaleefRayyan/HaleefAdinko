import React, { useEffect, useState } from 'react';
import { uploadMediaFile, deleteMediaFile, getMediaList } from './adminApi';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${apiBase}${cleanPath}`;
};

export const AdminMedia = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [copiedName, setCopiedName] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getMediaList();
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

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploading(true);
      setMessage('');
      for (const file of files) {
        await uploadMediaFile(file);
      }
      setMessage(`Berhasil mengupload ${files.length} foto!`);
      await load();
    } catch (error) {
      console.error(error);
      alert('Upload gambar gagal: ' + error.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`Hapus ${filename}?`)) return;

    try {
      await deleteMediaFile(filename);
      setMessage(`Foto ${filename} berhasil dihapus.`);
      await load();
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus gambar: ' + error.message);
    }
  };

  const handleCopy = (url, name) => {
    const fullUrl = resolveImageUrl(url);
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedName(name);
      setTimeout(() => setCopiedName(null), 2000);
    });
  };

  return (
    <div>
      <h2 style={pageTitle}>Media Library</h2>
      <p style={pageSubtitle}>Upload, lihat, dan kelola gambar untuk proyek portofolio & website.</p>

      {message && (
        <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontWeight: 600 }}>
          ✓ {message}
        </div>
      )}

      <div style={panelStyle}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#111827', fontWeight: 700, fontSize: '1rem' }}>
          Upload Foto Baru (Mendukung Multi-Upload)
        </label>
        <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '0 0 16px 0' }}>
          Format file: JPG, PNG, WEBP, GIF (Maks. 10MB per foto)
        </p>
        <input 
          type="file" 
          accept="image/*" 
          multiple 
          onChange={handleUpload} 
          disabled={uploading}
          style={{
            display: 'block',
            padding: '12px',
            border: '2px dashed #cbd5e1',
            borderRadius: '12px',
            width: '100%',
            cursor: 'pointer',
            background: '#f8fafc'
          }}
        />
        {uploading && (
          <div style={{ marginTop: '12px', color: '#1d4d2d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⏳ Sedang mengupload foto ke server...</span>
          </div>
        )}
      </div>

      <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>
          Daftar Media ({items.length})
        </h3>
      </div>

      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '18px' }}>
        {loading ? (
          <div style={panelStyle}>Memuat media library...</div>
        ) : items.length === 0 ? (
          <div style={{ ...panelStyle, gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
            Belum ada foto di Media Library. Silakan upload foto pertama Anda di atas.
          </div>
        ) : (
          items.map((item) => {
            const imgSrc = resolveImageUrl(item.url || item.name);
            const isCopied = copiedName === item.name;

            return (
              <div key={item.name} style={panelStyle}>
                <div style={{ position: 'relative', height: '160px', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px', background: '#f1f5f9' }}>
                  <img 
                    src={imgSrc} 
                    alt={item.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                </div>
                <div style={{ wordBreak: 'break-all', fontSize: '0.8rem', color: '#374151', marginBottom: '12px', fontWeight: 600, maxHeight: '36px', overflow: 'hidden' }}>
                  {item.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                  <button 
                    onClick={() => handleCopy(item.url || item.name, item.name)} 
                    style={{ 
                      flex: 1,
                      background: isCopied ? '#ecfdf5' : '#f1f5f9', 
                      color: isCopied ? '#065f46' : '#334155', 
                      border: '1px solid',
                      borderColor: isCopied ? '#a7f3d0' : '#e2e8f0',
                      borderRadius: '8px', 
                      padding: '7px 10px', 
                      fontSize: '0.78rem',
                      fontWeight: 700, 
                      cursor: 'pointer' 
                    }}
                  >
                    {isCopied ? '✓ Tersalin' : '📋 Copy URL'}
                  </button>
                  <button 
                    onClick={() => handleDelete(item.name)} 
                    style={{ 
                      background: '#fee2e2', 
                      color: '#991b1b', 
                      border: '1px solid #fecaca', 
                      borderRadius: '8px', 
                      padding: '7px 12px', 
                      fontSize: '0.78rem',
                      fontWeight: 700, 
                      cursor: 'pointer' 
                    }}
                  >
                    Hapus
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

const pageTitle = { margin: 0, fontSize: '2rem', fontWeight: 800, color: '#111827' };
const pageSubtitle = { margin: '8px 0 20px', color: '#6b7280' };
const panelStyle = {
  background: '#fff',
  borderRadius: '18px',
  padding: '22px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
  border: '1px solid rgba(17,24,39,0.04)'
};

