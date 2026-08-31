import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Award, Shield, Layers, Headphones } from 'lucide-react';
import { HeroFloatingBadge } from '../components/FloatingCta';

export const AboutGhazi = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  const sportsSlides = [
    "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80"
  ];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % sportsSlides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + sportsSlides.length) % sportsSlides.length);
  };

  const sportsCategories = [
    { title: "Futsal", img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80" },
    { title: "Minisoccer", img: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=600&q=80" },
    { title: "Mini golf", img: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=600&q=80" },
    { title: "Area olahraga lainnya", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80" }
  ];

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section 
        className="hero-wrapper"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1800&q=80')` }}
      >
        <div className="hero-overlay" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-tag">
              Tentang Ghazi SportsHub
            </div>
            <h1 className="hero-title">
              Spesialis Pembangunan Lapangan Olahraga Profesional
            </h1>
            <p className="hero-subtitle">
              Kami menghadirkan pembangunan lapangan olahraga berstandar tinggi dengan material berkualitas untuk performa maksimal atlet dan kepuasan komunitas.
            </p>
          </div>
        </div>

        <HeroFloatingBadge />
      </section>

      {/* 2. SIAPA KAMI SECTION */}
      <section style={{ padding: '80px 0', background: 'var(--white)' }}>
        <div className="container">
          <div className="dual-brand-grid">
            <div>
              <span className="section-tag">SIAPA KAMI</span>
              <h2 className="section-title">
                Unit Khusus untuk Pembangunan Fasilitas Olahraga
              </h2>
              <p className="section-subtitle" style={{ marginBottom: '24px' }}>
                GhaziSportsHub merupakan unit pengembangan dari Adinko yang fokus pada pembangunan lapangan olahraga seperti Mini Soccer, Futsal, hingga Tenis dengan fasilitas terbaik.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span className="badge-tag" style={{ background: 'var(--green-600)', color: '#FFF' }}>Mini Soccer</span>
                <span className="badge-tag" style={{ background: 'var(--green-600)', color: '#FFF' }}>Futsal Arena</span>
                <span className="badge-tag" style={{ background: 'var(--green-600)', color: '#FFF' }}>Tenis</span>
              </div>
            </div>

            {/* Image Carousel */}
            <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', height: 'clamp(230px, 45vw, 360px)', boxShadow: 'var(--shadow-md)' }}>
              <img 
                src={sportsSlides[activeSlide]} 
                alt="Lapangan Olahraga Ghazi" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              
              <button 
                onClick={handlePrevSlide}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.85)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--black)'
                }}
                aria-label="Previous Slide"
              >
                <ChevronLeft size={20} />
              </button>

              <button 
                onClick={handleNextSlide}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.85)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--black)'
                }}
                aria-label="Next Slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VISI & MISI SECTION */}
      <section style={{ padding: '80px 0', background: 'var(--gray-bg)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '40px' }}>
            <span className="section-tag">VISI & MISI</span>
            <h2 className="section-title">
              Membangun Fasilitas Olahraga Berkualitas
            </h2>
            <p className="section-subtitle mx-auto">
              Kami berkomitmen memberikan layanan terbaik untuk kualitas produk, kepuasan pengerjaan, dan kepuasan pelanggan.
            </p>
          </div>

          <div className="vision-mission-grid">
            {/* Left: Image with Nilai Kami Tags */}
            <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
              <img 
                src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80" 
                alt="Gawang dan Rumput Lapangan Ghazi" 
                style={{ width: '100%', height: '340px', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                right: '16px',
                background: 'rgba(13, 21, 11, 0.75)',
                backdropFilter: 'blur(8px)',
                padding: '16px 20px',
                borderRadius: '16px',
                color: '#FFFFFF'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Nilai Kami</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="badge-tag">Kualitas</span>
                  <span className="badge-tag">Ketahanan</span>
                  <span className="badge-tag">Profesionalitas</span>
                </div>
              </div>
            </div>

            {/* Right: Visi & Misi Boxes */}
            <div>
              <div className="box-visi">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--green-700)', marginBottom: '8px' }}>
                  Visi Kami
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#333333', lineHeight: 1.6 }}>
                  Menjadi kontraktor pembangunan lapangan olahraga terpercaya dan terdepan di Riau dan sekitarnya.
                </p>
              </div>

              <div className="box-misi">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
                  Misi Kami
                </h3>
                <ul className="misi-list">
                  <li>
                    <span className="misi-bullet" />
                    <span>Memberikan produk rumput sintetis unggul dengan standar keamanan tinggi</span>
                  </li>
                  <li>
                    <span className="misi-bullet" />
                    <span>Pelayanan profesional</span>
                  </li>
                  <li>
                    <span className="misi-bullet" />
                    <span>Harga kompetitif</span>
                  </li>
                  <li>
                    <span className="misi-bullet" />
                    <span>Pengerjaan tepat waktu</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOKUS KEUNGGULAN SECTION */}
      <section style={{ padding: '80px 0', background: 'var(--white)' }}>
        <div className="container">
          <div className="text-center">
            <span className="section-tag">FOKUS KEUNGGULAN</span>
            <h2 className="section-title">Kami Mengutamakan Kualitas di Setiap Detail</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '40px' }}>
            <div className="feature-card" style={{ cursor: 'default' }}>
              <div className="feature-card-header">
                <div className="feature-icon-box"><Award size={20} /></div>
                <span className="feature-number">001</span>
              </div>
              <div>
                <h4 className="feature-card-title">Standar Lapangan Profesional</h4>
                <p className="feature-card-desc">Konstruksi dan marking lapangan mengikuti standar resmi induk olahraga internasional.</p>
              </div>
            </div>

            <div className="feature-card" style={{ cursor: 'default' }}>
              <div className="feature-card-header">
                <div className="feature-icon-box"><Shield size={20} /></div>
                <span className="feature-number">002</span>
              </div>
              <div>
                <h4 className="feature-card-title">Konstruksi Kuat & Kokoh</h4>
                <p className="feature-card-desc">Struktur pondasi, tiang, dan jaring pagar dirancang untuk pemakaian intensif jangka panjang.</p>
              </div>
            </div>

            <div className="feature-card" style={{ cursor: 'default' }}>
              <div className="feature-card-header">
                <div className="feature-icon-box"><Layers size={20} /></div>
                <span className="feature-number">003</span>
              </div>
              <div>
                <h4 className="feature-card-title">Drainase & Ukuran Lapangan Presisi</h4>
                <p className="feature-card-desc">Sistem resapan air modern memastikan lapangan dapat segera digunakan pasca hujan lebat.</p>
              </div>
            </div>

            <div className="feature-card" style={{ cursor: 'default' }}>
              <div className="feature-card-header">
                <div className="feature-icon-box"><Headphones size={20} /></div>
                <span className="feature-number">004</span>
              </div>
              <div>
                <h4 className="feature-card-title">Dukungan Perawatan Pasca Selesai</h4>
                <p className="feature-card-desc">Layanan purna jual berkala untuk menjaga kualitas dan performa rumput tetap prima.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PEMBANGUNAN LAPANGAN SESUAI KEBUTUHAN ANDA */}
      <section style={{ padding: '80px 0', background: 'var(--gray-bg)' }}>
        <div className="container">
          <div className="text-center">
            <span className="section-tag">FASILITAS OLAHRAGA</span>
            <h2 className="section-title">Pembangunan Lapangan Sesuai Kebutuhan Anda</h2>
            <p className="section-subtitle mx-auto">
              Mulai dari futsal hingga mini soccer, kami menyediakan paket pengerjaan lengkap dari fondasi hingga jaring keliling.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', margin: '40px 0' }}>
            {sportsCategories.map((item, idx) => (
              <div key={idx} className="project-card">
                <div className="project-img-wrapper" style={{ height: '180px' }}>
                  <img src={item.img} alt={item.title} />
                </div>
                <div className="project-body" style={{ textAlign: 'center' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{item.title}</h4>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button 
              onClick={() => navigate('/kontak')} 
              className="btn-primary-hero"
            >
              <span>KONSULTASI GRATIS SEKARANG</span>
              <span className="arrow-circle">
                <ArrowRight size={14} />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. CTA BANNER (Dark Green Card) */}
      <section className="container" style={{ margin: '60px auto' }}>
        <div style={{ 
          background: 'var(--green-900)', 
          borderRadius: '24px', 
          padding: '60px 40px', 
          color: '#FFFFFF',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <span className="section-tag" style={{ color: 'var(--green-300)' }}>KITA SEKARANG</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '10px 0 16px 0', color: '#FFFFFF' }}>
            Bangun Lapangan Impian Anda Bersama Ghazi
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '550px', margin: '0 auto 30px auto', fontSize: '1rem' }}>
            Tentukan standar fasilitas olahraga impian Anda bersama tim ahli kami.
          </p>
          <button 
            onClick={() => navigate('/kontak')}
            style={{
              background: '#FFFFFF',
              color: 'var(--green-900)',
              padding: '14px 32px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <span>Gabung bersama kami</span>
            <span className="arrow-circle" style={{ background: 'var(--green-600)', color: '#FFFFFF' }}>
              <ArrowRight size={14} />
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};
