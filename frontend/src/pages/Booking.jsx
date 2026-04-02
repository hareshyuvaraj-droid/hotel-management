import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllRooms, searchRooms } from '../services/roomService';
import { createBooking } from '../services/bookingService';
import { isAuthenticated } from '../services/authService';

const Booking = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({ type: '', minPrice: '', maxPrice: '', available: 'true' });
  const [selected, setSelected] = useState(null);
  const [dates, setDates] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getAllRooms().then(setRooms).catch(() => {});
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
    const results = await searchRooms(params).catch(() => []);
    setRooms(results);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) { navigate('/login'); return; }
    setLoading(true);
    setMessage('');
    try {
      await createBooking({ room: selected._id, ...dates });
      setMessage('✅ Booking confirmed! Check your dashboard for details.');
      setSelected(null);
    } catch (err) {
      setMessage(`❌ ${err.message || 'Booking failed'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <Link to="/" className="text-2xl font-bold text-indigo-600">LuxeStay</Link>
        <div className="flex gap-4 text-sm font-medium text-gray-600">
          <Link to="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
          <Link to="/login" className="hover:text-indigo-600">Login</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Find a Room</h1>

        {/* Filters */}
        <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-sm p-6 mb-8 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
            <input
              type="text" placeholder="e.g. Suite"
              value={filters.type}
              onChange={e => setFilters({ ...filters, type: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-36"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Min Price</label>
            <input
              type="number" placeholder="$0"
              value={filters.minPrice}
              onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-28"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Max Price</label>
            <input
              type="number" placeholder="$9999"
              value={filters.maxPrice}
              onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-28"
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700">
            Search
          </button>
          <button type="button" onClick={() => { setFilters({ type:'', minPrice:'', maxPrice:'', available:'true' }); getAllRooms().then(setRooms); }}
            className="text-sm text-gray-400 hover:text-gray-600">Clear</button>
        </form>

        {message && <div className="mb-6 text-sm bg-white rounded-xl px-4 py-3 shadow-sm border">{message}</div>}

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map(room => (
            <div key={room._id} className={`bg-white rounded-xl shadow-sm overflow-hidden border-2 transition ${selected?._id === room._id ? 'border-indigo-500' : 'border-transparent'}`}>
              <img
                src={room.images?.[0] || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'}
                alt={room.type} className="w-full h-44 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800">{room.type}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${room.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {room.availability ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{room.description}</p>
                <div className="text-xs text-gray-400 mt-2 flex gap-3">
                  <span>👥 {room.capacity}</span>
                  <span>📐 {room.size} sq ft</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-indigo-600 font-bold">${room.price}<span className="text-gray-400 font-normal text-xs">/night</span></span>
                  {room.availability && (
                    <button
                      onClick={() => { setSelected(room); setMessage(''); }}
                      className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700"
                    >
                      Select
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Panel */}
        {selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-1">Book: {selected.type}</h3>
              <p className="text-indigo-600 font-semibold mb-6">${selected.price}/night</p>
              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                  <input type="date" required value={dates.startDate}
                    onChange={e => setDates({ ...dates, startDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                  <input type="date" required value={dates.endDate}
                    onChange={e => setDates({ ...dates, endDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={loading}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">
                    {loading ? 'Booking…' : 'Confirm Booking'}
                  </button>
                  <button type="button" onClick={() => setSelected(null)}
                    className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
