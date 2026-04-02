import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';
import {
  getAllUsers, updateUser, deleteUser,
  getAllRooms, createRoom, updateRoom, deleteRoom,
  getAllBookings, updateBooking, cancelBooking, deleteBooking  // FIX #5: added cancelBooking, deleteBooking
} from '../services/adminService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('bookings');
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [msg, setMsg] = useState('');
  const [roomForm, setRoomForm] = useState({ type:'', price:'', description:'', capacity:2, size:300, amenities:'', images:'', availability:true, featured:false });
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    if (tab === 'users') getAllUsers().then(setUsers).catch(() => {});
    if (tab === 'rooms') getAllRooms().then(setRooms).catch(() => {});
    if (tab === 'bookings') getAllBookings().then(setBookings).catch(() => {});
  }, [tab]);

  const handleLogout = async () => { await logoutUser(); navigate('/login'); };
  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  // --- BOOKINGS ---
  const handleCancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
      flash('✅ Booking cancelled');
    } catch (e) { flash(`❌ ${e.message}`); }
  };

  const handleDeleteBooking = async (id) => {
    if (!confirm('Permanently delete this booking?')) return;
    try {
      await deleteBooking(id);
      setBookings(prev => prev.filter(b => b._id !== id));
      flash('✅ Booking deleted');
    } catch (e) { flash(`❌ ${e.message}`); }
  };

  // --- USERS ---
  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      flash('✅ User deleted');
    } catch (e) { flash(`❌ ${e.message}`); }
  };

  const handleToggleAdmin = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      const updated = await updateUser(user._id, { ...user, role: newRole });
      setUsers(prev => prev.map(u => u._id === user._id ? updated : u));
    } catch (e) { flash(`❌ ${e.message}`); }
  };

  // --- ROOMS ---
  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        const updated = await updateRoom(editingRoom._id, roomForm);
        setRooms(prev => prev.map(r => r._id === editingRoom._id ? updated : r));
        flash('✅ Room updated');
      } else {
        const created = await createRoom(roomForm);
        setRooms(prev => [created, ...prev]);
        flash('✅ Room created');
      }
      setEditingRoom(null);
      setRoomForm({ type:'', price:'', description:'', capacity:2, size:300, amenities:'', images:'', availability:true, featured:false });
    } catch (e) { flash(`❌ ${e.message}`); }
  };

  const handleDeleteRoom = async (id) => {
    if (!confirm('Delete this room?')) return;
    try {
      await deleteRoom(id);
      setRooms(prev => prev.filter(r => r._id !== id));
      flash('✅ Room deleted');
    } catch (e) { flash(`❌ ${e.message}`); }
  };

  const startEdit = (room) => {
    setEditingRoom(room);
    setRoomForm({
      ...room,
      amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : room.amenities,
      images: Array.isArray(room.images) ? room.images.join(', ') : room.images,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs = ['bookings', 'rooms', 'users'];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <Link to="/" className="text-2xl font-bold text-indigo-600">LuxeStay <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full ml-1">Admin</span></Link>
        <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">Logout</button>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        {msg && <div className="mb-4 text-sm bg-white rounded-xl px-4 py-3 shadow-sm border">{msg}</div>}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`pb-2 text-sm font-medium capitalize border-b-2 transition ${tab === t ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* BOOKINGS TAB */}
        {tab === 'bookings' && (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  {['User','Room','Check-in','Check-out','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map(b => (
                  <tr key={b._id}>
                    <td className="px-4 py-3">{b.user?.username || '—'}</td>
                    <td className="px-4 py-3">{b.room?.type || '—'}</td>
                    <td className="px-4 py-3">{new Date(b.startDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{new Date(b.endDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.status === 'booked' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      {b.status === 'booked' && (
                        <button onClick={() => handleCancelBooking(b._id)}
                          className="text-xs text-orange-500 hover:text-orange-700 border border-orange-200 px-2 py-1 rounded">
                          Cancel
                        </button>
                      )}
                      <button onClick={() => handleDeleteBooking(b._id)}
                        className="text-xs text-red-500 hover:text-red-700 border border-red-200 px-2 py-1 rounded">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ROOMS TAB */}
        {tab === 'rooms' && (
          <div>
            {/* Room Form */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h3 className="font-semibold text-gray-700 mb-4">{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
              <form onSubmit={handleRoomSubmit} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Type *</label>
                  <input required value={roomForm.type} onChange={e => setRoomForm({...roomForm, type: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Price/night *</label>
                  <input required type="number" min="0" value={roomForm.price} onChange={e => setRoomForm({...roomForm, price: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">Description</label>
                  <textarea value={roomForm.description} onChange={e => setRoomForm({...roomForm, description: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" rows={2} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Capacity</label>
                  <input type="number" min="1" value={roomForm.capacity} onChange={e => setRoomForm({...roomForm, capacity: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Size (sq ft)</label>
                  <input type="number" min="0" value={roomForm.size} onChange={e => setRoomForm({...roomForm, size: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Amenities (comma-separated)</label>
                  <input value={roomForm.amenities} onChange={e => setRoomForm({...roomForm, amenities: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Image URLs (comma-separated)</label>
                  <input value={roomForm.images} onChange={e => setRoomForm({...roomForm, images: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div className="flex gap-4 items-center col-span-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={roomForm.availability} onChange={e => setRoomForm({...roomForm, availability: e.target.checked})} />
                    Available
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={roomForm.featured} onChange={e => setRoomForm({...roomForm, featured: e.target.checked})} />
                    Featured
                  </label>
                </div>
                <div className="col-span-2 flex gap-3">
                  <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700">
                    {editingRoom ? 'Update Room' : 'Create Room'}
                  </button>
                  {editingRoom && (
                    <button type="button" onClick={() => { setEditingRoom(null); setRoomForm({ type:'', price:'', description:'', capacity:2, size:300, amenities:'', images:'', availability:true, featured:false }); }}
                      className="border border-gray-200 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Rooms List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map(room => (
                <div key={room._id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{room.type}</p>
                    <p className="text-sm text-indigo-600">${room.price}/night</p>
                    <p className="text-xs text-gray-400 mt-1">Cap: {room.capacity} · {room.size} sq ft</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(room)} className="text-xs border border-gray-200 px-2 py-1 rounded text-gray-600 hover:bg-gray-50">Edit</button>
                    <button onClick={() => handleDeleteRoom(room._id)} className="text-xs border border-red-200 px-2 py-1 rounded text-red-500 hover:bg-red-50">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  {['Username','Email','Role','Joined','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u._id}>
                    <td className="px-4 py-3 font-medium">{u.username}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => handleToggleAdmin(u)}
                        className="text-xs border border-indigo-200 px-2 py-1 rounded text-indigo-500 hover:bg-indigo-50">
                        {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                      </button>
                      <button onClick={() => handleDeleteUser(u._id)}
                        className="text-xs border border-red-200 px-2 py-1 rounded text-red-500 hover:bg-red-50">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
