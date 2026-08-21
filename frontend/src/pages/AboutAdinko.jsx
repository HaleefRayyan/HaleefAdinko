import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, Award, ShieldCheck, Wrench, Wallet } from 'lucide-react';
import { HeroFloatingBadge } from '../components/FloatingCta';

export const AboutAdinko = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  const playgroundSlides = [
    "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80"
  ];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % playgroundSlides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + playgroundSlides.length) % playgroundSlides.length);
  };

  const solutions = [
    { title: "Taman rumah", img: "https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=600&q=80" },
    { title: "Dekorasi indoor & outdoor", img: "https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80" },
    { title: "Area komersial (cafe, kantor, dll)", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" },
    { title: "Vertical garden", img: "https://images.unsplash.com/photo-1534710961216-75c88202f43e?auto=format&fit=crop&w=600&q=80" }
  ];

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section 
        className="hero-wrapper"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=1800&q=80')` }}
      >
        <div className="hero-overlay" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-tag">
              Tentang Adinko
            </div>
            <h1 className="hero-title">
              Solusi Rumput Sintetis Berkualitas untuk Berbagai Kebutuhan
            </h1>
            <p className="hero-subtitle">
              Adinko hadir sebagai mitra terpercaya untuk kebutuhan rumput sintetis berkualitas di Pekanbaru dan Riau.
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
                Berpengalaman dalam Pemasangan Rumput Sintetis Profesional
              </h2>
              <p className="section-subtitle" style={{ marginBottom: '24px' }}>
                Adinko adalah penyedia jasa rumput sintetis di Pekanbaru yang telah dipercaya oleh berbagai klien. Fokus pada kualitas material, kerapian pengerjaan, dan hasil akhir yang estetik serta tahan lama.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => navigate('/kontak')} 
                  className="btn-primary-hero"
                  style={{ padding: '12px 24px', fontSize: '0.9rem' }}
                >
                  <span>Hubungi Kami</span>
                </button>
                <button 
                  onClick={() => navigate('/portofolio')}
                  className="btn-primary-hero"
                  style={{ background: 'var(--green-700)', padding: '12px 24px', fontSize: '0.9rem' }}
                >
                  <span>Sertifikasi & Garansi Dimensi</span>
                </button>
              </div>
            </div>

            {/* Image Slider / Carousel */}
            <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', height: '360px', boxShadow: 'var(--shadow-md)' }}>
              <img 
                src={playgroundSlides[activeSlide]} 
                alt="Playground Adinko" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              
              {/* Slider Arrows */}
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
                  color: 'var(--black)',
                  boxShadow: 'var(--shadow-sm)'
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
                  color: 'var(--black)',
                  boxShadow: 'var(--shadow-sm)'
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
              Tumbuh Menjadi Penyedia Terpercaya di Pekanbaru
            </h2>
            <p className="section-subtitle mx-auto">
              Kami berkomitmen memberikan layanan terbaik untuk kualitas produk, kerapian pengerjaan, dan kepuasan pelanggan.
            </p>
          </div>

          <div className="vision-mission-grid">
            {/* Left: Image with Nilai Kami Tags */}
            <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
              <img 
                src="https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=800&q=80" 
                alt="Instalasi Rumput Sintetis Adinko" 
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
                  <span className="badge-tag">Kerapian</span>
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
                  Menjadi penyedia rumput sintetis terbaik dan terdepan sekaligus inovatif di Riau dan sekitarnya.
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
                <p className="feature-card-desc">Kualitas material berstandar tinggi yang tahan cuaca tropis ekstrem.</p>
              </div>
            </div>

            <div className="feature-card" style={{ cursor: 'default' }}>
              <div className="feature-card-header">
                <div className="feature-icon-box"><Wrench size={20} /></div>
                <span className="feature-number">002</span>
              </div>
              <div>
                <h4 className="feature-card-title">Pemasangan Rapi & Presisi</h4>
                <p className="feature-card-desc">Dikerjakan oleh teknisi ahli berpengalaman dengan kerapian sambungan maksimal.</p>
              </div>
            </div>

            <div className="feature-card" style={{ cursor: 'default' }}>
              <div className="feature-card-header">
                <div className="feature-icon-box"><ShieldCheck size={20} /></div>
                <span className="feature-number">003</span>
              </div>
              <div>
                <h4 className="feature-card-title">Dilengkapi Sistem Drainase & Perawatan Mudah</h4>
                <p className="feature-card-desc">Lapisan drainase cepat kering sehingga bebas becek dan mudah dibersihkan.</p>
              </div>
            </div>

            <div className="feature-card" style={{ cursor: 'default' }}>
              <div className="feature-card-header">
                <div className="feature-icon-box"><Wallet size={20} /></div>
                <span className="feature-number">004</span>
              </div>
              <div>
                <h4 className="feature-card-title">Harga Transparan Tanpa Biaya Tersembunyi</h4>
                <p className="feature-card-desc">Estimasi RAB jelas dan terperinci sejak survei lokasi pertama.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SOLUSI RUMPUT SINTETIS UNTUK BERBAGAI KEBUTUHAN */}
      <section style={{ padding: '80px 0', background: 'var(--gray-bg)' }}>
        <div className="container">
          <div className="text-center">
            <span className="section-tag">PRODUK & LAYANAN</span>
            <h2 className="section-title">Solusi Rumput Sintetis untuk Berbagai Kebutuhan</h2>
            <p className="section-subtitle mx-auto">
              Kebutuhan rumput sintetis hunian maupun komersial dengan fleksibilitas pemasangan di segala medan.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', margin: '40px 0' }}>
            {solutions.map((item, idx) => (
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
            Tertarik? Mari Diskusikan Proyek Anda
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '550px', margin: '0 auto 30px auto', fontSize: '1rem' }}>
            Tentukan kebutuhan rumput sintetis impian Anda bersama tim spesialis kami.
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
