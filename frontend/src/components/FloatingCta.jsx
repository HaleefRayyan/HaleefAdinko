import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSiteContext } from '../context/SiteContext';

// Removed: duplicate of GlobalWhatsAppSticky (floating WA icon bottom-right)
export const HeroFloatingBadge = () => null;


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

