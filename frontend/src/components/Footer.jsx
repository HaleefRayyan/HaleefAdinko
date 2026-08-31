import React from 'react';
import { Link } from 'react-router-dom';
import { DualBrandLogo } from '../assets/Logos';
import { useSiteContext } from '../context/SiteContext';

export const Footer = () => {
  const { siteSettings, getWaLink } = useSiteContext();

  return (
    <footer className="footer-dark">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info Column */}
          <div className="footer-brand-col">
            <DualBrandLogo size={42} light={true} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '16px', color: '#FFFFFF' }}>
              {siteSettings.site_name || 'Adinko × GhaziSportsHub'}
            </h3>
            <p className="footer-brand-desc">
              {siteSettings.tagline || 'Penyedia solusi rumput sintetis dan fasilitas olahraga profesional terbaik di Pekanbaru & Riau.'}
            </p>
            {siteSettings.address && (
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.84rem', marginTop: '10px', lineHeight: 1.5 }}>
                📍 {siteSettings.address}
              </div>
            )}
            <div className="footer-social-icons">
              {/* WhatsApp */}
              <a 
                href={getWaLink('Halo Adinko & GhaziSportsHub, saya ingin konsultasi')} 
                target="_blank" 
                rel="noreferrer" 
                className="social-icon-btn" 
                aria-label="WhatsApp"
                title="Hubungi via WhatsApp"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="social-icon-btn" 
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                className="social-icon-btn" 
                aria-label="YouTube"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                  <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
                </svg>
              </a>
              {/* Instagram */}
              <a 
                href="https://instagram.com/adinko.pekanbaru" 
                target="_blank" 
                rel="noreferrer" 
                className="social-icon-btn" 
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 1: PERUSAHAAN */}
          <div>
            <h4 className="footer-col-title">PERUSAHAAN</h4>
            <ul className="footer-nav-list">
              <li>
                <Link to="/tentang-adinko" className="footer-nav-link">Tentang Kami</Link>
              </li>
              <li>
                <Link to="/portofolio" className="footer-nav-link">Portofolio</Link>
              </li>
              <li>
                <Link to="/testimoni" className="footer-nav-link">Testimoni</Link>
              </li>
              <li>
                <Link to="/kontak" className="footer-nav-link">Kontak</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: ADINKO */}
          <div>
            <h4 className="footer-col-title">ADINKO</h4>
            <ul className="footer-nav-list">
              <li>
                <Link to="/layanan" className="footer-nav-link">Rumput Sintetis</Link>
              </li>
              <li>
                <Link to="/layanan" className="footer-nav-link">Vertical Garden</Link>
              </li>
              <li>
                <Link to="/layanan" className="footer-nav-link">Taman Custom</Link>
              </li>
              <li>
                <Link to="/layanan" className="footer-nav-link">Bean Bag</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: GhaziSportsHub */}
          <div>
            <h4 className="footer-col-title">GhaziSportsHub</h4>
            <ul className="footer-nav-list">
              <li>
                <Link to="/layanan" className="footer-nav-link">Lapangan Futsal</Link>
              </li>
              <li>
                <Link to="/layanan" className="footer-nav-link">Minisoccer</Link>
              </li>
              <li>
                <Link to="/layanan" className="footer-nav-link">Padel & Tenis</Link>
              </li>
              <li>
                <Link to="/layanan" className="footer-nav-link">Jogging Track</Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-copyright">
          © {new Date().getFullYear()} {siteSettings.site_name || 'Adinko × GhaziSportsHub'}. All rights reserved. Pekanbaru, Indonesia
        </div>
      </div>
    </footer>
  );
};

