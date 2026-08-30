import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@haleefadinko.com', password: 'admin123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${apiBase}/admin-auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || 'Login gagal');
      }

      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminUser', JSON.stringify(json.data));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1f3c2d 100%)',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: '#fff',
        borderRadius: '20px',
        padding: '32px 28px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.18)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔐</div>
          <h2 style={{ margin: 0, color: '#111827', fontSize: '1.7rem' }}>Admin Login</h2>
          <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: '0.92rem' }}>
            Kelola halaman user dan konten website
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
              placeholder="admin@haleefadinko.com"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              style={inputStyle}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{ marginBottom: '16px', color: '#b91c1c', background: '#fef2f2', borderRadius: '10px', padding: '10px 12px', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <button type="submit" style={primaryButton} disabled={loading}>
            {loading ? 'Memeriksa...' : 'Masuk ke Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  color: '#374151',
  fontWeight: 600,
  fontSize: '0.9rem'
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid #d1d5db',
  fontSize: '0.96rem',
  outline: 'none',
  boxSizing: 'border-box'
};

const primaryButton = {
  width: '100%',
  background: '#1d4d2d',
  color: '#fff',
  borderRadius: '12px',
  padding: '12px 18px',
  fontWeight: 700,
  fontSize: '0.98rem',
  cursor: 'pointer'
};
