import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import Navbar from '../components/Navbar';

function Contact() {
  const [state, handleSubmit] = useForm("xpwlyvan");

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Contact Us</h2>

        {state.succeeded ? (
          <p style={styles.success}>✅ Thank you! We'll get back to you soon.</p>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              style={styles.input}
            />
            <ValidationError prefix="Email" field="email" errors={state.errors} />

            <label htmlFor="message" style={styles.label}>Message</label>
            <textarea
              id="message"
              name="message"
              required
              rows="5"
              style={styles.textarea}
            />
            <ValidationError prefix="Message" field="message" errors={state.errors} />

            <button type="submit" disabled={state.submitting} style={styles.button}>
              {state.submitting ? 'Sending...' : 'Submit'}
            </button>
          </form>
        )}

        <h3 style={styles.reviewHeading}>What people are saying</h3>
        <div style={styles.reviews}>
          <div style={styles.reviewCard}>
            <p>🚑 “Fast and reliable emergency response. Really helped us in a tough time.”</p>
            <span>- Arjun Reddy</span>
          </div>
          <div style={styles.reviewCard}>
            <p>🔥 “Called for fire help — response was quick and coordinated. Highly recommended.”</p>
            <span>- Priya Sharma</span>
          </div>
          <div style={styles.reviewCard}>
            <p>👮 “Police van reached within 5 minutes. Hats off to the team.”</p>
            <span>- Rakesh Kumar</span>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: '40px 5%',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '100%',
    boxSizing: 'border-box'
  },
  heading: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '30px'
  },
  label: {
    fontWeight: 'bold',
    marginTop: '10px'
  },
  form: {
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },
  textarea: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    resize: 'none'
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  success: {
    color: 'green',
    fontSize: '18px',
    textAlign: 'center'
  },
  reviewHeading: {
    marginTop: '50px',
    textAlign: 'center'
  },
  reviews: {
    marginTop: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center'
  },
  reviewCard: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '300px',
    textAlign: 'left'
  }
};

export default Contact;
