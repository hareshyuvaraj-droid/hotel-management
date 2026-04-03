import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser, getUserProfile, changePassword } from '../services/authService';
import { getBookingHistory, cancelBooking } from '../services/bookingService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('bookings');
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile().then(setUser).catch(() => {});
    getBookingHistory().then(b => { setBookings(b); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleLogout = async () => { await logoutUser(); navigate('/login'); };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
    } catch {}
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMsg('');
    try {
      await changePassword(pwForm);
      setPwMsg('success');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPwMsg(err.message || 'Failed to update password');
    }
  };

  const activeBookings = bookings.filter(b => b.status === 'booked');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const nights = (b) => Math.max(0, (new Date(b.endDate) - new Date(b.startDate)) / 86400000);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f5f0e8', fontFamily: "'Georgia', serif" }}>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: '72px', borderBottom: '1px solid rgba(200,170,100,0.15)', background: '#0a0a0a' }}>
        <Link to="/" style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '0.08em', color: '#c8aa64', textDecoration: 'none' }}>LUXESTAY</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span style={{ fontSize: '13px', color: '#8a8070', fontFamily: 'system-ui, sans-serif' }}>Hello, {user?.username}</span>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(200,80,80,0.3)', color: '#e08080', padding: '8px 20px', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '64px 48px' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8aa64', marginBottom: '12px', fontFamily: 'system-ui, sans-serif' }}>Member Portal</p>
          <h1 style={{ fontSize: '42px', fontWeight: '400', color: '#f5f0e8', margin: 0 }}>My Dashboard</h1>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', marginBottom: '48px' }}>
          {[
            { label: 'Total Bookings', value: bookings.length },
            { label: 'Active Stays', value: activeBookings.length },
            { label: 'Completed', value: cancelledBookings.length },
          ].map((stat, i) => (
            <div key={i} style={{ background: '#111', padding: '28px 32px', borderLeft: i === 0 ? '2px solid #c8aa64' : 'none' }}>
              <div style={{ fontSize: '36px', fontWeight: '400', color: '#f5f0e8', marginBottom: '8px' }}>{stat.value}</div>
              <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a8070', fontFamily: 'system-ui, sans-serif' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '32px', borderBottom: '1px solid rgba(200,170,100,0.1)' }}>
          {['bookings', 'profile'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '14px 32px', background: 'transparent', border: 'none',
              borderBottom: tab === t ? '2px solid #c8aa64' : '2px solid transparent',
              color: tab === t ? '#c8aa64' : '#8a8070',
              fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase',
              fontFamily: 'system-ui, sans-serif', cursor: 'pointer',
              marginBottom: '-1px', transition: 'all 0.2s',
            }}>
              {t}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {tab === 'bookings' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#8a8070', fontFamily: 'system-ui, sans-serif' }}>Loading…</div>
            ) : bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px', background: '#111' }}>
                <p style={{ color: '#8a8070', fontFamily: 'system-ui, sans-serif', marginBottom: '24px', fontSize: '15px' }}>No bookings yet.</p>
                <Link to="/booking" style={{ background: '#c8aa64', color: '#0a0a0a', padding: '14px 36px', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'system-ui, sans-serif', fontWeight: '700' }}>
                  Browse Rooms
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {bookings.map(b => (
                  <div key={b._id} style={{ background: '#111', display: 'flex', alignItems: 'center', gap: '24px', padding: '0', overflow: 'hidden' }}>
                    {/* Room image */}
                    <div style={{ width: '120px', height: '90px', flexShrink: 0, overflow: 'hidden' }}>
                      <img
                        src={b.room?.images?.[0] || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'}
                        alt={b.room?.type}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    {/* Details */}
                    <div style={{ flex: 1, padding: '20px 0' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '400', color: '#f5f0e8', margin: '0 0 6px' }}>{b.room?.type || 'Room'}</h3>
                      <p style={{ fontSize: '13px', color: '#8a8070', fontFamily: 'system-ui, sans-serif', margin: 0 }}>
                        {formatDate(b.startDate)} → {formatDate(b.endDate)} · {nights(b)} night{nights(b) !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {/* Price */}
                    {b.room?.price && (
                      <div style={{ textAlign: 'right', padding: '20px' }}>
                        <div style={{ fontSize: '18px', color: '#c8aa64' }}>${(b.room.price * nights(b)).toLocaleString()}</div>
                        <div style={{ fontSize: '11px', color: '#8a8070', fontFamily: 'system-ui, sans-serif' }}>total</div>
                      </div>
                    )}
                    {/* Status & actions */}
                    <div style={{ padding: '20px 24px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                      <span style={{
                        fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase',
                        padding: '4px 12px', fontFamily: 'system-ui, sans-serif', fontWeight: '700',
                        background: b.status === 'booked' ? 'rgba(200,170,100,0.12)' : 'rgba(100,100,100,0.15)',
                        color: b.status === 'booked' ? '#c8aa64' : '#6a6060',
                        border: `1px solid ${b.status === 'booked' ? 'rgba(200,170,100,0.3)' : 'rgba(100,100,100,0.2)'}`,
                      }}>
                        {b.status}
                      </span>
                      {b.status === 'booked' && (
                        <button onClick={() => handleCancel(b._id)} style={{ background: 'transparent', border: '1px solid rgba(200,80,80,0.3)', color: '#e08080', padding: '5px 14px', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
            {/* Info */}
            <div style={{ background: '#111', padding: '40px' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c8aa64', marginBottom: '28px', fontFamily: 'system-ui, sans-serif' }}>Account Info</p>
              {[
                { label: 'Username', value: user?.username },
                { label: 'Email', value: user?.email },
                { label: 'Role', value: user?.role },
                { label: 'Member Since', value: user?.createdAt ? formatDate(user.createdAt) : '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(200,170,100,0.08)' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a8070', marginBottom: '6px', fontFamily: 'system-ui, sans-serif' }}>{label}</p>
                  <p style={{ fontSize: '15px', color: '#f5f0e8', margin: 0, fontFamily: 'system-ui, sans-serif' }}>{value || '—'}</p>
                </div>
              ))}
            </div>

            {/* Change Password */}
            <div style={{ background: '#111', padding: '40px' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c8aa64', marginBottom: '28px', fontFamily: 'system-ui, sans-serif' }}>Change Password</p>

              {pwMsg === 'success' && (
                <div style={{ background: 'rgba(200,170,100,0.08)', border: '1px solid rgba(200,170,100,0.2)', padding: '12px 16px', color: '#c8aa64', fontSize: '13px', fontFamily: 'system-ui, sans-serif', marginBottom: '20px' }}>
                  ✓ Password updated successfully
                </div>
              )}
              {pwMsg && pwMsg !== 'success' && (
                <div style={{ background: 'rgba(200,80,80,0.08)', border: '1px solid rgba(200,80,80,0.2)', padding: '12px 16px', color: '#e08080', fontSize: '13px', fontFamily: 'system-ui, sans-serif', marginBottom: '20px' }}>
                  {pwMsg}
                </div>
              )}

              <form onSubmit={handlePasswordChange}>
                {[
                  { placeholder: 'Current password', key: 'currentPassword' },
                  { placeholder: 'New password (min 8 chars)', key: 'newPassword' },
                ].map(({ placeholder, key }) => (
                  <div key={key} style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a8070', marginBottom: '8px', fontFamily: 'system-ui, sans-serif' }}>
                      {key === 'currentPassword' ? 'Current Password' : 'New Password'}
                    </label>
                    <input
                      type="password" placeholder={placeholder} required
                      minLength={key === 'newPassword' ? 8 : undefined}
                      value={pwForm[key]}
                      onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })}
                      style={{ width: '100%', background: '#1a1a1a', border: '1px solid rgba(200,170,100,0.2)', color: '#f5f0e8', padding: '12px 14px', fontSize: '13px', fontFamily: 'system-ui, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
                <button type="submit" style={{ width: '100%', background: '#c8aa64', color: '#0a0a0a', border: 'none', padding: '14px', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', fontWeight: '700', cursor: 'pointer', marginTop: '8px' }}>
                  Update Password
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
