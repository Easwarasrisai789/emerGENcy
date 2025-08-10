import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import EmergencyForm from './pages/EmergencyForm';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import RequestsPage from './pages/RequestsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmergencyForm />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/requests" element={<RequestsPage/>}/>

      </Routes>
    </Router>
  );
}

export default App;
