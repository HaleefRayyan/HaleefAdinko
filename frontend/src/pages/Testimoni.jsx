import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, ChevronLeft, ChevronRight, ExternalLink, RefreshCw, CheckCircle } from 'lucide-react';
import { ReviewCard } from '../components/ReviewCard';
import { HeroFloatingBadge } from '../components/FloatingCta';
import { useSiteContext } from '../context/SiteContext';
import { googleReviews } from '../data/siteData';

const REVIEWS_PER_PAGE = 6;

const FALLBACK_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
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

const normalizeReview = (item, index) => ({
  id: item.id || item.idtestimoni || `r-${index}`,
  name: item.nama_klien || item.name || 'Klien',
  time: item.waktu || item.time || 'Baru-baru ini',
  rating: Number(item.rating) || 5,
  text: item.deskripsi || item.text || '',
  avatar: item.avatar || FALLBACK_AVATARS[index % FALLBACK_AVATARS.length],
  category: normalizeCategory(item.kategori_layanan || item.category || item.deskripsi || item.text || ''),
  source: item.source || 'Google Reviews',
  author_url: item.author_url || '',
  publish_time: item.publish_time || '',
});

const StarDisplay = ({ count = 5, size = 14, color = '#f59e0b' }) => (
  <span style={{ display: 'inline-flex', gap: '2px' }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={size}
        fill={i < count ? color : 'none'}
        stroke={color}
        strokeWidth={1.5}
      />
    ))}
  </span>
);

const GoogleSummaryCard = ({ place, googleMapsUrl, loading }) => {
  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #1a3d25 0%, #0f2419 100%)',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100px',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '0.9rem'
      }}>
        <RefreshCw size={18} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
        Memuat data Google Reviews...
      </div>
    );
  }

  const currentPlace = place || {
    rating: 5.0,
    total_reviews: 28,
    name: 'Adinko & GhaziSportsHub Pekanbaru'
  };

  const fullStars = Math.floor(currentPlace.rating || 5);
  const ratingDisplay = (currentPlace.rating || 5).toFixed(1);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a3d25 0%, #0f2419 100%)',
      borderRadius: '20px',
      padding: '24px 20px',
      marginBottom: '32px',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '18px',
      boxShadow: '0 16px 40px rgba(0,0,0,0.22)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '180px', height: '180px',
        background: 'radial-gradient(circle, rgba(212,167,44,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '14px',
          background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <CheckCircle size={14} color="#4ade80" />
            <span style={{ color: '#4ade80', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Google Reviews Terverifikasi
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
              {ratingDisplay}
            </span>
            <div>
              <StarDisplay count={fullStars} size={18} color="#f59e0b" />
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', margin: '2px 0 0' }}>
                dari {currentPlace.total_reviews || currentPlace.userRatingCount || 28}+ ulasan klien
              </p>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', margin: '4px 0 0' }}>
            {currentPlace.name}
          </p>
        </div>
      </div>

      <a
        href={currentPlace.googleMapsUri || googleMapsUrl || 'https://maps.google.com'}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          background: '#d4a72c', color: '#0f2419',
          padding: '11px 20px', borderRadius: '50px',
          fontWeight: 700, fontSize: '0.88rem',
          textDecoration: 'none',
          boxShadow: '0 4px 16px rgba(212,167,44,0.4)',
          width: 'auto',
          minWidth: '180px',
          textAlign: 'center',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
      >
        <ExternalLink size={15} />
        Beri Ulasan di Google
      </a>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange, sectionRef }) => {
  if (totalPages <= 1) return null;

  const handlePage = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
    if (sectionRef?.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const buildPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '…', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '…', currentPage - 1, currentPage, currentPage + 1, '…', totalPages);
    }
    return pages;
  };

  const btnBase = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '38px', height: '38px', borderRadius: '10px',
    border: '1.5px solid #e5e7eb', background: '#fff',
    cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
    transition: 'all 0.2s', color: '#374151',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '36px', flexWrap: 'wrap' }}>
      <button
        onClick={() => handlePage(currentPage - 1)}
        disabled={currentPage === 1}
        style={{ ...btnBase, width: 'auto', padding: '0 12px', gap: '4px', opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
      >
        <ChevronLeft size={16} /> Prev
      </button>

      {buildPages().map((p, idx) =>
        p === '…' ? (
          <span key={`ellipsis-${idx}`} style={{ padding: '0 2px', color: '#9ca3af' }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => handlePage(p)}
            style={{
              ...btnBase,
              background: currentPage === p ? 'var(--green-600, #1d4d2d)' : '#fff',
              color: currentPage === p ? '#fff' : '#374151',
              borderColor: currentPage === p ? 'var(--green-600, #1d4d2d)' : '#e5e7eb',
              boxShadow: currentPage === p ? '0 4px 12px rgba(29,77,45,0.3)' : 'none',
              transform: currentPage === p ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => handlePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{ ...btnBase, width: 'auto', padding: '0 12px', gap: '4px', opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
};

export const Testimoni = () => {
  const navigate = useNavigate();
  const { apiBase, siteSettings } = useSiteContext();
  const sectionRef = useRef(null);

  const initialFallback = (googleReviews || []).map(normalizeReview);
  const [reviews, setReviews] = useState(initialFallback);
  const [placeInfo, setPlaceInfo] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [sortOrder, setSortOrder] = useState('default');
  const [minRating, setMinRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${apiBase}/testimoni/google-reviews`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setReviews(json.data.map(normalizeReview));
          setPlaceInfo(json.place || null);
        } else {
          return fetch(`${apiBase}/testimoni`)
            .then((r) => r.json())
            .then((fallback) => {
              const data = Array.isArray(fallback?.data) ? fallback.data : [];
              if (data.length > 0) {
                setReviews(data.map(normalizeReview));
              } else {
                setReviews(initialFallback);
              }
            });
        }
      })
      .catch((err) => {
        console.warn('Error fetching reviews, using fallback:', err);
        setReviews(initialFallback);
      })
      .finally(() => setLoading(false));
  }, [apiBase]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, sortOrder, minRating]);

  const filterTabs = ['Semua', 'Rumput Sintetis', 'Lapangan Olahraga', 'Vertical Garden'];

  const filteredReviews = reviews
    .filter((r) => (activeFilter === 'Semua' ? true : r.category === activeFilter))
    .filter((r) => r.rating >= minRating)
    .sort((a, b) => {
      if (sortOrder === 'rating_desc') return b.rating - a.rating;
      if (sortOrder === 'rating_asc') return a.rating - b.rating;
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE));
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE,
  );

  return (
    <div>
      {/* HERO */}
      <section
        className="hero-wrapper"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1800&q=80')` }}
      >
        <div className="hero-overlay" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-tag">Kepuasan Klien adalah Prioritas Kami</div>
            <h1 className="hero-title">Apa Kata Klien Kami?</h1>
            <p className="hero-subtitle">
              Berikut ulasan langsung dari klien yang telah mempercayakan proyek instalasi
              rumput sintetis &amp; lapangan olahraga kepada kami.
            </p>
          </div>
        </div>
        <HeroFloatingBadge />
      </section>

      {/* MAIN CONTENT */}
      <section style={{ padding: '50px 0 80px 0', background: 'var(--white)' }} ref={sectionRef}>
        <div className="container">
          {/* Google Summary Card */}
          <GoogleSummaryCard
            place={placeInfo}
            googleMapsUrl={siteSettings?.google_reviews_url || 'https://maps.app.goo.gl/adinko'}
            loading={loading}
          />

          {/* Controls bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
            {/* Filter pills with horizontal scroll */}
            <div className="filter-container" style={{ margin: 0, justifyContent: 'flex-start' }}>
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

            {/* Dropdown filters grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '50px', border: '1.5px solid #e5e7eb', background: '#fff', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', color: '#374151' }}
              >
                <option value={0}>⭐ Semua Rating</option>
                <option value={5}>⭐⭐⭐⭐⭐ 5 Bintang</option>
                <option value={4}>⭐⭐⭐⭐ 4+ Bintang</option>
                <option value={3}>⭐⭐⭐ 3+ Bintang</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '50px', border: '1.5px solid #e5e7eb', background: '#fff', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', color: '#374151' }}
              >
                <option value="default">Urutan Default</option>
                <option value="rating_desc">Rating Tertinggi</option>
                <option value="rating_asc">Rating Terendah</option>
              </select>
            </div>
          </div>

          {/* Stats info */}
          {!loading && filteredReviews.length > 0 && (
            <p style={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: '20px' }}>
              Menampilkan <strong>{paginatedReviews.length}</strong> dari <strong>{filteredReviews.length}</strong> ulasan
              {activeFilter !== 'Semua' ? ` dalam kategori "${activeFilter}"` : ''}
              {' — Halaman '}<strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
            </p>
          )}

          {/* Review Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ background: '#f9fafb', borderRadius: '16px', padding: '24px', height: '180px', animation: 'pulse 1.5s ease-in-out infinite', border: '1px solid #f3f4f6' }} />
              ))
            ) : paginatedReviews.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#667068', padding: '40px' }}>
                <Star size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                <p style={{ margin: 0 }}>Belum ada ulasan untuk filter yang dipilih.</p>
              </div>
            ) : (
              paginatedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} variant="light" />
              ))
            )}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            sectionRef={sectionRef}
          />

          {/* CTA */}
          <div className="text-center" style={{ marginTop: '54px' }}>
            <button onClick={() => navigate('/kontak')} className="btn-primary-hero">
              <span>Konsultasikan Kebutuhan Anda Sekarang</span>
              <span className="arrow-circle">
                <ArrowRight size={14} />
              </span>
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

