import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const AdminLogin = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError('Email dan kata sandi wajib diisi.');
      return;
    }

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
        throw new Error(json.message || 'Email atau kata sandi tidak valid.');
      }

      // Store in sessionStorage (and localStorage if rememberMe is true with expiry)
      sessionStorage.setItem('adminAuth', 'true');
      sessionStorage.setItem('adminUser', JSON.stringify(json.data));
      sessionStorage.setItem('adminAuthTimestamp', Date.now().toString());

      if (rememberMe) {
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminUser', JSON.stringify(json.data));
        // Expire in 3 days
        localStorage.setItem('adminAuthExpiry', (Date.now() + 3 * 24 * 60 * 60 * 1000).toString());
      } else {
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminAuthExpiry');
      }

      if (onLoginSuccess) {
        onLoginSuccess(json.data);
      }
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Kombinasi email dan kata sandi salah. Silakan coba lagi.');
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
      background: 'linear-gradient(135deg, #09120b 0%, #15291b 50%, #0d150b 100%)',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(143, 224, 0, 0.12) 0%, transparent 70%)',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '24px',
        padding: '36px 30px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
        position: 'relative',
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.8)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1d4d2d, #3e7b39)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 8px 20px rgba(29, 77, 45, 0.3)',
            marginBottom: '14px'
          }}>
            <Lock size={26} />
          </div>
          <h2 style={{ margin: '0 0 6px 0', color: '#111827', fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Portal Admin
          </h2>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Silakan masuk untuk mengelola portofolio, testimoni, dan pengaturan situs.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Email Akun Admin</label>
            <div style={{ position: 'relative' }}>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                autoFocus
                value={form.email}
                onChange={handleChange}
                style={{ ...inputStyle, paddingLeft: '40px' }}
                placeholder="Masukkan email admin..."
              />
              <Mail size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Kata Sandi</label>
            <div style={{ position: 'relative' }}>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                style={{ ...inputStyle, paddingLeft: '40px', paddingRight: '42px' }}
                placeholder="Masukkan kata sandi..."
              />
              <Lock size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem', color: '#4b5563', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#1d4d2d', width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <span>Ingat saya di perangkat ini</span>
            </label>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1.5px solid #fecaca',
              color: '#991b1b',
              borderRadius: '12px',
              padding: '12px 14px',
              fontSize: '0.86rem',
              fontWeight: 600,
              lineHeight: 1.4
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...primaryButton,
              opacity: loading ? 0.7 : 1,
              marginTop: '6px'
            }}
          >
            <span>{loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#9ca3af' }}>
            <ShieldCheck size={14} color="#059669" />
            <span>Koneksi Aman & Terotentikasi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  color: '#374151',
  fontWeight: 700,
  fontSize: '0.88rem'
};

const inputStyle = {
  width: '100%',
  padding: '13px 14px',
  borderRadius: '14px',
  border: '1.5px solid #d1d5db',
  fontSize: '0.94rem',
  outline: 'none',
  boxSizing: 'border-box',
  color: '#111827',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  background: '#ffffff'
};

const primaryButton = {
  width: '100%',
  background: 'linear-gradient(135deg, #1d4d2d 0%, #2f7d32 100%)',
  color: '#ffffff',
  borderRadius: '14px',
  padding: '14px 20px',
  fontWeight: 700,
  fontSize: '0.98rem',
  cursor: 'pointer',
  border: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  boxShadow: '0 8px 22px rgba(29, 77, 45, 0.35)',
  transition: 'transform 0.15s, box-shadow 0.15s'
};

