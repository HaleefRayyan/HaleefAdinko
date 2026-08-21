import React from 'react';
import { MapPin, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { InstagramIcon } from '../assets/Icons';
import { siteConfig } from '../data/siteData';
import { ContactForm } from '../components/ContactForm';
import { HeroFloatingBadge } from '../components/FloatingCta';

export const Kontak = () => {
  const handleWaHeroClick = () => {
    window.open(`https://wa.me/${siteConfig.contacts.directWaNumber}?text=Halo%20Adinko%20%26%20GhaziSportsHub,%20saya%20ingin%20konsultasi%20langsung`, '_blank');
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
              Respons dalam 1 Jam
            </div>
            <h1 className="hero-title">
              Hubungi Kami Kami Siap Membantu!
            </h1>
            <p className="hero-subtitle">
              Konsultasikan kebutuhan Anda sekarang juga. Tim kami siap membantu dari survei awal, perencanaan, pengerjaan, hingga purna jual.
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
              <span className="section-tag">CONTACT</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px' }}>
                Hubungi Kami
              </h2>

              <div className="contact-item">
                <div className="contact-icon-box">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="contact-item-title">Alamat</div>
                  <div className="contact-item-text">{siteConfig.contacts.address}</div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-box">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="contact-item-title">WhatsApp</div>
                  <div className="contact-item-text">
                    <div>{siteConfig.contacts.whatsappAdinko} (Adinko)</div>
                    <div>{siteConfig.contacts.whatsappAdinko2}</div>
                    <div>{siteConfig.contacts.whatsappGhazi} (GhaziSportsHub)</div>
                  </div>
                </div>
              </div>

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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15958.826554559868!2d101.442!3d0.485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5a92a543e371b%3A0x6b405553e1a0b!2sTangkerang%20Barat%2C%20Pekanbaru!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
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
