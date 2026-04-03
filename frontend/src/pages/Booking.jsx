import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllRooms, searchRooms } from '../services/roomService';
import { createBooking } from '../services/bookingService';
import { isAuthenticated } from '../services/authService';

const S = {
  page: { minHeight: '100vh', background: '#0a0a0a', color: '#f5f0e8', fontFamily: "'Georgia', serif" },
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: '72px', borderBottom: '1px solid rgba(200,170,100,0.15)', background: '#0a0a0a' },
  logo: { fontSize: '20px', fontWeight: '700', letterSpacing: '0.08em', color: '#c8aa64', textDecoration: 'none' },
  navLink: { color: '#c8b89a', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'system-ui, sans-serif' },
};

const Booking = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({ type: '', minPrice: '', maxPrice: '', available: 'true' });
  const [selected, setSelected] = useState(null);
  const [dates, setDates] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getAllRooms().then(r => { setRooms(r); setFetching(false); }).catch(() => setFetching(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setFetching(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
    const results = await searchRooms(params).catch(() => []);
    setRooms(results);
    setFetching(false);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) { navigate('/login'); return; }
    setLoading(true);
    setMessage('');
    try {
      await createBooking({ room: selected._id, ...dates });
      setMessage('success');
      setSelected(null);
      setDates({ startDate: '', endDate: '' });
    } catch (err) {
      setMessage(err.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const nights = dates.startDate && dates.endDate
    ? Math.max(0, (new Date(dates.endDate) - new Date(dates.startDate)) / 86400000)
    : 0;

  return (
    <div style={S.page}>
      {/* Nav */}
      <nav style={S.nav}>
        <Link to="/" style={S.logo}>LUXESTAY</Link>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link to="/dashboard" style={S.navLink}>Dashboard</Link>
          <Link to="/login" style={S.navLink}>Login</Link>
        </div>
      </nav>

      {/* Header */}
      <div style={{ padding: '64px 48px 40px', borderBottom: '1px solid rgba(200,170,100,0.1)' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8aa64', marginBottom: '12px', fontFamily: 'system-ui, sans-serif' }}>Our Collection</p>
        <h1 style={{ fontSize: '48px', fontWeight: '400', color: '#f5f0e8', margin: 0 }}>Find Your Room</h1>
      </div>

      {/* Filters */}
      <div style={{ background: '#111', borderBottom: '1px solid rgba(200,170,100,0.1)', padding: '24px 48px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {[
            { label: 'Room Type', key: 'type', placeholder: 'e.g. Suite', type: 'text', width: '160px' },
            { label: 'Min Price', key: 'minPrice', placeholder: '$0', type: 'number', width: '120px' },
            { label: 'Max Price', key: 'maxPrice', placeholder: '$9999', type: 'number', width: '120px' },
          ].map(({ label, key, placeholder, type, width }) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a8070', marginBottom: '8px', fontFamily: 'system-ui, sans-serif' }}>{label}</label>
              <input
                type={type} placeholder={placeholder}
                value={filters[key]}
                onChange={e => setFilters({ ...filters, [key]: e.target.value })}
                style={{ width, background: '#1a1a1a', border: '1px solid rgba(200,170,100,0.2)', color: '#f5f0e8', padding: '10px 14px', fontSize: '13px', fontFamily: 'system-ui, sans-serif', outline: 'none' }}
              />
            </div>
          ))}
          <button type="submit" style={{ background: '#c8aa64', color: '#0a0a0a', border: 'none', padding: '10px 28px', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', fontWeight: '700', cursor: 'pointer' }}>
            Search
          </button>
          <button type="button" onClick={() => { setFilters({ type: '', minPrice: '', maxPrice: '', available: 'true' }); getAllRooms().then(setRooms); }}
            style={{ background: 'transparent', border: 'none', color: '#8a8070', fontSize: '12px', fontFamily: 'system-ui, sans-serif', cursor: 'pointer', letterSpacing: '0.1em' }}>
            Clear
          </button>
        </form>
      </div>

      {/* Success message */}
      {message === 'success' && (
        <div style={{ margin: '24px 48px', background: 'rgba(200,170,100,0.1)', border: '1px solid rgba(200,170,100,0.3)', padding: '16px 24px', color: '#c8aa64', fontFamily: 'system-ui, sans-serif', fontSize: '14px' }}>
          ✓ Booking confirmed! Check your dashboard for details.
        </div>
      )}

      {/* Room Grid */}
      <div style={{ padding: '48px', maxWidth: '1400px', margin: '0 auto' }}>
        {fetching ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#8a8070', fontFamily: 'system-ui, sans-serif' }}>Loading rooms…</div>
        ) : rooms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#8a8070', fontFamily: 'system-ui, sans-serif' }}>No rooms found.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2px' }}>
            {rooms.map(room => (
              <div key={room._id}
                style={{ position: 'relative', background: '#111', cursor: room.availability ? 'pointer' : 'default', outline: selected?._id === room._id ? '2px solid #c8aa64' : '2px solid transparent', transition: 'outline 0.2s' }}
                onClick={() => room.availability && setSelected(room)}
              >
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={room.images?.[0] || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'}
                    alt={room.type}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                  {!room.availability && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#8a8070', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif' }}>Unavailable</span>
                    </div>
                  )}
                  {room.featured && (
                    <div style={{ position: 'absolute', top: '16px', left: '16px', background: '#c8aa64', color: '#0a0a0a', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '4px 10px', fontFamily: 'system-ui, sans-serif', fontWeight: '700' }}>Featured</div>
                  )}
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '400', color: '#f5f0e8', margin: 0 }}>{room.type}</h3>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '22px', color: '#c8aa64', fontWeight: '600' }}>${room.price}</span>
                      <span style={{ fontSize: '12px', color: '#8a8070', fontFamily: 'system-ui, sans-serif' }}>/night</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#8a8070', lineHeight: '1.6', fontFamily: 'system-ui, sans-serif', marginBottom: '16px' }}>{room.description}</p>
                  <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: '#6a6060', fontFamily: 'system-ui, sans-serif', marginBottom: '20px' }}>
                    <span>👥 {room.capacity} guests</span>
                    <span>📐 {room.size} sq ft</span>
                  </div>
                  {room.amenities?.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                      {room.amenities.slice(0, 3).map((a, i) => (
                        <span key={i} style={{ fontSize: '10px', letterSpacing: '0.1em', padding: '3px 10px', border: '1px solid rgba(200,170,100,0.2)', color: '#c8b89a', fontFamily: 'system-ui, sans-serif' }}>{a}</span>
                      ))}
                    </div>
                  )}
                  {room.availability && (
                    <button
                      onClick={() => { setSelected(room); setMessage(''); }}
                      style={{ width: '100%', background: selected?._id === room._id ? '#c8aa64' : 'transparent', color: selected?._id === room._id ? '#0a0a0a' : '#c8aa64', border: '1px solid #c8aa64', padding: '12px', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', cursor: 'pointer', transition: 'all 0.3s', fontWeight: '600' }}
                    >
                      {selected?._id === room._id ? '✓ Selected' : 'Select Room'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '24px' }}>
          <div style={{ background: '#111', border: '1px solid rgba(200,170,100,0.2)', width: '100%', maxWidth: '480px', padding: '48px' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8aa64', marginBottom: '12px', fontFamily: 'system-ui, sans-serif' }}>Reserve</p>
            <h3 style={{ fontSize: '28px', fontWeight: '400', color: '#f5f0e8', marginBottom: '6px' }}>{selected.type}</h3>
            <p style={{ color: '#8a8070', fontFamily: 'system-ui, sans-serif', fontSize: '14px', marginBottom: '32px' }}>${selected.price} per night</p>

            {message && message !== 'success' && (
              <div style={{ background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.3)', padding: '12px 16px', color: '#e08080', fontSize: '13px', fontFamily: 'system-ui, sans-serif', marginBottom: '20px' }}>
                {message}
              </div>
            )}

            <form onSubmit={handleBook}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Check-in', key: 'startDate' },
                  { label: 'Check-out', key: 'endDate' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a8070', marginBottom: '8px', fontFamily: 'system-ui, sans-serif' }}>{label}</label>
                    <input type="date" required
                      value={dates[key]}
                      onChange={e => setDates({ ...dates, [key]: e.target.value })}
                      style={{ width: '100%', background: '#1a1a1a', border: '1px solid rgba(200,170,100,0.2)', color: '#f5f0e8', padding: '10px 12px', fontSize: '13px', fontFamily: 'system-ui, sans-serif', outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }}
                    />
                  </div>
                ))}
              </div>

              {nights > 0 && (
                <div style={{ background: 'rgba(200,170,100,0.06)', border: '1px solid rgba(200,170,100,0.15)', padding: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#8a8070', fontSize: '13px', fontFamily: 'system-ui, sans-serif' }}>{nights} night{nights !== 1 ? 's' : ''}</span>
                  <span style={{ color: '#c8aa64', fontSize: '20px', fontWeight: '600' }}>${(selected.price * nights).toLocaleString()}</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" disabled={loading} style={{ flex: 1, background: '#c8aa64', color: '#0a0a0a', border: 'none', padding: '14px', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Confirming…' : 'Confirm Booking'}
                </button>
                <button type="button" onClick={() => { setSelected(null); setMessage(''); }}
                  style={{ flex: 1, background: 'transparent', border: '1px solid rgba(200,170,100,0.3)', color: '#c8b89a', padding: '14px', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
