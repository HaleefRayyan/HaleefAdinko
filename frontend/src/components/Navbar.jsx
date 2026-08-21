import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { AdinkoLogo } from '../assets/Logos';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const isAboutActive = location.pathname.startsWith('/tentang');

  return (
    <header className="navbar-wrapper">
      <nav className="navbar-pill">
        {/* Logo */}
        <Link to="/" className="navbar-logo" title="Beranda Adinko x GhaziSportsHub">
          <AdinkoLogo size={44} />
        </Link>

        {/* Center Nav Links */}
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
                Tentang Adinko
              </Link>
              <Link to="/tentang-ghazi" className="dropdown-item">
                Tentang GhaziSportsHub
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

        {/* Right CTA Button */}
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
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '16px',
          right: '16px',
          background: '#FFFFFF',
          borderRadius: '18px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          padding: '24px',
          zIndex: 999,
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <Link to="/" className="dropdown-item" style={{ fontSize: '1rem', fontWeight: 600 }}>
            Beranda
          </Link>
          <div style={{ padding: '4px 14px', fontSize: '0.85rem', color: '#888888', fontWeight: 700 }}>
            TENTANG KAMI
          </div>
          <Link to="/tentang-adinko" className="dropdown-item" style={{ paddingLeft: '24px' }}>
            🌱 Tentang Adinko (Rumput Sintetis)
          </Link>
          <Link to="/tentang-ghazi" className="dropdown-item" style={{ paddingLeft: '24px' }}>
            ⚽ Tentang GhaziSportsHub (Lapangan Olahraga)
          </Link>
          <hr style={{ border: '0', borderTop: '1px solid #EEE', margin: '4px 0' }} />
          <Link to="/layanan" className="dropdown-item" style={{ fontSize: '1rem', fontWeight: 600 }}>
            Layanan
          </Link>
          <Link to="/portofolio" className="dropdown-item" style={{ fontSize: '1rem', fontWeight: 600 }}>
            Portofolio
          </Link>
          <Link to="/testimoni" className="dropdown-item" style={{ fontSize: '1rem', fontWeight: 600 }}>
            Testimoni
          </Link>
          <Link to="/kontak" className="dropdown-item" style={{ fontSize: '1rem', fontWeight: 600 }}>
            Kontak
          </Link>
          <button 
            onClick={() => navigate('/kontak')} 
            className="btn-nav-cta" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
          >
            <span>Konsultasi Sekarang</span>
            <span className="arrow-circle">
              <ArrowRight size={14} />
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
