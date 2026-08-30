import React from 'react';
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AdminDashboard } from './AdminDashboard';
import { AdminSiteSettings } from './AdminSiteSettings';
import { AdminHomeSettings } from './AdminHomeSettings';
import { AdminPortfolio } from './AdminPortfolio';
import { AdminTestimoni } from './AdminTestimoni';
import { AdminMedia } from './AdminMedia';
import { AdminLogin } from './AdminLogin';

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Site Settings', to: '/admin/site-settings' },
  { label: 'Home Settings', to: '/admin/home-settings' },
  { label: 'Portfolio', to: '/admin/portfolio' },
  { label: 'Testimoni', to: '/admin/testimoni' },
  { label: 'Media', to: '/admin/media' },
  { label: 'Kontak', to: '/admin/contact' }
];

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  if (!isAuthenticated && location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" replace />;
  }

  if (location.pathname === '/admin') {
    return <Navigate to={isAuthenticated ? '/admin/dashboard' : '/admin/login'} replace />;
  }

  if (location.pathname === '/admin/login' && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (location.pathname === '/admin/login') {
    return <AdminLogin />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7f6', color: '#111827' }}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <aside style={{ width: '260px', background: '#0f172a', color: '#fff', padding: '24px 18px', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '28px' }}>Admin Panel</div>

          <nav style={{ display: 'grid', gap: '10px' }}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: isActive ? '#1d4d2d' : 'transparent',
                  color: '#fff',
                  fontWeight: 600,
                  textDecoration: 'none'
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button onClick={handleLogout} style={{ marginTop: '28px', width: '100%', background: '#fff', color: '#111827', borderRadius: '12px', padding: '12px 14px', fontWeight: 700, cursor: 'pointer' }}>
            Logout
          </button>
        </aside>

        <main style={{ flex: 1, padding: '32px' }}>
          <Routes>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/site-settings" element={<AdminSiteSettings />} />
            <Route path="/home-settings" element={<AdminHomeSettings />} />
            <Route path="/portfolio" element={<AdminPortfolio />} />
            <Route path="/testimoni" element={<AdminTestimoni />} />
            <Route path="/media" element={<AdminMedia />} />
            <Route path="/contact" element={<Placeholder title="Contact Inquiries" />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const Placeholder = ({ title }) => (
  <div style={{ background: '#fff', borderRadius: '18px', padding: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
    <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{title}</h2>
    <p style={{ marginTop: '10px', color: '#6b7280' }}>
      Fitur ini masih dalam tahap pengembangan awal. Nantinya akan terhubung ke backend dan database.
    </p>
  </div>
);
