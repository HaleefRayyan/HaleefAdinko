import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { siteConfig } from '../data/siteData';

// Hero Section Floating Badge
export const HeroFloatingBadge = () => {
  const handleWaClick = () => {
    window.open(`https://wa.me/${siteConfig.contacts.directWaNumber}?text=Halo%20Adinko%20%26%20GhaziSportsHub,%20saya%20ingin%20konsultasi%20pembuatan%20taman%20/%20lapangan%20olahraga`, '_blank');
  };

  return (
    <div className="hero-floating-badge">
      <div className="slot-badge">
        Slot terbatas - Pesan sekarang!
      </div>
      <button 
        onClick={handleWaClick}
        className="whatsapp-fab" 
        aria-label="Konsultasi via WhatsApp"
        title="Chat via WhatsApp"
      >
        <MessageCircle size={28} />
      </button>
    </div>
  );
};

// Global Sticky WhatsApp Floating Button
export const GlobalWhatsAppSticky = () => {
  const handleWaClick = () => {
    window.open(`https://wa.me/${siteConfig.contacts.directWaNumber}?text=Halo%20Adinko%20%26%20GhaziSportsHub,%20saya%20tertarik%20untuk%20konsultasi%20proyek`, '_blank');
  };

  return (
    <div className="global-whatsapp-sticky">
      <button 
        onClick={handleWaClick}
        className="whatsapp-fab" 
        aria-label="Hubungi WhatsApp"
        title="Chat WhatsApp Sekarang"
      >
        <MessageCircle size={28} />
      </button>
    </div>
  );
};
