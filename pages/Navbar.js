import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/performance', label: 'Performance' }
  ];
  const username = localStorage.getItem('quizbolt_username') || '';

  return (
    <nav style={{
      width: '100%',
      background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 56,
      boxShadow: '0 2px 8px rgba(30,60,114,0.08)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginLeft: 32 }}>
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className="navbar-link"
            style={{
              color: '#fff',
              background: 'transparent',
              borderRadius: 6,
              padding: '8px 22px',
              fontWeight: 600,
              fontSize: '1.1rem',
              textDecoration: 'none',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div style={{ 
        marginRight: 32, 
        fontWeight: 600, 
        fontSize: '1.1rem', 
        letterSpacing: 1,
        display: 'flex',
        alignItems: 'center',
        background: 'transparent',
        color: '#fff',
        borderRadius: 0,
        padding: 0,
        boxShadow: 'none'
      }}>
        <span style={{
          background: 'linear-gradient(90deg, #ffb300 0%, #ff6f00 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700
        }}>Welcome</span>{username ? `, ${username}` : ''}
      </div>
    </nav>
  );
}

export default Navbar;
