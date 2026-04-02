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

  useEffect(() => {
    getUserProfile().then(setUser).catch(() => {});
    getBookingHistory().then(setBookings).catch(() => {});
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
      setPwMsg('✅ Password updated successfully');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPwMsg(`❌ ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <Link to="/" className="text-2xl font-bold text-indigo-600">LuxeStay</Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Hello, {user?.username}</span>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          {['bookings', 'profile'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`pb-2 text-sm font-medium capitalize border-b-2 transition ${tab === t ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="mb-4">No bookings yet.</p>
                <Link to="/booking" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700">Browse Rooms</Link>
              </div>
            ) : bookings.map(b => (
              <div key={b._id} className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center border border-gray-100">
                <div>
                  <p className="font-semibold text-gray-800">{b.room?.type || 'Room'}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${b.status === 'booked' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {b.status}
                  </span>
                  {b.status === 'booked' && (
                    <button onClick={() => handleCancel(b._id)}
                      className="text-xs text-red-500 hover:text-red-700 border border-red-200 px-2 py-1 rounded-lg">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'profile' && (
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-md">
            <div className="mb-6">
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-medium text-gray-800">{user?.username}</p>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{user?.email}</p>
            </div>
            <hr className="my-4" />
            <h3 className="font-semibold text-gray-700 mb-4">Change Password</h3>
            {pwMsg && <p className="text-sm mb-3">{pwMsg}</p>}
            <form onSubmit={handlePasswordChange} className="space-y-3">
              <input type="password" placeholder="Current password" required
                value={pwForm.currentPassword}
                onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
              <input type="password" placeholder="New password (min 8 chars)" required minLength={8}
                value={pwForm.newPassword}
                onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
                Update Password
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
