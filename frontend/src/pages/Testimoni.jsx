import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ReviewCard } from '../components/ReviewCard';
import { HeroFloatingBadge } from '../components/FloatingCta';
import { googleReviews } from '../data/siteData';
import { useSiteContext } from '../context/SiteContext';

const FALLBACK_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
];

const normalizeCategory = (text = '') => {
  const lower = String(text).toLowerCase();

  if (lower.includes('lapangan') || lower.includes('futsal') || lower.includes('mini soccer') || lower.includes('soccer') || lower.includes('padel') || lower.includes('tenis')) {
    return 'Lapangan Olahraga';
  }
  if (lower.includes('vertical') || lower.includes('garden')) {
    return 'Vertical Garden';
  }

  return 'Rumput Sintetis';
};

const formatRelativeTime = (value) => {
  if (!value) return 'Baru-baru ini';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const elapsedSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const units = [
    ['tahun', 31536000],
    ['bulan', 2592000],
    ['minggu', 604800],
    ['hari', 86400],
    ['jam', 3600],
    ['menit', 60]
  ];

  for (const [unit, seconds] of units) {
    if (elapsedSeconds >= seconds) {
      return `${Math.floor(elapsedSeconds / seconds)} ${unit} yang lalu`;
    }
  }

  return 'Baru saja';
};

export const Testimoni = () => {
  const navigate = useNavigate();
  const { apiBase } = useSiteContext();

  const [reviews, setReviews] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiBase}/testimoni`)
      .then((response) => response.json())
      .then((json) => {
        const data = Array.isArray(json?.data) ? json.data : [];

        if (data.length > 0) {
          const normalized = data.map((item, index) => ({
            id: item.id || item.idtestimoni || index + 1,
            name: item.nama_klien || 'Klien',
            time: formatRelativeTime(item.waktu),
            rating: Number(item.rating) || 5,
            text: item.deskripsi || '',
            avatar: FALLBACK_AVATARS[index % FALLBACK_AVATARS.length],
            category: normalizeCategory(item.kategori_layanan || item.deskripsi || ''),
            source: 'Ulasan Pelanggan Terverifikasi'
          }));
          setReviews(normalized);
        } else {
          const fallbackList = (googleReviews || []).map((item, index) => ({
            id: item.id || index + 1,
            name: item.name || 'Klien',
            time: item.time || 'Baru-baru ini',
            rating: Number(item.rating) || 5,
            text: item.text || '',
            avatar: item.avatar || FALLBACK_AVATARS[index % FALLBACK_AVATARS.length],
            category: normalizeCategory(item.category || item.text || ''),
            source: item.source || 'Google Review'
          }));
          setReviews(fallbackList);
        }
      })
      .catch((error) => {
        console.warn('Failed to fetch dynamic testimonials, using fallback:', error.message);
        const fallbackList = (googleReviews || []).map((item, index) => ({
          id: item.id || index + 1,
          name: item.name || 'Klien',
          time: item.time || 'Baru-baru ini',
          rating: Number(item.rating) || 5,
          text: item.text || '',
          avatar: item.avatar || FALLBACK_AVATARS[index % FALLBACK_AVATARS.length],
          category: normalizeCategory(item.category || item.text || ''),
          source: item.source || 'Google Review'
        }));
        setReviews(fallbackList);
      })
      .finally(() => setLoading(false));
  }, [apiBase]);

  const filterTabs = ['Semua', 'Rumput Sintetis', 'Lapangan Olahraga', 'Vertical Garden'];

  const filteredReviews = reviews.filter((item) => {
    if (activeFilter === 'Semua') return true;
    return item.category === activeFilter;
  });

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section 
        className="hero-wrapper"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1800&q=80')` }}
      >
        <div className="hero-overlay" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-tag">
              Kepuasan Klien adalah Prioritas Kami
            </div>
            <h1 className="hero-title">
              Apa Kata Klien Kami?
            </h1>
            <p className="hero-subtitle">
              Berikut ulasan langsung dari klien yang telah mempercayakan proyek instalasi rumput sintetis & lapangan olahraga kepada kami.
            </p>
          </div>
        </div>

        <HeroFloatingBadge />
      </section>

      {/* 2. TESTIMONIALS FILTER & GRID */}
      <section style={{ padding: '80px 0', background: 'var(--white)' }}>
        <div className="container">
          {/* Interactive Filter Pills */}
          <div className="filter-container">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                className={`filter-pill ${activeFilter === tab ? 'active' : ''}`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Review Cards Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '24px', 
            marginTop: '36px' 
          }}>
            {loading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#667068', padding: '20px' }}>
                Memuat testimoni...
              </div>
            ) : filteredReviews.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#667068', padding: '20px' }}>
                Belum ada testimoni yang tersedia untuk kategori "{activeFilter}".
              </div>
            ) : (
              filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} variant="light" />
              ))
            )}
          </div>

          <div className="text-center" style={{ marginTop: '48px' }}>
            <button 
              onClick={() => navigate('/kontak')} 
              className="btn-primary-hero"
            >
              <span>Konsultasikan Kebutuhan Anda Sekarang</span>
              <span className="arrow-circle">
                <ArrowRight size={14} />
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

