import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await loginUser(form);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#1a1a1a', border: '1px solid rgba(200,170,100,0.2)',
    color: '#f5f0e8', padding: '13px 16px', fontSize: '14px',
    fontFamily: 'system-ui, sans-serif', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', fontFamily: "'Georgia', serif" }}>
      {/* Left image panel */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '48px' }}>
        <img
          src="https://images.pexels.com/photos/2873951/pexels-photo-2873951.jpeg"
          alt="hotel"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 60%)' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Link to="/" style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '0.08em', color: '#c8aa64', textDecoration: 'none' }}>LUXESTAY</Link>
          <p style={{ color: '#8a8070', fontFamily: 'system-ui, sans-serif', fontSize: '14px', marginTop: '8px' }}>Luxury hospitality, seamless experience.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ width: '480px', background: '#111', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 56px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8aa64', marginBottom: '16px', fontFamily: 'system-ui, sans-serif' }}>Member Access</p>
        <h1 style={{ fontSize: '34px', fontWeight: '400', color: '#f5f0e8', margin: '0 0 8px' }}>Welcome back</h1>
        <p style={{ color: '#8a8070', fontSize: '14px', fontFamily: 'system-ui, sans-serif', marginBottom: '40px' }}>Sign in to your account</p>

        {error && (
          <div style={{ background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.3)', padding: '12px 16px', color: '#e08080', fontSize: '13px', fontFamily: 'system-ui, sans-serif', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Email Address', key: 'email', type: 'email' },
            { label: 'Password', key: 'password', type: 'password' },
          ].map(({ label, key, type }) => (
            <div key={key} style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8a8070', marginBottom: '8px', fontFamily: 'system-ui, sans-serif' }}>{label}</label>
              <input
                type={type} required
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(200,170,100,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(200,170,100,0.2)'}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            width: '100%', background: '#c8aa64', color: '#0a0a0a', border: 'none',
            padding: '15px', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase',
            fontFamily: 'system-ui, sans-serif', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, marginTop: '8px', transition: 'background 0.2s',
          }}
            onMouseEnter={e => { if (!loading) e.target.style.background = '#e0c07a'; }}
            onMouseLeave={e => e.target.style.background = '#c8aa64'}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#8a8070', marginTop: '32px', fontFamily: 'system-ui, sans-serif' }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#c8aa64', textDecoration: 'none' }}>Create one →</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
