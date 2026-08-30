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
import { AdminLayout } from './admin/AdminLayout';

export const App = () => {
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  return (
    <BrowserRouter>
      <ScrollToTop />
      {!isAdminRoute ? (
        <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
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
          <GlobalWhatsAppSticky />
          <Footer />
        </div>
      ) : (
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;
