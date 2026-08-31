import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProjectCard } from '../components/ProjectCard';
import { HeroFloatingBadge } from '../components/FloatingCta';
import { portfolioData as fallbackPortfolios } from '../data/siteData';
import { useSiteContext } from '../context/SiteContext';

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
    // ignore invalid JSON
  }

  return value
    .split(',')
    .map((item) => item && item.trim())
    .filter(Boolean)
    .map((item) => (item.startsWith('http') || item.startsWith('data:') ? item : `${apiBase}${item.startsWith('/') ? '' : '/'}${item}`));
};

export const Portofolio = () => {
  const navigate = useNavigate();
  const { categories, apiBase } = useSiteContext();

  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [loading, setLoading] = useState(true);

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
          setProjects(fallbackPortfolios);
        }
      })
      .catch((error) => {
        console.warn('Failed to fetch portfolio, using fallback:', error.message);
        setProjects(fallbackPortfolios);
      })
      .finally(() => setLoading(false));
  }, [apiBase]);

  // Dynamic filter tabs based on category list
  const filterTabs = useMemo(() => {
    const list = ['Semua'];
    if (categories && categories.length > 0) {
      categories.forEach((cat) => {
        if (cat.kategori_layanan && !list.includes(cat.kategori_layanan)) {
          list.push(cat.kategori_layanan);
        }
      });
    }
    // Also include any categories present in projects that might not be in the category list
    projects.forEach((proj) => {
      if (proj.category && !list.includes(proj.category)) {
        list.push(proj.category);
      }
    });
    return list;
  }, [categories, projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      if (activeFilter === 'Semua') return true;
      return item.category === activeFilter;
    });
  }, [projects, activeFilter]);

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
              Hasil Pekerjaan & Portofolio Kami
            </h1>
            <p className="hero-subtitle">
              Kami telah mengerjakan berbagai proyek dengan hasil memuaskan dari skala hunian, instansi, hingga sport arena komersial besar.
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

          {/* Projects Grid */}
          <div className="portfolio-grid" style={{ marginTop: '36px' }}>
            {loading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#667068', padding: '20px' }}>
                Memuat portfolio...
              </div>
            ) : filteredProjects.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#667068', padding: '20px' }}>
                Belum ada proyek yang tersedia untuk kategori "{activeFilter}".
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
              <span>Konsultasikan Proyek Anda Sekarang</span>
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

