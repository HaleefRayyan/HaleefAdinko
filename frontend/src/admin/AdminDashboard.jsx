import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPortfolios, getTestimonials, getContacts, getCategories, deleteContact } from './adminApi';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    portfolio: 0,
    testimoni: 0,
    contacts: 0,
    categories: 0
  });
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [portfolios, testimonials, contacts, categories] = await Promise.allSettled([
        getPortfolios(),
        getTestimonials(),
        getContacts(),
        getCategories()
      ]);

      const portfolioCount = portfolios.status === 'fulfilled' && Array.isArray(portfolios.value) ? portfolios.value.length : 0;
      const testimoniCount = testimonials.status === 'fulfilled' && Array.isArray(testimonials.value) ? testimonials.value.length : 0;
      const contactsList = contacts.status === 'fulfilled' && Array.isArray(contacts.value) ? contacts.value : [];
      const categoryCount = categories.status === 'fulfilled' && Array.isArray(categories.value) ? categories.value.length : 0;

      setStats({
        portfolio: portfolioCount,
        testimoni: testimoniCount,
        contacts: contactsList.length,
        categories: categoryCount
      });

      setRecentContacts(contactsList.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Hapus pesan konsultasi ini?')) return;
    try {
      await deleteContact(id);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus pesan');
    }
  };

  const statCards = [
    { label: 'Total Portfolio', value: stats.portfolio, tone: '#1d4d2d', link: '/admin/portfolio' },
    { label: 'Pesan Masuk (Leads)', value: stats.contacts, tone: '#c5a638', link: '#messages' },
    { label: 'Kategori Layanan', value: stats.categories, tone: '#4a6331', link: '/admin/portfolio' },
    { label: 'Google Rating', value: '5.0 ★', tone: '#2f7d32', link: 'https://maps.app.goo.gl/NJwGPgzB8FpBjk8A7' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div>
          <h2 style={pageTitle}>Dashboard Admin</h2>
          <p style={pageSubtitle}>Ringkasan konten aktif, leads konsultasi, dan pengelolaan sistem.</p>
        </div>
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '999px', padding: '8px 18px', color: '#065f46', fontWeight: 700, fontSize: '0.88rem' }}>
          ● Live Connected
        </div>
      </div>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        {statCards.map((item) => (
          <div
            key={item.label}
            onClick={() => item.link.startsWith('/admin') && navigate(item.link)}
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              padding: '22px 20px',
              boxShadow: '0 10px 26px rgba(17, 24, 39, 0.05)',
              border: '1px solid rgba(17, 24, 39, 0.04)',
              cursor: item.link.startsWith('/admin') ? 'pointer' : 'default',
              transition: 'transform 0.2s'
            }}
          >
            <div style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>{item.label}</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: item.tone }}>
              {loading ? '...' : item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Incoming Leads + Quick Navigation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '20px' }}>
        {/* Messages / Leads */}
        <div id="messages" style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, color: '#111827', fontSize: '1.2rem', fontWeight: 700 }}>
              Pesan Konsultasi Masuk ({recentContacts.length})
            </h3>
            <button onClick={loadData} style={{ background: 'none', border: 'none', color: '#1d4d2d', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <div style={{ color: '#6b7280', padding: '16px' }}>Memuat pesan masuk...</div>
          ) : recentContacts.length === 0 ? (
            <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
              Belum ada pesan konsultasi yang masuk dari form website.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {recentContacts.map((contact) => (
                <div key={contact.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{contact.nama_lengkap}</div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                        📍 {contact.lokasi} • Layanan: <strong style={{ color: '#1d4d2d' }}>{contact.kategori_layanan || `Kategori ${contact.kategori}`}</strong>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMessage(contact.id)}
                      style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Hapus
                    </button>
                  </div>

                  {contact.keterangan && (
                    <div style={{ fontSize: '0.88rem', color: '#334155', background: '#ffffff', padding: '10px 12px', borderRadius: '8px', marginTop: '8px', border: '1px solid #f1f5f9' }}>
                      "{contact.keterangan}"
                    </div>
                  )}

                  <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <a
                      href={`https://wa.me/${String(contact.no_whatsapp).replace(/\D/g, '')}?text=Halo%20${encodeURIComponent(contact.nama_lengkap)},%20kami%20dari%20Adinko%20%26%20GhaziSportsHub%20menerima%20pesan%20konsultasi%20Anda.`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ background: '#25D366', color: '#fff', textDecoration: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      💬 Balas via WhatsApp ({contact.no_whatsapp})
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={panelStyle}>
          <h3 style={{ margin: '0 0 16px', color: '#111827', fontSize: '1.2rem', fontWeight: 700 }}>Akses Cepat</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <button
              onClick={() => navigate('/admin/home-settings')}
              style={actionBtnStyle}
            >
              🏠 Edit Teks Hero & Beranda
            </button>
            <button
              onClick={() => navigate('/admin/site-settings')}
              style={actionBtnStyle}
            >
              ⚙️ Pengaturan Kontak & SEO
            </button>
            <button
              onClick={() => navigate('/admin/portfolio')}
              style={actionBtnStyle}
            >
              📷 Tambah / Edit Proyek Portfolio
            </button>
            <button
              onClick={() => navigate('/admin/media')}
              style={actionBtnStyle}
            >
              🖼 Buka Media Library
            </button>
            <button
              onClick={() => window.open('/', '_blank')}
              style={{ ...actionBtnStyle, background: '#1d4d2d', color: '#fff' }}
            >
              ↗ Pratinjau Website Publik (User)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const actionBtnStyle = {
  textAlign: 'left',
  background: '#edf7ee',
  color: '#1d4d2d',
  borderRadius: '12px',
  padding: '14px 16px',
  fontWeight: 700,
  fontSize: '0.92rem',
  border: '1px solid rgba(29,77,45,0.08)',
  cursor: 'pointer',
  transition: '0.2s'
};

const pageTitle = { margin: 0, fontSize: '2rem', fontWeight: 800, color: '#111827' };
const pageSubtitle = { margin: '8px 0 0', color: '#6b7280' };
const panelStyle = {
  background: '#fff',
  borderRadius: '18px',
  padding: '24px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
  border: '1px solid rgba(17, 24, 39, 0.04)'
};

