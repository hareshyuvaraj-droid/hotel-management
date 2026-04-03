import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px', fontFamily: "'Georgia', serif" }}>
    <p style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8aa64', marginBottom: '24px', fontFamily: 'system-ui, sans-serif' }}>Error 404</p>
    <h1 style={{ fontSize: 'clamp(80px, 20vw, 180px)', fontWeight: '400', color: '#111', lineHeight: 1, margin: '0 0 8px', textShadow: '0 0 0 2px #1a1a1a', WebkitTextStroke: '1px rgba(200,170,100,0.2)' }}>404</h1>
    <h2 style={{ fontSize: '28px', fontWeight: '400', color: '#f5f0e8', margin: '0 0 16px' }}>Page not found</h2>
    <p style={{ color: '#8a8070', fontFamily: 'system-ui, sans-serif', fontSize: '15px', marginBottom: '48px', maxWidth: '400px', lineHeight: '1.7' }}>
      The page you're looking for doesn't exist or has been moved.
    </p>
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Link to="/" style={{ background: '#c8aa64', color: '#0a0a0a', padding: '14px 36px', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'system-ui, sans-serif', fontWeight: '700' }}>
        Go Home
      </Link>
      <Link to="/booking" style={{ background: 'transparent', border: '1px solid rgba(200,170,100,0.3)', color: '#c8aa64', padding: '14px 36px', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'system-ui, sans-serif' }}>
        Browse Rooms
      </Link>
    </div>
  </div>
);

export default NotFound;
