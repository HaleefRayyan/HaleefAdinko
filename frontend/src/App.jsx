import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GlobalWhatsAppSticky } from './components/FloatingCta';
import { ScrollToTop } from './components/ScrollToTop';

import { Home } from './pages/Home';
import { AboutAdinko } from './pages/AboutAdinko';
import { AboutGhazi } from './pages/AboutGhazi';
import { Layanan } from './pages/Layanan';
import { Portofolio } from './pages/Portofolio';
import { Testimoni } from './pages/Testimoni';
import { Kontak } from './pages/Kontak';

export const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Floating Capsule Header */}
        <Navbar />

        {/* Page Content */}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tentang-adinko" element={<AboutAdinko />} />
            <Route path="/tentang-ghazi" element={<AboutGhazi />} />
            <Route path="/layanan" element={<Layanan />} />
            <Route path="/portofolio" element={<Portofolio />} />
            <Route path="/testimoni" element={<Testimoni />} />
            <Route path="/kontak" element={<Kontak />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Floating Sticky WhatsApp button */}
        <GlobalWhatsAppSticky />

        {/* Global Dark Green Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
