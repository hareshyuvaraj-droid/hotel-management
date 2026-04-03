import { Link } from 'react-router-dom';

const About = () => (
  <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f5f0e8', fontFamily: "'Georgia', serif" }}>
    {/* Nav */}
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: '72px', borderBottom: '1px solid rgba(200,170,100,0.15)' }}>
      <Link to="/" style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '0.08em', color: '#c8aa64', textDecoration: 'none' }}>LUXESTAY</Link>
      <Link to="/booking" style={{ background: '#c8aa64', color: '#0a0a0a', padding: '10px 24px', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'system-ui, sans-serif', fontWeight: '700' }}>Book Now</Link>
    </nav>

    {/* Hero */}
    <div style={{ position: 'relative', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src="https://images.pexels.com/photos/1542495/pexels-photo-1542495.jpeg" alt="about" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #0a0a0a)' }} />
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8aa64', marginBottom: '16px', fontFamily: 'system-ui, sans-serif' }}>Our Story</p>
        <h1 style={{ fontSize: '56px', fontWeight: '400', color: '#f5f0e8', margin: 0 }}>About LuxeStay</h1>
      </div>
    </div>

    {/* Content */}
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 48px' }}>
      <div style={{ width: '60px', height: '1px', background: '#c8aa64', marginBottom: '48px' }} />

      {[
        { title: 'Our Mission', body: 'LuxeStay is a premier hotel management platform dedicated to delivering exceptional hospitality experiences. From boutique suites to grand ballrooms, we curate accommodations that blend comfort, elegance, and modern convenience.' },
        { title: 'Our Team', body: 'Our team of hospitality professionals works around the clock to ensure every stay exceeds expectations. We partner with world-class properties to offer our guests access to the finest accommodations across the globe.' },
        { title: 'Our Promise', body: 'Every detail matters. From the thread count of your sheets to the temperature of your welcome drink — we obsess over the small things so you can focus on the moments that matter.' },
      ].map(({ title, body }) => (
        <div key={title} style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '400', color: '#f5f0e8', marginBottom: '16px' }}>{title}</h2>
          <p style={{ fontSize: '16px', color: '#8a8070', lineHeight: '1.85', fontFamily: 'system-ui, sans-serif', fontWeight: '300' }}>{body}</p>
        </div>
      ))}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2px', marginBottom: '56px' }}>
        {[['50+', 'Luxury Rooms'], ['2,000+', 'Happy Guests'], ['4.9★', 'Average Rating']].map(([n, l]) => (
          <div key={l} style={{ background: '#111', padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', color: '#c8aa64', marginBottom: '8px' }}>{n}</div>
            <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a8070', fontFamily: 'system-ui, sans-serif' }}>{l}</div>
          </div>
        ))}
      </div>

      <Link to="/booking" style={{ display: 'inline-block', background: '#c8aa64', color: '#0a0a0a', padding: '16px 40px', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'system-ui, sans-serif', fontWeight: '700' }}>
        Start Booking
      </Link>
    </div>

    <footer style={{ background: '#050505', borderTop: '1px solid rgba(200,170,100,0.1)', padding: '32px 48px', textAlign: 'center' }}>
      <p style={{ color: '#4a4540', fontSize: '12px', fontFamily: 'system-ui, sans-serif' }}>© {new Date().getFullYear()} LuxeStay. All rights reserved.</p>
    </footer>
  </div>
);

export default About;
