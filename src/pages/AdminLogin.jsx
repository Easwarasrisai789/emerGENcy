import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase'; 

import Navbar from '../components/Navbar';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setResetMessage('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email to reset password');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage('Password reset email sent. Check your inbox.');
      setError('');
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
      setResetMessage('');
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Admin Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <label style={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          {error && <p style={styles.error}>{error}</p>}
          {resetMessage && <p style={styles.success}>{resetMessage}</p>}

          <button type="submit" style={styles.button}>Login</button>

          <p style={styles.forgot}>
            <button type="button" onClick={handleForgotPassword} style={styles.linkBtn}>
              Forgot Password?
            </button>
          </p>
        </form>
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: '50px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px'
  },
  form: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '300px'
  },
  label: {
    fontWeight: 'bold'
  },
  input: {
    padding: '10px',
    fontSize: '16px'
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    fontSize: '14px',
    margin: 0
  },
  success: {
    color: 'green',
    fontSize: '14px',
    margin: 0
  },
  forgot: {
    marginTop: '10px',
    textAlign: 'center'
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#007BFF',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default AdminLogin;
