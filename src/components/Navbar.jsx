import React from 'react';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Emer_Responce</h2>
      <ul style={styles.navLinks}>
        <li><button style={styles.link} onClick={() => window.location.href = '/'}>Home</button></li>
        <li><button style={styles.link} onClick={() => window.location.href = '/admin-login'}>Admin Login</button></li>
        <li><button style={styles.link} onClick={() => window.location.href = '/contact'}>Contact</button></li>
      </ul>
    </nav>
  );
};

// Responsive styles using JS media queries
const styles = {
  navbar: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    color: '#fff',
    padding: '15px 5%',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%',
    boxSizing: 'border-box'
  },
  logo: {
    margin: 0,
    fontSize: '1.5rem',
    flex: '1 1 100%',
    textAlign: 'center'
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '15px',
    margin: '10px 0 0',
    padding: 0,
    width: '100%'
  },
  link: {
    background: 'none',
    border: '2px solid white',
    borderRadius: '5px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '8px 12px',
    transition: 'all 0.3s ease'
  }
};

export default Navbar;
