import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedRooms } from '../services/roomService';

const Landing = () => {
  const [rooms, setRooms] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    getFeaturedRooms().then(setRooms).catch(() => {});
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#0a0a0a', color: '#f5f0e8', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: '72px',
        background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(200,170,100,0.2)' : 'none',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.4s ease',
      }}>
        <span style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '0.08em', color: '#c8aa64' }}>
          LUXESTAY
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          {['About', 'Contact'].map(item => (
            <Link key={item} to={`/${item.toLowerCase()}`} style={{
              color: '#c8b89a', fontSize: '13px', letterSpacing: '0.12em',
              textDecoration: 'none', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = '#c8aa64'}
              onMouseLeave={e => e.target.style.color = '#c8b89a'}
            >{item}</Link>
          ))}
          <Link to="/login" style={{
            color: '#c8b89a', fontSize: '13px', letterSpacing: '0.12em',
            textDecoration: 'none', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = '#c8aa64'}
            onMouseLeave={e => e.target.style.color = '#c8b89a'}
          >Login</Link>
          <Link to="/register" style={{
            background: 'transparent', border: '1px solid #c8aa64', color: '#c8aa64',
            padding: '9px 24px', fontSize: '12px', letterSpacing: '0.14em',
            textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'system-ui, sans-serif',
            transition: 'all 0.3s',
          }}
            onMouseEnter={e => { e.target.style.background = '#c8aa64'; e.target.style.color = '#0a0a0a'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#c8aa64'; }}
          >Reserve</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        position: 'relative', height: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center', overflow: 'hidden',
      }}>
        <img
          src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg"
          alt="hero"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.7) 100%)'
        }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '760px', padding: '0 24px' }}>
          <p style={{
            fontSize: '11px', letterSpacing: '0.35em', textTransform: 'uppercase',
            color: '#c8aa64', marginBottom: '28px', fontFamily: 'system-ui, sans-serif',
          }}>Est. 2024 · Luxury Hospitality</p>
          <h1 style={{
            fontSize: 'clamp(48px, 7vw, 88px)', fontWeight: '400', lineHeight: '1.05',
            marginBottom: '28px', color: '#f5f0e8',
            textShadow: '0 2px 40px rgba(0,0,0,0.5)',
          }}>
            Where Every Stay<br />
            <em style={{ color: '#c8aa64', fontStyle: 'italic' }}>Becomes a Memory</em>
          </h1>
          <p style={{
            fontSize: '16px', color: '#c8b89a', marginBottom: '48px', lineHeight: '1.8',
            fontFamily: 'system-ui, sans-serif', fontWeight: '300',
          }}>
            Curated luxury rooms, seamless booking,<br />and experiences that last a lifetime.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/booking" style={{
              background: '#c8aa64', color: '#0a0a0a', padding: '16px 40px',
              fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase',
              textDecoration: 'none', fontFamily: 'system-ui, sans-serif', fontWeight: '600',
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => e.target.style.background = '#e0c07a'}
              onMouseLeave={e => e.target.style.background = '#c8aa64'}
            >Book Your Stay</Link>
            <Link to="/about" style={{
              background: 'transparent', border: '1px solid rgba(200,170,100,0.5)',
              color: '#c8b89a', padding: '16px 40px',
              fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase',
              textDecoration: 'none', fontFamily: 'system-ui, sans-serif',
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.target.style.borderColor = '#c8aa64'; e.target.style.color = '#c8aa64'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'rgba(200,170,100,0.5)'; e.target.style.color = '#c8b89a'; }}
            >Discover More</Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          color: '#c8b89a', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
          fontFamily: 'system-ui, sans-serif',
          animation: 'bounce 2s infinite',
        }}>
          <span>Scroll</span>
          <span style={{ fontSize: '18px' }}>↓</span>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        background: '#c8aa64', display: 'flex', justifyContent: 'center',
        gap: '0', flexWrap: 'wrap',
      }}>
        {[
          { num: '50+', label: 'Luxury Rooms' },
          { num: '2K+', label: 'Happy Guests' },
          { num: '4.9★', label: 'Average Rating' },
          { num: '24/7', label: 'Concierge Service' },
        ].map((stat, i) => (
          <div key={i} style={{
            padding: '28px 56px', textAlign: 'center', color: '#0a0a0a',
            borderRight: i < 3 ? '1px solid rgba(0,0,0,0.15)' : 'none',
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'Georgia, serif' }}>{stat.num}</div>
            <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', marginTop: '4px', opacity: 0.75 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Featured Rooms */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8aa64', marginBottom: '16px', fontFamily: 'system-ui, sans-serif' }}>Our Collection</p>
          <h2 style={{ fontSize: '42px', fontWeight: '400', color: '#f5f0e8', marginBottom: '16px' }}>Featured Rooms</h2>
          <div style={{ width: '60px', height: '1px', background: '#c8aa64', margin: '0 auto' }} />
        </div>

        {rooms.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#c8b89a', fontFamily: 'system-ui, sans-serif' }}>No featured rooms available at the moment.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2px' }}>
            {rooms.map((room, i) => (
              <div key={room._id} style={{
                position: 'relative', overflow: 'hidden', cursor: 'pointer',
                aspectRatio: i === 0 ? '1/1.1' : '1/1',
              }}
                onMouseEnter={e => e.currentTarget.querySelector('.room-overlay').style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.querySelector('.room-overlay').style.opacity = '0'}
              >
                <img
                  src={room.images?.[0] || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'}
                  alt={room.type}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '40px 28px 28px',
                  background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 100%)',
                }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '400', color: '#f5f0e8', marginBottom: '6px' }}>{room.type}</h3>
                  <p style={{ fontSize: '13px', color: '#c8aa64', fontFamily: 'system-ui, sans-serif' }}>${room.price} / night</p>
                </div>
                <div className="room-overlay" style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', background: 'rgba(10,10,10,0.6)',
                  opacity: 0, transition: 'opacity 0.3s ease',
                }}>
                  <Link to="/booking" style={{
                    border: '1px solid #c8aa64', color: '#c8aa64', padding: '14px 32px',
                    fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase',
                    textDecoration: 'none', fontFamily: 'system-ui, sans-serif',
                    transition: 'all 0.3s',
                    background: 'transparent',
                  }}
                    onMouseEnter={e => { e.target.style.background = '#c8aa64'; e.target.style.color = '#0a0a0a'; }}
                    onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#c8aa64'; }}
                  >Reserve Now</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link to="/booking" style={{
            color: '#c8aa64', fontSize: '13px', letterSpacing: '0.18em',
            textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'system-ui, sans-serif',
            borderBottom: '1px solid #c8aa64', paddingBottom: '3px',
            transition: 'opacity 0.2s',
          }}>View All Rooms →</Link>
        </div>
      </div>

      {/* Amenities */}
      <div style={{ background: '#111', padding: '100px 48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8aa64', marginBottom: '16px', fontFamily: 'system-ui, sans-serif' }}>Why Choose Us</p>
            <h2 style={{ fontSize: '42px', fontWeight: '400', color: '#f5f0e8' }}>The LuxeStay Experience</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '48px' }}>
            {[
              { icon: '🏊', title: 'Premium Amenities', desc: 'Pool, spa, gym and fine dining all under one roof.' },
              { icon: '🔑', title: 'Seamless Check-in', desc: 'Book online and walk straight to your room.' },
              { icon: '🌿', title: 'Eco Conscious', desc: 'Sustainable practices without compromising luxury.' },
              { icon: '🎯', title: 'Concierge 24/7', desc: 'Our team is always on hand to exceed expectations.' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '20px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: '400', color: '#f5f0e8', marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: '#8a8070', lineHeight: '1.7', fontFamily: 'system-ui, sans-serif' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        position: 'relative', padding: '120px 48px', textAlign: 'center', overflow: 'hidden',
      }}>
        <img
          src="https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg"
          alt="cta"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2 }}
        />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '400', color: '#f5f0e8', marginBottom: '20px' }}>
            Ready for an Unforgettable Stay?
          </h2>
          <p style={{ color: '#c8b89a', marginBottom: '40px', fontFamily: 'system-ui, sans-serif', fontSize: '16px' }}>
            Join thousands of guests who've made LuxeStay their home away from home.
          </p>
          <Link to="/register" style={{
            background: '#c8aa64', color: '#0a0a0a', padding: '18px 48px',
            fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase',
            textDecoration: 'none', fontFamily: 'system-ui, sans-serif', fontWeight: '700',
          }}>Create Your Account</Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#050505', borderTop: '1px solid rgba(200,170,100,0.15)',
        padding: '48px', textAlign: 'center',
      }}>
        <p style={{ fontSize: '22px', fontWeight: '700', color: '#c8aa64', letterSpacing: '0.1em', marginBottom: '16px' }}>LUXESTAY</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[['About', '/about'], ['Contact', '/contact'], ['Book', '/booking'], ['Login', '/login']].map(([label, path]) => (
            <Link key={label} to={path} style={{
              color: '#8a8070', fontSize: '12px', letterSpacing: '0.12em',
              textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'system-ui, sans-serif',
            }}>{label}</Link>
          ))}
        </div>
        <p style={{ color: '#4a4540', fontSize: '12px', fontFamily: 'system-ui, sans-serif' }}>
          © {new Date().getFullYear()} LuxeStay. All rights reserved.
        </p>
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </div>
  );
};

export default Landing;
