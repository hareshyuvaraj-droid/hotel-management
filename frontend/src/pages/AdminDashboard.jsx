import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';
import {
  getAllUsers, updateUser, deleteUser,
  getAllRooms, createRoom, updateRoom, deleteRoom,
  getAllBookings, updateBooking, cancelBooking, deleteBooking
} from '../services/adminService';

const S = {
  page: { minHeight: '100vh', background: '#0a0a0a', color: '#f5f0e8', fontFamily: "'Georgia', serif" },
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: '72px', borderBottom: '1px solid rgba(200,170,100,0.15)', background: '#0a0a0a' },
  label: { display: 'block', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a8070', marginBottom: '8px', fontFamily: 'system-ui, sans-serif' },
  input: { width: '100%', background: '#1a1a1a', border: '1px solid rgba(200,170,100,0.2)', color: '#f5f0e8', padding: '10px 14px', fontSize: '13px', fontFamily: 'system-ui, sans-serif', outline: 'none', boxSizing: 'border-box' },
  th: { padding: '12px 20px', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8a8070', fontFamily: 'system-ui, sans-serif', fontWeight: '400', textAlign: 'left', borderBottom: '1px solid rgba(200,170,100,0.1)' },
  td: { padding: '16px 20px', fontSize: '13px', color: '#c8b89a', fontFamily: 'system-ui, sans-serif', borderBottom: '1px solid rgba(255,255,255,0.04)' },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('bookings');
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [roomForm, setRoomForm] = useState({ type: '', price: '', description: '', capacity: 2, size: 300, amenities: '', images: '', availability: true, featured: false });
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    if (tab === 'users') getAllUsers().then(setUsers).catch(() => {});
    if (tab === 'rooms') getAllRooms().then(setRooms).catch(() => {});
    if (tab === 'bookings') getAllBookings().then(setBookings).catch(() => {});
  }, [tab]);

  const handleLogout = async () => { await logoutUser(); navigate('/login'); };
  const flash = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3000); };
  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleCancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try { await cancelBooking(id); setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b)); flash('Booking cancelled'); }
    catch (e) { flash(e.message, 'error'); }
  };

  const handleDeleteBooking = async (id) => {
    if (!confirm('Permanently delete this booking?')) return;
    try { await deleteBooking(id); setBookings(prev => prev.filter(b => b._id !== id)); flash('Booking deleted'); }
    catch (e) { flash(e.message, 'error'); }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try { await deleteUser(id); setUsers(prev => prev.filter(u => u._id !== id)); flash('User deleted'); }
    catch (e) { flash(e.message, 'error'); }
  };

  const handleToggleAdmin = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try { const updated = await updateUser(user._id, { ...user, role: newRole }); setUsers(prev => prev.map(u => u._id === user._id ? updated : u)); }
    catch (e) { flash(e.message, 'error'); }
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        const updated = await updateRoom(editingRoom._id, roomForm);
        setRooms(prev => prev.map(r => r._id === editingRoom._id ? updated : r));
        flash('Room updated');
      } else {
        const created = await createRoom(roomForm);
        setRooms(prev => [created, ...prev]);
        flash('Room created');
      }
      setEditingRoom(null);
      setRoomForm({ type: '', price: '', description: '', capacity: 2, size: 300, amenities: '', images: '', availability: true, featured: false });
    } catch (e) { flash(e.message, 'error'); }
  };

  const handleDeleteRoom = async (id) => {
    if (!confirm('Delete this room?')) return;
    try { await deleteRoom(id); setRooms(prev => prev.filter(r => r._id !== id)); flash('Room deleted'); }
    catch (e) { flash(e.message, 'error'); }
  };

  const startEdit = (room) => {
    setEditingRoom(room);
    setRoomForm({ ...room, amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : room.amenities, images: Array.isArray(room.images) ? room.images.join(', ') : room.images });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '0.08em', color: '#c8aa64', textDecoration: 'none' }}>LUXESTAY</Link>
          <span style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', background: 'rgba(200,170,100,0.12)', color: '#c8aa64', padding: '4px 10px', border: '1px solid rgba(200,170,100,0.25)', fontFamily: 'system-ui, sans-serif' }}>Admin</span>
        </div>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(200,80,80,0.3)', color: '#e08080', padding: '8px 20px', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>Logout</button>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 48px' }}>
        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8aa64', marginBottom: '12px', fontFamily: 'system-ui, sans-serif' }}>Control Panel</p>
          <h1 style={{ fontSize: '40px', fontWeight: '400', color: '#f5f0e8', margin: 0 }}>Admin Dashboard</h1>
        </div>

        {msg.text && (
          <div style={{ marginBottom: '24px', padding: '14px 20px', fontSize: '13px', fontFamily: 'system-ui, sans-serif', border: '1px solid', borderColor: msg.type === 'error' ? 'rgba(200,80,80,0.3)' : 'rgba(200,170,100,0.3)', background: msg.type === 'error' ? 'rgba(200,80,80,0.08)' : 'rgba(200,170,100,0.08)', color: msg.type === 'error' ? '#e08080' : '#c8aa64' }}>
            {msg.type === 'error' ? '✕' : '✓'} {msg.text}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(200,170,100,0.1)', marginBottom: '40px' }}>
          {['bookings', 'rooms', 'users'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '14px 32px', background: 'transparent', border: 'none', borderBottom: tab === t ? '2px solid #c8aa64' : '2px solid transparent', color: tab === t ? '#c8aa64' : '#8a8070', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', cursor: 'pointer', marginBottom: '-1px' }}>
              {t}
            </button>
          ))}
        </div>

        {/* BOOKINGS */}
        {tab === 'bookings' && (
          <div style={{ background: '#111', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['User', 'Room', 'Check-in', 'Check-out', 'Status', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id}>
                    <td style={S.td}>{b.user?.username || '—'}</td>
                    <td style={S.td}>{b.room?.type || '—'}</td>
                    <td style={S.td}>{fmt(b.startDate)}</td>
                    <td style={S.td}>{fmt(b.endDate)}</td>
                    <td style={S.td}>
                      <span style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', padding: '4px 10px', fontFamily: 'system-ui, sans-serif', fontWeight: '700', background: b.status === 'booked' ? 'rgba(200,170,100,0.12)' : 'rgba(100,100,100,0.15)', color: b.status === 'booked' ? '#c8aa64' : '#6a6060', border: `1px solid ${b.status === 'booked' ? 'rgba(200,170,100,0.25)' : 'rgba(100,100,100,0.2)'}` }}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ ...S.td, display: 'flex', gap: '8px' }}>
                      {b.status === 'booked' && (
                        <button onClick={() => handleCancelBooking(b._id)} style={{ background: 'transparent', border: '1px solid rgba(200,140,60,0.3)', color: '#c8903c', padding: '5px 12px', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>Cancel</button>
                      )}
                      <button onClick={() => handleDeleteBooking(b._id)} style={{ background: 'transparent', border: '1px solid rgba(200,80,80,0.3)', color: '#e08080', padding: '5px 12px', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && <tr><td colSpan={6} style={{ ...S.td, textAlign: 'center', padding: '48px', color: '#6a6060' }}>No bookings yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* ROOMS */}
        {tab === 'rooms' && (
          <div>
            <div style={{ background: '#111', padding: '40px', marginBottom: '2px' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c8aa64', marginBottom: '24px', fontFamily: 'system-ui, sans-serif' }}>{editingRoom ? 'Edit Room' : 'Add New Room'}</p>
              <form onSubmit={handleRoomSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div><label style={S.label}>Room Type *</label><input required value={roomForm.type} onChange={e => setRoomForm({ ...roomForm, type: e.target.value })} style={S.input} /></div>
                  <div><label style={S.label}>Price / night *</label><input required type="number" min="0" value={roomForm.price} onChange={e => setRoomForm({ ...roomForm, price: e.target.value })} style={S.input} /></div>
                  <div style={{ gridColumn: '1/-1' }}><label style={S.label}>Description</label><textarea value={roomForm.description} onChange={e => setRoomForm({ ...roomForm, description: e.target.value })} rows={2} style={{ ...S.input, resize: 'vertical' }} /></div>
                  <div><label style={S.label}>Capacity</label><input type="number" min="1" value={roomForm.capacity} onChange={e => setRoomForm({ ...roomForm, capacity: e.target.value })} style={S.input} /></div>
                  <div><label style={S.label}>Size (sq ft)</label><input type="number" min="0" value={roomForm.size} onChange={e => setRoomForm({ ...roomForm, size: e.target.value })} style={S.input} /></div>
                  <div><label style={S.label}>Amenities (comma-separated)</label><input value={roomForm.amenities} onChange={e => setRoomForm({ ...roomForm, amenities: e.target.value })} style={S.input} /></div>
                  <div><label style={S.label}>Image URLs (comma-separated)</label><input value={roomForm.images} onChange={e => setRoomForm({ ...roomForm, images: e.target.value })} style={S.input} /></div>
                </div>
                <div style={{ display: 'flex', gap: '24px', marginBottom: '28px' }}>
                  {[['availability', 'Available'], ['featured', 'Featured']].map(([key, label]) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#c8b89a', fontFamily: 'system-ui, sans-serif' }}>
                      <input type="checkbox" checked={roomForm[key]} onChange={e => setRoomForm({ ...roomForm, [key]: e.target.checked })} style={{ accentColor: '#c8aa64' }} />
                      {label}
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" style={{ background: '#c8aa64', color: '#0a0a0a', border: 'none', padding: '12px 28px', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', fontWeight: '700', cursor: 'pointer' }}>
                    {editingRoom ? 'Update Room' : 'Create Room'}
                  </button>
                  {editingRoom && (
                    <button type="button" onClick={() => { setEditingRoom(null); setRoomForm({ type: '', price: '', description: '', capacity: 2, size: 300, amenities: '', images: '', availability: true, featured: false }); }}
                      style={{ background: 'transparent', border: '1px solid rgba(200,170,100,0.2)', color: '#8a8070', padding: '12px 28px', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2px' }}>
              {rooms.map(room => (
                <div key={room._id} style={{ background: '#111', overflow: 'hidden' }}>
                  <div style={{ height: '160px', overflow: 'hidden' }}>
                    <img src={room.images?.[0] || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'} alt={room.type} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '400', color: '#f5f0e8', margin: 0 }}>{room.type}</h3>
                      <span style={{ fontSize: '16px', color: '#c8aa64' }}>${room.price}<span style={{ fontSize: '11px', color: '#8a8070', fontFamily: 'system-ui, sans-serif' }}>/night</span></span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#8a8070', fontFamily: 'system-ui, sans-serif', marginBottom: '16px' }}>Cap: {room.capacity} · {room.size} sq ft {room.featured ? '· ★ Featured' : ''}</p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => startEdit(room)} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(200,170,100,0.2)', color: '#c8b89a', padding: '8px', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDeleteRoom(room._id)} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(200,80,80,0.25)', color: '#e08080', padding: '8px', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div style={{ background: '#111', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Username', 'Email', 'Role', 'Joined', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td style={{ ...S.td, color: '#f5f0e8', fontWeight: '500' }}>{u.username}</td>
                    <td style={S.td}>{u.email}</td>
                    <td style={S.td}>
                      <span style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', padding: '4px 10px', fontFamily: 'system-ui, sans-serif', fontWeight: '700', background: u.role === 'admin' ? 'rgba(200,170,100,0.12)' : 'rgba(100,100,100,0.15)', color: u.role === 'admin' ? '#c8aa64' : '#8a8070', border: `1px solid ${u.role === 'admin' ? 'rgba(200,170,100,0.25)' : 'rgba(100,100,100,0.2)'}` }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={S.td}>{fmt(u.createdAt)}</td>
                    <td style={{ ...S.td, display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleToggleAdmin(u)} style={{ background: 'transparent', border: '1px solid rgba(200,170,100,0.2)', color: '#c8b89a', padding: '5px 12px', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>
                        {u.role === 'admin' ? 'Revoke' : 'Make Admin'}
                      </button>
                      <button onClick={() => handleDeleteUser(u._id)} style={{ background: 'transparent', border: '1px solid rgba(200,80,80,0.3)', color: '#e08080', padding: '5px 12px', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan={5} style={{ ...S.td, textAlign: 'center', padding: '48px', color: '#6a6060' }}>No users found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
