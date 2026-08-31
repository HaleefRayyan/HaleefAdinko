import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { siteConfig } from '../data/siteData';

const SiteContext = createContext(null);

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const defaultSiteSettings = {
  site_name: siteConfig.name || 'Adinko × GhaziSportsHub',
  tagline: siteConfig.tagline || 'Penyedia solusi rumput sintetis dan fasilitas olahraga profesional terbaik di Pekanbaru & Riau. Dipercaya oleh 1000+ klien.',
  email: 'hello@haleefadinko.com',
  whatsapp: siteConfig.contacts?.directWaNumber || '6282187515651',
  address: siteConfig.contacts?.address || 'Jl. Todak No.113 Tangkerang Barat, Kec. Marpoyan Damai, Kota Pekanbaru, Riau',
  primary_color: '#1d4d2d',
  secondary_color: '#d4a72c',
  seo_title: 'Adinko × GhaziSportsHub | Jasa Rumput Sintetis & Lapangan Olahraga Pekanbaru',
  seo_description: 'Penyedia solusi rumput sintetis dan fasilitas olahraga profesional terbaik di Pekanbaru & Riau. Konsultasi gratis untuk taman hunian, futsal, mini soccer, dan vertical garden.'
};

const defaultHomeSettings = {
  hero_title: 'Jasa Rumput Sintetis & Lapangan Olahraga Profesional Pekanbaru',
  hero_subtitle: 'Rumput sintetis berkualitas tinggi untuk kebutuhan taman & lapangan olahraga profesional Pekanbaru & Riau.',
  cta_primary: 'Konsultasi Gratis',
  cta_secondary: 'Lihat Portofolio',
  feature_title: 'Solusi Tepat untuk Hunian Anda'
};

const defaultCategories = [
  { id: 1, idkategori_layanan: 1, kategori_layanan: 'Taman' },
  { id: 2, idkategori_layanan: 2, kategori_layanan: 'Lapangan Futsal' },
  { id: 3, idkategori_layanan: 3, kategori_layanan: 'Minisoccer' },
  { id: 4, idkategori_layanan: 4, kategori_layanan: 'Vertical Garden' },
  { id: 5, idkategori_layanan: 5, kategori_layanan: 'Olahraga Lainnya' },
  { id: 6, idkategori_layanan: 6, kategori_layanan: 'Rumput Sintetis' },
  { id: 7, idkategori_layanan: 7, kategori_layanan: 'Instalasi Jaring' },
  { id: 8, idkategori_layanan: 8, kategori_layanan: 'Mini Golf' },
  { id: 9, idkategori_layanan: 9, kategori_layanan: 'Padel & Tenis' },
  { id: 10, idkategori_layanan: 10, kategori_layanan: 'Lainnya' }
];

export const SiteProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState(defaultSiteSettings);
  const [homeSettings, setHomeSettings] = useState(defaultHomeSettings);
  const [categories, setCategories] = useState(defaultCategories);
  const [loading, setLoading] = useState(true);

  const fetchSiteSettings = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/admin/site-settings`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setSiteSettings((prev) => ({ ...prev, ...json.data }));
        }
      }
    } catch (err) {
      console.warn('Could not load dynamic site settings, using defaults.', err.message);
    }
  }, []);

  const fetchHomeSettings = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/admin/home-settings`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setHomeSettings((prev) => ({ ...prev, ...json.data }));
        }
      }
    } catch (err) {
      console.warn('Could not load dynamic home settings, using defaults.', err.message);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/kategori`);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          setCategories(json.data);
        }
      }
    } catch (err) {
      console.warn('Could not load dynamic categories, using defaults.', err.message);
    }
  }, []);

  const refreshSiteData = useCallback(async () => {
    await Promise.allSettled([
      fetchSiteSettings(),
      fetchHomeSettings(),
      fetchCategories()
    ]);
  }, [fetchSiteSettings, fetchHomeSettings, fetchCategories]);

  useEffect(() => {
    refreshSiteData().finally(() => setLoading(false));
  }, [refreshSiteData]);

  // Update SEO Document Title & Description
  useEffect(() => {
    if (siteSettings.seo_title) {
      document.title = siteSettings.seo_title;
    }
    if (siteSettings.seo_description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', siteSettings.seo_description);
    }

    // Apply custom colors if specified
    if (siteSettings.primary_color) {
      document.documentElement.style.setProperty('--green-600', siteSettings.primary_color);
      document.documentElement.style.setProperty('--green-700', siteSettings.primary_color);
    }
    if (siteSettings.secondary_color) {
      document.documentElement.style.setProperty('--gold-400', siteSettings.secondary_color);
    }
  }, [siteSettings]);

  const cleanPhone = (phone) => {
    if (!phone) return '6285264456566';
    let cleaned = String(phone).replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    }
    if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned;
    }
    return cleaned;
  };

  const getWaLink = (messageText = 'Halo Adinko & GhaziSportsHub, saya ingin konsultasi') => {
    const phone = cleanPhone(siteSettings.whatsapp);
    return `https://wa.me/${phone}?text=${encodeURIComponent(messageText)}`;
  };

  return (
    <SiteContext.Provider
      value={{
        siteSettings,
        homeSettings,
        categories,
        loading,
        refreshSiteData,
        cleanPhone,
        getWaLink,
        apiBase
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteContext = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteProvider');
  }
  return context;
};
