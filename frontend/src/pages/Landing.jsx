import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedRooms } from '../services/roomService';

const Landing = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    getFeaturedRooms().then(setRooms).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 shadow-sm">
        <span className="text-2xl font-bold text-indigo-600">LuxeStay</span>
        <div className="flex gap-6 text-sm font-medium text-gray-600">
          <Link to="/about" className="hover:text-indigo-600">About</Link>
          <Link to="/contact" className="hover:text-indigo-600">Contact</Link>
          <Link to="/login" className="hover:text-indigo-600">Login</Link>
          <Link to="/register" className="bg-indigo-600 text-white px-4 py-1.5 rounded-full hover:bg-indigo-700">Register</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative bg-indigo-700 text-white py-28 px-8 text-center">
        <h1 className="text-5xl font-bold mb-4">Your perfect stay awaits</h1>
        <p className="text-indigo-200 text-lg mb-8">Luxury rooms, seamless booking, unforgettable experiences.</p>
        <Link to="/booking" className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-full hover:bg-indigo-50 transition">
          Book Now
        </Link>
      </div>

      {/* Featured Rooms */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Rooms</h2>
        {rooms.length === 0 ? (
          <p className="text-gray-500">No featured rooms available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div key={room._id} className="rounded-xl overflow-hidden shadow-md border border-gray-100">
                <img
                  src={room.images?.[0] || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'}
                  alt={room.type}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{room.type}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{room.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-indigo-600 font-bold">${room.price}<span className="text-gray-400 font-normal text-sm">/night</span></span>
                    <Link to="/booking" className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">Book</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} LuxeStay. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
