import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Requast from "./pages/Requast";
import Navbar from "./componets/Navbar/Navbar";
import About from "./pages/About";
import BottomNav from "./componets/Navbar/BottomNav.jsx";
import Footer from "./componets/Footer/Footer.jsx";
import RequestForm from "./componets/Requast/RequestForm.jsx";
import {useDispatch} from 'react-redux';
import { isWorkers, login } from "./redux/userSlice.js";

function App() {
  const dispatch = useDispatch();
  const [User, setUser] = useState({});

  useEffect(() => {
    let storedToken = localStorage.getItem("workerToken") || localStorage.getItem("UserToken");
    const isWorker = localStorage.getItem("isWorker");
    dispatch(isWorkers(isWorker));
    if (storedToken) { 
      getUserByToken(storedToken,isWorker); 
    }
  }, []); 

  const getUserByToken = async (token,isWorker) => {
  try {
    const isWorkerFlag = localStorage.getItem("isWorker") === "true";
    const url = isWorkerFlag
      ? "http://localhost:3000/api/workers/getByToken"
      : "http://localhost:3000/api/users/getByToken";

    const res = await fetch(url, {
      method: "POST", // ✅ FIXED from GET to POST
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log("✅ Response:", data);
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch user/worker");
    }

    setUser(data);
    dispatch(login(data)); // ✅ correct

  } catch (error) {
    console.error("❌ Error getting user by token:", error.message);
    // localStorage.removeItem("workerToken");
    // localStorage.removeItem("UserToken");
    // localStorage.removeItem("isWorker");
    // window.location.href = "/auth";
  }
};


  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/request" element={<Requast />} />
        <Route path="/about" element={<About />} />
        <Route path="/sendRequest" element={<RequestForm />} />
      </Routes>
      <Footer />
      <BottomNav />
    </Router>
  );
}

export default App;
