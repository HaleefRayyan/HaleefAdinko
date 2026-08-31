import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, MapPin, Phone, ChevronRight, Navigation, Mail } from 'lucide-react';
import { InstagramIcon } from '../assets/Icons';
import { siteConfig, portfolioData as fallbackPortfolios, googleReviews } from '../data/siteData';
import { FeatureCards } from '../components/FeatureCards';
import { ProjectCard } from '../components/ProjectCard';
import { ReviewCard } from '../components/ReviewCard';
import { ContactForm } from '../components/ContactForm';
import { HeroFloatingBadge } from '../components/FloatingCta';
import { AdinkoLogo, GhaziLogo } from '../assets/Logos';
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

const normalizeImageList = (value, apiBase) => {
  if (Array.isArray(value)) {
    return value.map((item) => item && String(item).trim()).filter(Boolean);
  }

  if (typeof value !== 'string') return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => item && String(item).trim()).filter(Boolean);
    }
  } catch {
    // not json
  }

  return value
    .split(',')
    .map((item) => item && item.trim())
    .filter(Boolean)
    .map((item) => (item.startsWith('http') || item.startsWith('data:') ? item : `${apiBase}${item.startsWith('/') ? '' : '/'}${item}`));
};

export const Home = () => {
  const navigate = useNavigate();
  const { siteSettings, homeSettings, categories, apiBase } = useSiteContext();

  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  // Fetch live portfolios with fallback
  useEffect(() => {
    fetch(`${apiBase}/portfolio`)
      .then((response) => response.json())
      .then((json) => {
        const data = Array.isArray(json?.data) ? json.data : [];

        if (data.length > 0) {
          const normalized = data.map((item) => {
            const images = normalizeImageList(item.image_url, apiBase);
            const fallbackImage = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80';

            return {
              id: item.idportfolio || item.id,
              title: item.nama_proyek || 'Project',
              location: item.lokasi || 'Pekanbaru',
              category: item.kategori_layanan || 'Rumput Sintetis',
              description: item.deskripsi || '',
              image: images[0] || fallbackImage,
              images: images.length > 0 ? images : [fallbackImage]
            };
          });
          setProjects(normalized);
        } else {
          // Fallback to initial project dataset
          setProjects(fallbackPortfolios);
        }
      })
      .catch((error) => {
        console.warn('Failed to fetch dynamic portfolio, using fallback:', error.message);
        setProjects(fallbackPortfolios);
      })
      .finally(() => setLoading(false));

    // Fetch live testimonials with fallback
    fetch(`${apiBase}/testimoni`)
      .then((response) => response.json())
      .then((json) => {
        const data = Array.isArray(json?.data) ? json.data : [];

        if (data.length > 0) {
          const normalized = data.slice(0, 3).map((item, index) => ({
            id: item.id || item.idtestimoni || index + 1,
            name: item.nama_klien || 'Klien',
            time: item.waktu || 'Baru-baru ini',
            rating: Number(item.rating) || 5,
            text: item.deskripsi || '',
            avatar: FALLBACK_AVATARS[index % FALLBACK_AVATARS.length],
            category: normalizeCategory(item.kategori_layanan || item.deskripsi || ''),
            source: 'Ulasan Pelanggan'
          }));
          setTestimonials(normalized);
        } else {
          setTestimonials((googleReviews || []).slice(0, 3));
        }
      })
      .catch((error) => {
        console.warn('Failed to fetch dynamic testimonials, using fallback:', error.message);
        setTestimonials((googleReviews || []).slice(0, 3));
      })
      .finally(() => setLoadingTestimonials(false));
  }, [apiBase]);

  // Dynamic filter tabs
  const filterTabs = useMemo(() => {
    const list = ['Semua'];
    if (categories && categories.length > 0) {
      categories.forEach((cat) => {
        if (cat.kategori_layanan && !list.includes(cat.kategori_layanan)) {
          list.push(cat.kategori_layanan);
        }
      });
    }
    return list.slice(0, 7);
  }, [categories]);

  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      if (activeFilter === 'Semua') return true;
      return item.category === activeFilter;
    }).slice(0, 6);
  }, [projects, activeFilter]);

  // Average Rating
  const averageRating = useMemo(() => {
    if (!testimonials.length) return '5.0';
    const total = testimonials.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0);
    return (total / testimonials.length).toFixed(1);
  }, [testimonials]);

  return (
    <div>
      {/* 1. HERO SECTION (Dynamic from Home Settings) */}
      <section 
        className="hero-wrapper"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1800&q=80')` }}
      >
        <div className="hero-overlay" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-tag">
              {siteConfig.since || 'Pekanbaru Sejak 2019'}
            </div>
            <h1 className="hero-title">
              {homeSettings.hero_title || 'Jasa Rumput Sintetis & Lapangan Olahraga Profesional Pekanbaru'}
            </h1>
            <p className="hero-subtitle">
              {homeSettings.hero_subtitle || 'Rumput sintetis berkualitas tinggi untuk kebutuhan taman & lapangan olahraga profesional Pekanbaru & Riau.'}
            </p>
            <div className="hero-actions">
              <button 
                onClick={() => navigate('/kontak')} 
                className="btn-primary-hero"
              >
                <span>{homeSettings.cta_primary || 'Konsultasi Gratis'}</span>
                <span className="arrow-circle">
                  <ArrowRight size={14} />
                </span>
              </button>
              <button 
                onClick={() => navigate('/portofolio')} 
                className="btn-secondary-hero"
              >
                <span>{homeSettings.cta_secondary || 'Lihat Portofolio'}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Floating Top-Right Slot Badge & WhatsApp */}
        <HeroFloatingBadge />
      </section>

      {/* 2. STATS BAR */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            {siteConfig.stats.map((stat, i) => (
              <div key={i} className="stat-item">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DUAL BRAND SHOWCASE */}
      <section className="dual-brand-section">
        <div className="container">
          <div className="dual-brand-grid">
            <div>
              <span className="section-tag">DUA BRAND KAMI</span>
              <h2 className="section-title">
                Dua Brand, Satu Komitmen: Kualitas Terbaik
              </h2>
              <p className="section-subtitle" style={{ marginBottom: '28px' }}>
                Kami menghadirkan kolaborasi terpadu antara <strong>Adinko</strong> (spesialis rumput sintetis taman & lanskap hunian) serta <strong>GhaziSportsHub</strong> (kontraktor fasilitas lapangan olahraga berstandar profesional).
              </p>
              <button 
                onClick={() => navigate('/layanan')}
                className="btn-primary-hero"
                style={{ padding: '12px 24px', fontSize: '0.9rem' }}
              >
                <span>Lihat Selengkapnya</span>
                <span className="arrow-circle">
                  <ArrowRight size={14} />
                </span>
              </button>
            </div>

            <div className="dual-brand-cards">
              {/* Brand 1: Adinko */}
              <div 
                className="brand-showcase-card"
                onClick={() => navigate('/tentang-adinko')}
                style={{ cursor: 'pointer' }}
              >
                <div className="brand-card-img-wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=700&q=80" 
                    alt="Rumput Sintetis Adinko" 
                  />
                  <div className="brand-card-logo-overlay">
                    <div style={{ background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '50%' }}>
                      <AdinkoLogo size={42} showText={false} />
                    </div>
                  </div>
                </div>
                <div className="brand-card-body">
                  <h3 className="brand-card-title">Rumput Sintetis</h3>
                  <p className="brand-card-text">Taman & lanskap hunian elegan ramah anak</p>
                </div>
              </div>

              {/* Brand 2: GhaziSportsHub */}
              <div 
                className="brand-showcase-card"
                onClick={() => navigate('/tentang-ghazi')}
                style={{ cursor: 'pointer' }}
              >
                <div className="brand-card-img-wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=700&q=80" 
                    alt="Lapangan Olahraga Ghazi" 
                  />
                  <div className="brand-card-logo-overlay">
                    <div style={{ background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '50%' }}>
                      <GhaziLogo size={42} color="#FFFFFF" />
                    </div>
                  </div>
                </div>
                <div className="brand-card-body">
                  <h3 className="brand-card-title">Lapangan Olahraga</h3>
                  <p className="brand-card-text">Mini soccer, futsal, padel & jaring pengaman</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE FEATURE CARDS (Dynamic Feature Title) */}
      <section className="interactive-features-section">
        <div className="container">
          <div className="text-center">
            <span className="section-tag">KEUNGGULAN KAMI</span>
            <h2 className="section-title">
              {homeSettings.feature_title || 'Solusi Tepat untuk Hunian Anda'}
            </h2>
            <p className="section-subtitle mx-auto">
              Kualitas pengerjaan presisi dengan jaminan kepuasan dan transparansi harga untuk setiap proyek Anda.
            </p>
          </div>

          <FeatureCards activeIndexDefault={0} />

          <div className="text-center">
            <button 
              onClick={() => navigate('/kontak')} 
              className="btn-primary-hero"
            >
              <span>Konsultasi GRATIS Sekarang</span>
              <span className="arrow-circle">
                <ArrowRight size={14} />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. PORTOFOLIO (Live Dynamic Portfolio Grid) */}
      <section style={{ padding: '80px 0', background: 'var(--white)' }}>
        <div className="container">
          <div className="text-center">
            <span className="section-tag">PORTOFOLIO</span>
            <h2 className="section-title">Hasil Pekerjaan Kami</h2>
            <p className="section-subtitle mx-auto">
              Dokumentasi nyata instalasi rumput sintetis dan lapangan olahraga terbaik di Pekanbaru & Riau.
            </p>
          </div>

          {/* Filter Tabs */}
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

          {/* 6 Projects Grid */}
          <div className="portfolio-grid">
            {loading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#667068', padding: '20px' }}>
                Memuat portfolio...
              </div>
            ) : filteredProjects.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#667068', padding: '20px' }}>
                Belum ada proyek yang tersedia untuk kategori ini.
              </div>
            ) : (
              filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            )}
          </div>

          <div className="text-center" style={{ marginTop: '40px' }}>
            <button 
              onClick={() => navigate('/portofolio')} 
              className="btn-primary-hero"
            >
              <span>Lihat semua {projects.length} proyek</span>
              <span className="arrow-circle">
                <ArrowRight size={14} />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION (Live Dynamic Testimonials) */}
      <section className="container">
        <div className="testimonials-dark-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="section-tag" style={{ color: 'var(--green-300)' }}>TESTIMONI KLIEN</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
                Apa Kata Klien Kami?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', marginTop: '6px' }}>
                dari Google Review & Pelanggan Setia
              </p>
            </div>

            {/* Google Rating Star Badge */}
            <div style={{ 
              background: 'rgba(255,255,255,0.12)', 
              backdropFilter: 'blur(8px)', 
              padding: '10px 20px', 
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#FFFFFF' }}>{averageRating}</span>
              <div style={{ display: 'flex', gap: '2px', color: 'var(--gold-400)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--gold-400)" color="var(--gold-400)" />
                ))}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Rating Klien</span>
            </div>
          </div>

          {/* 3 Review Cards Grid */}
          <div className="testimonials-grid">
            {loadingTestimonials ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#d1d5db', padding: '12px' }}>
                Memuat testimoni...
              </div>
            ) : testimonials.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#d1d5db', padding: '12px' }}>
                Belum ada testimoni yang tersedia.
              </div>
            ) : (
              testimonials.map((review) => (
                <ReviewCard key={review.id} review={review} variant="dark" />
              ))
            )}
          </div>

          <div className="text-center">
            <button 
              onClick={() => navigate('/testimoni')}
              style={{
                background: '#FFFFFF',
                color: 'var(--green-900)',
                padding: '12px 28px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              <span>Lihat Semua Testimoni</span>
              <span className="arrow-circle" style={{ background: 'var(--green-600)', color: '#FFFFFF' }}>
                <ArrowRight size={14} />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. CONTACT & CONSULTATION FORM SECTION (Dynamic Site Settings) */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Left Column: Contact Details & Google Maps */}
            <div className="contact-info-card">
              <span className="section-tag">KONTAK KAMI</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px' }}>
                Hubungi Kami
              </h2>

              <div className="contact-item">
                <div className="contact-icon-box">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="contact-item-title">Alamat</div>
                  <div className="contact-item-text">{siteSettings.address || siteConfig.contacts.address}</div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-box">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="contact-item-title">WhatsApp & Telepon</div>
                  <div className="contact-item-text">
                    <div>{siteSettings.whatsapp || siteConfig.contacts.whatsappAdinko} (Customer Care)</div>
                  </div>
                </div>
              </div>

              {siteSettings.email && (
                <div className="contact-item">
                  <div className="contact-icon-box">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="contact-item-title">Email</div>
                    <div className="contact-item-text">{siteSettings.email}</div>
                  </div>
                </div>
              )}

              <div className="contact-item">
                <div className="contact-icon-box">
                  <InstagramIcon size={20} />
                </div>
                <div>
                  <div className="contact-item-title">Instagram</div>
                  <div className="contact-item-text">
                    <div>{siteConfig.contacts.instagramAdinko}</div>
                    <div>{siteConfig.contacts.instagramGhazi}</div>
                  </div>
                </div>
              </div>

              {/* Google Maps Interactive Container */}
              <div className="map-embed-wrapper">
                <iframe
                  title="Google Maps Location Adinko"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15958.672826206286!2d101.40919038715819!3d0.4970186999999947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5af7e9892ed59%3A0xcc4df6c7514c06e1!2sAdinko%20rumput%20sintetis%20pekanbaru!5e0!3m2!1sen!2sid!4v1788161205441!5m2!1sen!2sid"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <button 
                onClick={() => window.open(siteConfig.contacts.mapsUrl, '_blank')}
                className="btn-primary-hero"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>Petunjuk Arah Google Maps</span>
                <span className="arrow-circle">
                  <Navigation size={14} />
                </span>
              </button>
            </div>

            {/* Right Column: Interactive Consultation Form */}
            <ContactForm title="Kirim Pesan ke Kami" />
          </div>
        </div>
      </section>

      {/* 8. BOTTOM CTA BANNER */}
      <section style={{ padding: '40px 0', background: 'var(--green-50)', textAlign: 'center' }}>
        <div className="container">
          <p style={{ 
            fontSize: '1.25rem', 
            fontWeight: 700, 
            color: 'var(--green-800)', 
            maxWidth: '750px', 
            margin: '0 auto',
            lineHeight: 1.5
          }}>
            Jangan tunda lagi, wujudkan taman atau lapangan impian Anda bersama {siteSettings.site_name || 'Adinko & GhaziSportsHub'} sekarang!
          </p>
        </div>
      </section>
    </div>
  );
};

