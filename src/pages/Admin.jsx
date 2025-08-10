import React from 'react';
import AdminNavbar from '../components/AdminNavbar'; // 👈 use this instead of Navbar

function Admin() {
  return (
    <>
      <AdminNavbar />
      <div style={styles.container}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.description}>Welcome, Admin! You can manage emergency reports and system settings here.</p>

        <div style={styles.cardContainer}>
          <div style={styles.card}>
            <h3>🚨 Emergency Requests</h3>
            <p>Review and respond to incoming emergency reports.</p>
          </div>
          <div style={styles.card}>
            <h3>👤 User Management</h3>
            <p>Manage registered users and responders.</p>
          </div>
          <div style={styles.card}>
            <h3>🚑 Vehicle Management</h3>
            <p>View and update emergency vehicle availability.</p>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: '40px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '10px'
  },
  description: {
    marginBottom: '30px',
    fontSize: '1.1rem'
  },
  cardContainer: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '300px'
  }
};

export default Admin;
