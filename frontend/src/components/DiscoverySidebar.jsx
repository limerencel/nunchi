import React from 'react';

const DiscoverySidebar = () => {
  return (
    <aside className="right-sidebar" style={{ padding: '2rem 1.5rem', position: 'sticky', top: 0, height: '100vh' }}>
      <div style={{
        background: 'var(--surface)',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Discovery</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ cursor: 'pointer' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Trending in Tech</span>
            <p style={{ fontWeight: 600, margin: '2px 0' }}>The Future of AI Design</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>1,234 posts</span>
          </div>
          <div style={{ cursor: 'pointer' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Philosophy</span>
            <p style={{ fontWeight: 600, margin: '2px 0' }}>Digital Minimalism</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>856 posts</span>
          </div>
          <div style={{ cursor: 'pointer' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Development</span>
            <p style={{ fontWeight: 600, margin: '2px 0' }}>React 19 RC</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>2,109 posts</span>
          </div>
        </div>
      </div>

      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <a href="#" style={{ textDecoration: 'none' }}>Terms of Service</a>
        <a href="#" style={{ textDecoration: 'none' }}>Privacy Policy</a>
        <a href="#" style={{ textDecoration: 'none' }}>Cookie Policy</a>
        <span>© 2026 nunchi.</span>
      </div>
    </aside>
  );
};

export default DiscoverySidebar;