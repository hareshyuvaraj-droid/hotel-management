import { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const inputStyle = {
    width: '100%', background: '#1a1a1a', border: '1px solid rgba(200,170,100,0.2)',
    color: '#f5f0e8', padding: '13px 16px', fontSize: '14px',
    fontFamily: 'system-ui, sans-serif', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f5f0e8', fontFamily: "'Georgia', serif" }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: '72px', borderBottom: '1px solid rgba(200,170,100,0.15)' }}>
        <Link to="/" style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '0.08em', color: '#c8aa64', textDecoration: 'none' }}>LUXESTAY</Link>
        <Link to="/booking" style={{ background: '#c8aa64', color: '#0a0a0a', padding: '10px 24px', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'system-ui, sans-serif', fontWeight: '700' }}>Book Now</Link>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 72px)' }}>
        {/* Left info panel */}
        <div style={{ position: 'relative', padding: '80px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <img src="https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg" alt="contact" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8aa64', marginBottom: '16px', fontFamily: 'system-ui, sans-serif' }}>Get in Touch</p>
            <h1 style={{ fontSize: '48px', fontWeight: '400', color: '#f5f0e8', marginBottom: '24px' }}>Contact Us</h1>
            <p style={{ fontSize: '15px', color: '#8a8070', lineHeight: '1.8', fontFamily: 'system-ui, sans-serif', marginBottom: '56px' }}>
              We'd love to hear from you. Send us a message and we'll respond within 24 hours.
            </p>
            <div style={{ width: '60px', height: '1px', background: '#c8aa64', marginBottom: '48px' }} />
            {[
              { icon: '📍', label: 'Address', value: '123 Luxury Avenue, Suite 100' },
              { icon: '📞', label: 'Phone', value: '+1 (800) LUXESTAY' },
              { icon: '✉️', label: 'Email', value: 'hello@luxestay.com' },
              { icon: '🕐', label: 'Hours', value: '24/7 Concierge Service' },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '16px' }}>{icon}</span>
                <div>
                  <p style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c8aa64', marginBottom: '4px', fontFamily: 'system-ui, sans-serif' }}>{label}</p>
                  <p style={{ fontSize: '14px', color: '#c8b89a', fontFamily: 'system-ui, sans-serif' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right form panel */}
        <div style={{ background: '#111', padding: '80px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '24px' }}>✓</div>
              <h2 style={{ fontSize: '28px', fontWeight: '400', color: '#c8aa64', marginBottom: '12px' }}>Message Sent</h2>
              <p style={{ color: '#8a8070', fontFamily: 'system-ui, sans-serif', marginBottom: '32px' }}>Thank you for reaching out. We'll be in touch shortly.</p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }}
                style={{ background: 'transparent', border: '1px solid rgba(200,170,100,0.3)', color: '#c8aa64', padding: '12px 28px', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>
                Send Another
              </button>
            </div>
          ) : (
            <>
              <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c8aa64', marginBottom: '32px', fontFamily: 'system-ui, sans-serif' }}>Send a Message</p>
              <form onSubmit={e => { e.preventDefault(); setSent(true); }}>
                {[
                  { label: 'Your Name', key: 'name', type: 'text' },
                  { label: 'Email Address', key: 'email', type: 'email' },
                ].map(({ label, key, type }) => (
                  <div key={key} style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8a8070', marginBottom: '8px', fontFamily: 'system-ui, sans-serif' }}>{label}</label>
                    <input type={type} required value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'rgba(200,170,100,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(200,170,100,0.2)'}
                    />
                  </div>
                ))}
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8a8070', marginBottom: '8px', fontFamily: 'system-ui, sans-serif' }}>Message</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(200,170,100,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(200,170,100,0.2)'}
                  />
                </div>
                <button type="submit" style={{ width: '100%', background: '#c8aa64', color: '#0a0a0a', border: 'none', padding: '15px', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', fontWeight: '700', cursor: 'pointer' }}>
                  Send Message
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
