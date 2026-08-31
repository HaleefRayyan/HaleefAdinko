import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSiteContext } from '../context/SiteContext';

// Hero Section Floating Badge
export const HeroFloatingBadge = () => {
  const { getWaLink } = useSiteContext();

  const handleWaClick = () => {
    window.open(getWaLink('Halo Adinko & GhaziSportsHub, saya ingin konsultasi pembuatan taman / lapangan olahraga'), '_blank');
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
  const { getWaLink } = useSiteContext();

  const handleWaClick = () => {
    window.open(getWaLink('Halo Adinko & GhaziSportsHub, saya tertarik untuk konsultasi proyek'), '_blank');
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

