import React from 'react';

const stats = [
  { label: 'Portfolio', value: '12', tone: '#1d4d2d' },
  { label: 'Testimoni', value: '8', tone: '#2f7d32' },
  { label: 'Pesan Masuk', value: '24', tone: '#7c9b34' },
  { label: 'Halaman Aktif', value: '7', tone: '#4a6331' }
];

const quickActions = [
  'Edit Hero Section',
  'Tambah Portfolio Baru',
  'Update Testimoni',
  'Atur Kontak Website'
];

export const AdminDashboard = () => {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div>
          <h2 style={pageTitle}>Dashboard</h2>
          <p style={pageSubtitle}>Ringkasan konten website dan aktivitas terbaru.</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #eaf8e8 0%, #f7f0d9 100%)', borderRadius: '999px', padding: '10px 16px', color: '#214d2d', fontWeight: 700 }}>
          Live mode
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        {stats.map((item) => (
          <div key={item.label} style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fbf8 100%)', borderRadius: '18px', padding: '22px 20px', boxShadow: '0 10px 26px rgba(17, 24, 39, 0.06)', border: '1px solid rgba(17, 24, 39, 0.03)' }}>
            <div style={{ color: '#6b7280', fontSize: '0.82rem', marginBottom: '8px' }}>{item.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: item.tone }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
        <div style={panelStyle}>
          <h3 style={{ margin: '0 0 16px', color: '#111827' }}>Aktivitas Terbaru</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' }}>
            {['Portfolio “Turf Mini Soccer” diperbarui', 'Pesan baru masuk dari Bandung', 'Section home page diubah 2 jam lalu'].map((item) => (
              <li key={item} style={{ background: '#f3f4f6', borderRadius: '12px', padding: '12px 14px', color: '#374151' }}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={panelStyle}>
          <h3 style={{ margin: '0 0 16px', color: '#111827' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {quickActions.map((item) => (
              <button key={item} style={{ textAlign: 'left', background: '#edf7ee', color: '#1d4d2d', borderRadius: '12px', padding: '12px 14px', fontWeight: 600, border: '1px solid rgba(29,77,45,0.08)' }}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const pageTitle = { margin: 0, fontSize: '2rem', fontWeight: 800, color: '#111827' };
const pageSubtitle = { margin: '8px 0 0', color: '#6b7280' };
const panelStyle = {
  background: '#fff',
  borderRadius: '18px',
  padding: '22px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
  border: '1px solid rgba(17, 24, 39, 0.04)'
};
