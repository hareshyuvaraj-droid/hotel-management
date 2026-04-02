import { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-4 shadow-sm">
        <Link to="/" className="text-2xl font-bold text-indigo-600">LuxeStay</Link>
        <Link to="/booking" className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm hover:bg-indigo-700">Book Now</Link>
      </nav>
      <div className="max-w-lg mx-auto px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Contact Us</h1>
        <p className="text-gray-500 mb-8">We'd love to hear from you. Send us a message and we'll respond within 24 hours.</p>

        {sent ? (
          <div className="bg-green-50 text-green-700 rounded-xl p-6 text-center">
            <p className="text-lg font-semibold mb-2">Message sent!</p>
            <p className="text-sm">Thank you for reaching out. We'll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea required rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
