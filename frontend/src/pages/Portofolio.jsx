import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProjectCard } from '../components/ProjectCard';
import { HeroFloatingBadge } from '../components/FloatingCta';

export const Portofolio = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL || '';

    fetch(`${apiBase}/portfolio`)
      .then((response) => response.json())
      .then((json) => {
        const data = Array.isArray(json?.data) ? json.data : [];

        const normalized = data.map((item) => {
          let imageUrl = item.image_url;

          // Handle JSON string arrays in image_url
          if (typeof imageUrl === 'string') {
            try {
              const parsed = JSON.parse(imageUrl);
              imageUrl = Array.isArray(parsed) ? parsed[0] : imageUrl;
            } catch {
              // If parsing fails, use as-is
            }
          }

          return {
            id: item.idportfolio || item.id,
            title: item.nama_proyek || 'Project',
            location: item.lokasi || 'Lokasi tidak tersedia',
            category: item.kategori_layanan || 'Kategori',
            description: item.deskripsi || '',
            image: imageUrl || 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80'
          };
        });

        setProjects(normalized);
      })
      .catch((error) => {
        console.error('Failed to fetch portfolio:', error);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filterTabs = ['Semua', 'Taman', 'Vertical Garden', 'Lapangan Futsal', 'Minisoccer', 'Olahraga Lainnya'];

  const filteredProjects = projects.filter(item => {
    if (activeFilter === 'Semua') return true;
    return item.category === activeFilter;
  });

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section 
        className="hero-wrapper"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1800&q=80')` }}
      >
        <div className="hero-overlay" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-tag">
              Hasil Nyata, Klien Puas
            </div>
            <h1 className="hero-title">
              Hasil Pekerjaan Kami
            </h1>
            <p className="hero-subtitle">
              Kami telah mengerjakan berbagai proyek dengan hasil memuaskan dari skala rumahan hingga komersial besar. Setiap proyek adalah bukti komitmen kami.
            </p>
          </div>
        </div>

        <HeroFloatingBadge />
      </section>

      {/* 2. PORTOFOLIO GRID & FILTERS */}
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

          {/* 9 Projects Grid */}
          <div className="portfolio-grid" style={{ marginTop: '36px' }}>
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

          <div className="text-center" style={{ marginTop: '48px' }}>
            <button 
              onClick={() => navigate('/kontak')} 
              className="btn-primary-hero"
            >
              <span>Lihat lebih banyak proyek</span>
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
