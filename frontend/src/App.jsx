import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SiteProvider } from './context/SiteContext';
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

const PublicLayout = () => {
  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <GlobalWhatsAppSticky />
      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <SiteProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Admin CMS routes */}
          <Route path="/admin/*" element={<AdminLayout />} />

          {/* Public user routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/tentang-adinko" element={<AboutAdinko />} />
            <Route path="/tentang-ghazi" element={<AboutGhazi />} />
            <Route path="/layanan" element={<Layanan />} />
            <Route path="/portofolio" element={<Portofolio />} />
            <Route path="/testimoni" element={<Testimoni />} />
            <Route path="/kontak" element={<Kontak />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SiteProvider>
  );
};

export default App;

