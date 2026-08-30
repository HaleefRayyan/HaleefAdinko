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
  { label: 'Media', to: '/admin/media' }
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
    <>
      <style>{`
        .admin-shell {
          min-height: 100vh;
          background: linear-gradient(180deg, #f5f7f6 0%, #edf5ee 100%);
          color: #111827;
        }

        .admin-shell-inner {
          display: flex;
          min-height: 100vh;
        }

        .admin-sidebar {
          width: 270px;
          background: linear-gradient(180deg, #0f172a 0%, #12291d 100%);
          color: #fff;
          padding: 26px 18px 20px;
          box-sizing: border-box;
          border-right: 1px solid rgba(255,255,255,0.08);
        }

        .admin-brand {
          padding: 8px 10px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 20px;
        }

        .admin-brand-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          border-radius: 14px;
          background: linear-gradient(135deg, #a68a2e, #d4be66);
          color: #0f172a;
          font-weight: 800;
          font-size: 1.1rem;
          margin-bottom: 12px;
        }

        .admin-brand-name {
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: 0.03em;
        }

        .admin-brand-sub {
          font-size: 0.74rem;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .admin-nav {
          display: grid;
          gap: 8px;
        }

        .admin-nav-link {
          display: block;
          padding: 12px 14px;
          border-radius: 12px;
          color: rgba(255,255,255,0.8);
          font-weight: 600;
          text-decoration: none;
          transition: 0.2s ease;
          border: 1px solid transparent;
        }

        .admin-nav-link:hover {
          background: rgba(255,255,255,0.05);
          color: #fff;
        }

        .admin-nav-link.active {
          background: linear-gradient(135deg, rgba(115,182,14,0.22), rgba(197,166,56,0.18));
          color: #ffffff;
          border-color: rgba(143,224,0,0.35);
          box-shadow: inset 0 0 0 1px rgba(143,224,0,0.14);
        }

        .admin-logout {
          margin-top: 26px;
          width: 100%;
          border-radius: 12px;
          padding: 12px 14px;
          background: linear-gradient(135deg, #f3f9ea 0%, #f0e7c4 100%);
          color: #0f172a;
          font-weight: 800;
          cursor: pointer;
        }

        .admin-main {
          flex: 1;
          padding: 30px 28px 40px;
        }

        .admin-page {
          max-width: 1380px;
          margin: 0 auto;
        }

        @media (max-width: 980px) {
          .admin-shell-inner {
            display: block;
          }

          .admin-sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }

          .admin-nav {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .admin-main {
            padding: 20px 16px 30px;
          }
        }

        @media (max-width: 560px) {
          .admin-nav {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="admin-shell">
        <div className="admin-shell-inner">
          <aside className="admin-sidebar">
            <div className="admin-brand">
              <div className="admin-brand-mark">A</div>
              <div className="admin-brand-name">Adinko Admin</div>
              <div className="admin-brand-sub">Content Hub</div>
            </div>

            <nav className="admin-nav">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <button onClick={handleLogout} className="admin-logout">
              Logout
            </button>
          </aside>

          <main className="admin-main">
            <div className="admin-page">
              <Routes>
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/site-settings" element={<AdminSiteSettings />} />
                <Route path="/home-settings" element={<AdminHomeSettings />} />
                <Route path="/portfolio" element={<AdminPortfolio />} />
                <Route path="/testimoni" element={<AdminTestimoni />} />
                <Route path="/media" element={<AdminMedia />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};
