import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowRight, MessageCircle } from 'lucide-react';
import { AdinkoLogo } from '../assets/Logos';
import { useSiteContext } from '../context/SiteContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getWaLink } = useSiteContext();

  // Close mobile menu on route change & unlock scroll
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    setMobileAboutOpen(false);
    document.body.style.overflow = '';
  }, [location.pathname]);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isAboutActive = location.pathname.startsWith('/tentang');

  return (
    <>
      <header className="navbar-wrapper">
        <nav className="navbar-pill">
          {/* Logo */}
          <Link to="/" className="navbar-logo" title="Beranda Adinko x GhaziSportsHub">
            <AdinkoLogo size={36} />
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
              ADINKO
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="nav-links">
            {/* Dropdown: Tentang */}
            <li 
              className="nav-item"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button 
                type="button" 
                className={`nav-link ${isAboutActive ? 'active' : ''}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Tentang <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              <div className={`dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
                <Link to="/tentang-adinko" className="dropdown-item">
                  🌱 Tentang Adinko
                </Link>
                <Link to="/tentang-ghazi" className="dropdown-item">
                  ⚽ Tentang GhaziSportsHub
                </Link>
              </div>
            </li>

            <li>
              <Link to="/layanan" className={`nav-link ${location.pathname === '/layanan' ? 'active' : ''}`}>
                Layanan
              </Link>
            </li>
            <li>
              <Link to="/portofolio" className={`nav-link ${location.pathname === '/portofolio' ? 'active' : ''}`}>
                Portofolio
              </Link>
            </li>
            <li>
              <Link to="/testimoni" className={`nav-link ${location.pathname === '/testimoni' ? 'active' : ''}`}>
                Testimoni
              </Link>
            </li>
            <li>
              <Link to="/kontak" className={`nav-link ${location.pathname === '/kontak' ? 'active' : ''}`}>
                Kontak
              </Link>
            </li>
          </ul>

          {/* Desktop CTA Button */}
          <button 
            onClick={() => navigate('/kontak')} 
            className="btn-nav-cta"
            aria-label="Konsultasi Sekarang"
          >
            <span>Konsultasi</span>
            <span className="arrow-circle">
              <ArrowRight size={14} />
            </span>
          </button>

          {/* Mobile Toggle Button */}
          <button 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Tutup Menu' : 'Buka Menu'}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-nav-backdrop" 
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          className="mobile-drawer-animate"
          style={{
            position: 'fixed',
            top: '76px',
            left: '12px',
            right: '12px',
            maxHeight: 'calc(100vh - 92px)',
            overflowY: 'auto',
            background: '#FFFFFF',
            borderRadius: '20px',
            boxShadow: '0 24px 50px rgba(13,21,11,0.22)',
            padding: '20px 16px',
            zIndex: 999,
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            border: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <Link 
            to="/" 
            className="dropdown-item" 
            style={{ 
              fontSize: '1rem', 
              fontWeight: location.pathname === '/' ? 700 : 600,
              color: location.pathname === '/' ? 'var(--green-600)' : 'inherit',
              background: location.pathname === '/' ? 'var(--green-50)' : 'transparent',
              borderRadius: '12px',
              padding: '12px 14px'
            }}
          >
            🏠 Beranda
          </Link>

          {/* Collapsible Tentang Section in Mobile */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', background: isAboutActive ? 'var(--green-50)' : '#f9fafb' }}>
            <button
              type="button"
              onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                fontSize: '1rem',
                fontWeight: isAboutActive ? 700 : 600,
                color: isAboutActive ? 'var(--green-700)' : '#374151',
                cursor: 'pointer'
              }}
            >
              <span>ℹ️ Tentang Kami</span>
              <ChevronDown 
                size={16} 
                style={{ 
                  transform: mobileAboutOpen ? 'rotate(180deg)' : 'none', 
                  transition: 'transform 0.2s',
                  color: '#6b7280'
                }} 
              />
            </button>

            {mobileAboutOpen && (
              <div style={{ padding: '0 8px 10px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Link 
                  to="/tentang-adinko" 
                  className="dropdown-item" 
                  style={{ 
                    padding: '10px 14px', 
                    fontSize: '0.92rem',
                    background: location.pathname === '/tentang-adinko' ? '#ffffff' : 'transparent',
                    fontWeight: location.pathname === '/tentang-adinko' ? 700 : 500
                  }}
                >
                  🌱 Tentang Adinko (Rumput Sintetis)
                </Link>
                <Link 
                  to="/tentang-ghazi" 
                  className="dropdown-item" 
                  style={{ 
                    padding: '10px 14px', 
                    fontSize: '0.92rem',
                    background: location.pathname === '/tentang-ghazi' ? '#ffffff' : 'transparent',
                    fontWeight: location.pathname === '/tentang-ghazi' ? 700 : 500
                  }}
                >
                  ⚽ Tentang GhaziSportsHub (Lapangan)
                </Link>
              </div>
            )}
          </div>

          <Link 
            to="/layanan" 
            className="dropdown-item" 
            style={{ 
              fontSize: '1rem', 
              fontWeight: location.pathname === '/layanan' ? 700 : 600,
              color: location.pathname === '/layanan' ? 'var(--green-600)' : 'inherit',
              background: location.pathname === '/layanan' ? 'var(--green-50)' : 'transparent',
              borderRadius: '12px',
              padding: '12px 14px'
            }}
          >
            🛠️ Layanan
          </Link>

          <Link 
            to="/portofolio" 
            className="dropdown-item" 
            style={{ 
              fontSize: '1rem', 
              fontWeight: location.pathname === '/portofolio' ? 700 : 600,
              color: location.pathname === '/portofolio' ? 'var(--green-600)' : 'inherit',
              background: location.pathname === '/portofolio' ? 'var(--green-50)' : 'transparent',
              borderRadius: '12px',
              padding: '12px 14px'
            }}
          >
            📸 Portofolio Proyek
          </Link>

          <Link 
            to="/testimoni" 
            className="dropdown-item" 
            style={{ 
              fontSize: '1rem', 
              fontWeight: location.pathname === '/testimoni' ? 700 : 600,
              color: location.pathname === '/testimoni' ? 'var(--green-600)' : 'inherit',
              background: location.pathname === '/testimoni' ? 'var(--green-50)' : 'transparent',
              borderRadius: '12px',
              padding: '12px 14px'
            }}
          >
            ⭐ Testimoni &amp; Review
          </Link>

          <Link 
            to="/kontak" 
            className="dropdown-item" 
            style={{ 
              fontSize: '1rem', 
              fontWeight: location.pathname === '/kontak' ? 700 : 600,
              color: location.pathname === '/kontak' ? 'var(--green-600)' : 'inherit',
              background: location.pathname === '/kontak' ? 'var(--green-50)' : 'transparent',
              borderRadius: '12px',
              padding: '12px 14px'
            }}
          >
            📍 Hubungi Kami
          </Link>

          <hr style={{ border: '0', borderTop: '1px solid #f3f4f6', margin: '6px 0' }} />

          {/* Quick Action Buttons in Mobile Drawer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <button 
              onClick={() => navigate('/kontak')} 
              className="btn-primary-hero" 
              style={{ width: '100%', justifyContent: 'center', padding: '12px 16px', fontSize: '0.92rem' }}
            >
              <span>Konsultasi Proyek</span>
              <span className="arrow-circle">
                <ArrowRight size={14} />
              </span>
            </button>

            <button 
              onClick={() => window.open(getWaLink('Halo Adinko & GhaziSportsHub, saya ingin tanya informasi harga dan survey lokasi'), '_blank')}
              className="btn-secondary-hero" 
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                padding: '12px 16px', 
                fontSize: '0.92rem',
                background: '#25D366',
                color: '#FFFFFF',
                border: 'none'
              }}
            >
              <MessageCircle size={18} />
              <span>WhatsApp Admin (Fast Response)</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

