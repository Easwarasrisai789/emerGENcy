import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Admin Panel</h2>
      <ul style={styles.navLinks}>
        <li>
          <Link style={styles.link} to="/admin">
            Dashboard
          </Link>
        </li>
        <li>
          <Link style={styles.link} to="/requests">
            Requests
          </Link>
        </li>
        <li>
          <Link style={styles.link} to="/accepted-requests">
            Accepted Requests
          </Link>
        </li>
        <li>
          <Link style={styles.link} to="/AssignedVehicles">
            Assigned Vehicles
          </Link>
        </li>
        <li>
          <Link style={styles.link} to="/">
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    color: '#fff',
    padding: '12px 30px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    flexWrap: 'wrap',
  },
  logo: {
    margin: 0,
    fontSize: '20px',
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '15px',
    margin: 0,
    padding: 0,
    flexWrap: 'wrap',
  },
  link: {
    textDecoration: 'none',
    background: 'none',
    border: '1px solid white',
    borderRadius: '5px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: '6px 12px',
    fontSize: '14px',
  },
};

export default AdminNavbar;
