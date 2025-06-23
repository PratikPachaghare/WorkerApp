import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Requast from './pages/Requast';
import Navbar from './componets/Navbar/Navbar';
import About from './pages/About';
import BottomNav from './componets/Navbar/BottomNav.jsx';
import Footer from './componets/Footer/Footer.jsx';
import RequestForm from './componets/Requast/RequestForm.jsx';

function App() {
  const [token, setToken] = useState('');
  const [Login, setLogin] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('workerToken');
    if (storedToken) {
      setToken(storedToken);
      setLogin(true);
    }
  }, []); // run only once on load

  return (
    <Router>
      <Navbar login={Login} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/request" element={<Requast />} />
        <Route path="/about" element={<About />} />
        <Route path="/sendRequest" element={<RequestForm />} />
      </Routes>
      <Footer />
      <BottomNav login={Login} />
    </Router>
  );
}

export default App;
