import React from 'react';
import { MapPin, Phone, MessageCircle, ArrowRight, Mail } from 'lucide-react';
import { InstagramIcon } from '../assets/Icons';
import { siteConfig } from '../data/siteData';
import { ContactForm } from '../components/ContactForm';
import { HeroFloatingBadge } from '../components/FloatingCta';
import { useSiteContext } from '../context/SiteContext';

export const Kontak = () => {
  const { siteSettings, getWaLink } = useSiteContext();

  const handleWaHeroClick = () => {
    window.open(getWaLink('Halo Adinko & GhaziSportsHub, saya ingin konsultasi langsung untuk proyek'), '_blank');
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section 
        className="hero-wrapper"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1800&q=80')` }}
      >
        <div className="hero-overlay" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-tag">
              Respons Cepat & Ramah
            </div>
            <h1 className="hero-title">
              Hubungi Kami — Kami Siap Membantu!
            </h1>
            <p className="hero-subtitle">
              Konsultasikan kebutuhan Anda sekarang juga. Tim kami siap membantu dari survei awal, perencanaan desain, pengerjaan instalasi, hingga garansi purna jual.
            </p>
            <div className="hero-actions">
              <button 
                onClick={handleWaHeroClick}
                className="btn-primary-hero"
                style={{ background: '#25D366' }}
              >
                <MessageCircle size={20} />
                <span>Konsultasi Gratis via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        <HeroFloatingBadge />
      </section>

      {/* 2. MAIN CONTACT DETAILS & FORM */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Left Column: Hubungi Kami Details & Maps */}
            <div className="contact-info-card">
              <span className="section-tag">KONTAK KAMI</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px' }}>
                Informasi Kantor & Workshop
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
                    <div>{siteSettings.whatsapp || siteConfig.contacts.whatsappAdinko} (Customer Service)</div>
                  </div>
                </div>
              </div>

              {siteSettings.email && (
                <div className="contact-item">
                  <div className="contact-icon-box">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="contact-item-title">Email Resmi</div>
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
                onClick={handleWaHeroClick}
                className="btn-primary-hero"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>Konsultasi GRATIS Sekarang</span>
                <span className="arrow-circle">
                  <ArrowRight size={14} />
                </span>
              </button>
            </div>

            {/* Right Column: Form Kirim Pesan Sekarang */}
            <ContactForm title="Kirim Pesan Sekarang" />
          </div>
        </div>
      </section>
    </div>
  );
};
