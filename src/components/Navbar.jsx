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

// Styles matching your screenshot design
const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(to right, #2c3e50, #34495e)', // dark navy gradient
    color: '#fff',
    padding: '15px 5%',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%',
    boxSizing: 'border-box',
  },
  logo: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '15px',
    margin: 0,
    padding: 0,
  },
  link: {
    background: 'none',
    border: '2px solid white',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '8px 16px',
    transition: 'all 0.3s ease',
  },
};

export default Navbar;
