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
  const [isWorker,setIsWorker] = useState(false);
  const [Login, setLogin] = useState(false);
  const [User,setUser] = useState({});

  useEffect(() => {
    const storedToken = (localStorage.getItem('workerToken') || localStorage.getItem('UserToken'));
    if (storedToken) {
      setToken(storedToken);
      setLogin(true);
    }
    if(token){
      getUserByToken(token);
      console.log(User);
    }

  }, []); // run only once on load

const getUserByToken = async (token) => {
  try {
    const isWorkerFlag = localStorage.getItem("isWorker") === "true";
    const url = isWorkerFlag
      ? "http://localhost:3000/api/workers/getByToken"
      : "http://localhost:3000/api/users/getByToken";

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch user/worker");
    }

    setUser(data); // based on backend response
    setIsWorker(isWorkerFlag);
    setLogin(true);

    return data.user || data.worker;
  } catch (error) {
    console.error("❌ Error getting user by token:", error);
    setLogin(false);
    localStorage.removeItem("token");
    localStorage.removeItem("isWorker");
  }
};



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
