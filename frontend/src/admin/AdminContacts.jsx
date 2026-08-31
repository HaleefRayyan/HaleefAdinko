import React, { useEffect, useState } from 'react';
import { getContacts, deleteContact } from './adminApi';
import { useSiteContext } from '../context/SiteContext';
import { 
  Users, MessageCircle, Phone, MapPin, Tag, Calendar, 
  Trash2, Search, Filter, RefreshCw, CheckCircle2, FileText, ExternalLink 
} from 'lucide-react';

export const AdminContacts = () => {
  const { siteSettings } = useSiteContext();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getContacts();
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus data pesan konsultasi dari "${name}"?`)) return;
    try {
      await deleteContact(id);
      setMessage('Pesan konsultasi berhasil dihapus.');
      loadData();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus pesan');
    }
  };

  const getCleanPhone = (phone) => {
    return String(phone || '').replace(/\D/g, '');
  };

  const handleWhatsAppReply = (contact) => {
    const phone = getCleanPhone(contact.no_whatsapp);
    const text = `Halo ${contact.nama_lengkap},\n\nTerima kasih telah menghubungi ${siteSettings.site_name || 'Adinko & GhaziSportsHub'}.\n\nKami telah menerima permintaan konsultasi Anda untuk:\n• Lokasi: ${contact.lokasi}\n• Layanan: ${contact.kategori_layanan || 'Rumput Sintetis / Olahraga'}\n${contact.keterangan ? `• Kebutuhan: ${contact.keterangan}\n` : ''}\nAda yang bisa kami bantu jelaskan lebih lanjut mengenai estimasi harga / jadwal survei lokasi?`;
    
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Categories present in contacts
  const availableCategories = Array.from(
    new Set(contacts.map((c) => c.kategori_layanan).filter(Boolean))
  );

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = 
      (c.nama_lengkap || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.no_whatsapp || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.lokasi || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.keterangan || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.kategori_layanan || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      categoryFilter === 'ALL' || c.kategori_layanan === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={pageTitle}>Kelola Kontak &amp; Klien (Leads)</h2>
          <p style={pageSubtitle}>
            Daftar data calon klien yang mengisi formulir konsultasi via website. Anda dapat langsung membalas via WhatsApp atau menghubungi via telepon.
          </p>
        </div>

        <button
          onClick={loadData}
          style={{
            background: '#ffffff',
            border: '1.5px solid #d1d5db',
            borderRadius: '12px',
            padding: '10px 16px',
            color: '#374151',
            fontWeight: 700,
            fontSize: '0.88rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
          }}
        >
          <RefreshCw size={16} className={loading ? 'spin-anim' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>

      {message && (
        <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {/* Overview Metric Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={panelStyle}>
          <div style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Total Pesan Masuk</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1d4d2d' }}>{contacts.length}</div>
          <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '4px' }}>✓ Data tersimpan aman</div>
        </div>

        <div style={panelStyle}>
          <div style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Kategori Layanan Klien</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#c5a638' }}>{availableCategories.length}</div>
          <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '4px' }}>Variasi kebutuhan proyek</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ ...panelStyle, marginBottom: '24px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama klien, WhatsApp, lokasi, atau kebutuhan..."
              style={{ ...inputStyle, paddingLeft: '40px' }}
            />
            <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Category Dropdown Filter */}
          {availableCategories.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '0 1 240px' }}>
              <Filter size={16} color="#6b7280" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={inputStyle}
              >
                <option value="ALL">Semua Kategori</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* List / Cards of Contacts */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ margin: 0, color: '#111827', fontSize: '1.2rem', fontWeight: 800 }}>
            Daftar Pesan Masuk ({filteredContacts.length})
          </h3>
        </div>

        {loading ? (
          <div style={panelStyle}>Memuat data kontak...</div>
        ) : filteredContacts.length === 0 ? (
          <div style={{ ...panelStyle, textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
            <Users size={36} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>
              {searchTerm || categoryFilter !== 'ALL' ? 'Tidak ditemukan data kontak yang sesuai dengan filter.' : 'Belum ada data pesan konsultasi yang masuk.'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {filteredContacts.map((contact, index) => {
              const cleanPhone = getCleanPhone(contact.no_whatsapp);
              return (
                <div
                  key={contact.id || index}
                  style={{
                    ...panelStyle,
                    padding: '20px 22px',
                    borderLeft: '5px solid #1d4d2d',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                          {contact.nama_lengkap}
                        </h4>
                        <span style={{
                          background: '#ecfdf5',
                          color: '#065f46',
                          border: '1px solid #a7f3d0',
                          padding: '3px 10px',
                          borderRadius: '50px',
                          fontSize: '0.78rem',
                          fontWeight: 700
                        }}>
                          {contact.kategori_layanan || `Kategori ID: ${contact.kategori}`}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px', fontSize: '0.86rem', color: '#475569' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={15} color="#1d4d2d" />
                          <strong>{contact.no_whatsapp}</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={15} color="#1d4d2d" />
                          <span>{contact.lokasi}</span>
                        </div>
                        {contact.created_at && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
                            <Calendar size={14} />
                            <span>{new Date(contact.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(contact.id, contact.nama_lengkap)}
                      style={{
                        background: '#fee2e2',
                        color: '#991b1b',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      title="Hapus data kontak ini"
                    >
                      <Trash2 size={14} />
                      <span>Hapus</span>
                    </button>
                  </div>

                  {/* Keterangan / Detail Pesan */}
                  {contact.keterangan && (
                    <div style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      fontSize: '0.9rem',
                      color: '#334155',
                      lineHeight: 1.5
                    }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                        Detail Kebutuhan / Catatan Proyek:
                      </div>
                      "{contact.keterangan}"
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                    <button
                      type="button"
                      onClick={() => window.open(`tel:+${cleanPhone}`, '_self')}
                      style={{
                        background: '#f1f5f9',
                        color: '#334155',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        padding: '8px 16px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Phone size={15} />
                      <span>Panggil Langsung</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleWhatsAppReply(contact)}
                      style={{
                        background: '#25D366',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px 18px',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)'
                      }}
                    >
                      <MessageCircle size={16} />
                      <span>Balas via WhatsApp</span>
                      <ExternalLink size={14} />
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
const inputStyle = { width: '100%', padding: '12px 14px', border: '1.5px solid #d1d5db', borderRadius: '12px', fontSize: '0.94rem', boxSizing: 'border-box', outline: 'none' };
