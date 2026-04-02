import { Link } from 'react-router-dom';

const About = () => (
  <div className="min-h-screen bg-white">
    <nav className="flex items-center justify-between px-8 py-4 shadow-sm">
      <Link to="/" className="text-2xl font-bold text-indigo-600">LuxeStay</Link>
      <Link to="/booking" className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm hover:bg-indigo-700">Book Now</Link>
    </nav>
    <div className="max-w-3xl mx-auto px-8 py-20">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">About LuxeStay</h1>
      <p className="text-gray-600 text-lg leading-relaxed mb-6">
        LuxeStay is a premier hotel management platform dedicated to delivering exceptional hospitality experiences. From boutique suites to grand ballrooms, we curate accommodations that blend comfort, elegance, and modern convenience.
      </p>
      <p className="text-gray-600 leading-relaxed mb-6">
        Our team of hospitality professionals works around the clock to ensure every stay exceeds expectations. We partner with world-class properties to offer our guests access to the finest accommodations across the globe.
      </p>
      <Link to="/booking" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition">
        Start Booking
      </Link>
    </div>
  </div>
);

export default About;
