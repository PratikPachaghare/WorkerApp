import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Request from "./pages/Requast"; // ✅ Typo fixed: Requast → Request (check actual file name too)
import Navbar from "./componets/Navbar/Navbar";
import About from "./pages/About";
import BottomNav from "./componets/Navbar/BottomNav.jsx";
import Footer from "./componets/Footer/Footer.jsx";
import RequestForm from "./componets/Requast/RequestForm.jsx";
import { useDispatch } from "react-redux";
import { isWorkers, login} from "./redux/userSlice.js"; // ✅ Renamed to avoid conflict
import Loader from "./componets/Loder/Loader.jsx"; // ✅ Typo in folder: Loder → Loader (if applicable)

function App() {
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ Renamed from `login` (confusing)
  const [loading, setLoading] = useState(true); // ✅ Typo fixed

  useEffect(() => {
    const storedToken = localStorage.getItem("workerToken") || localStorage.getItem("UserToken");
    const isWorker = localStorage.getItem("isWorker");
    if (storedToken) {
      setIsLoggedIn(true);
      dispatch(isWorkers(isWorker));
      getUserByToken(storedToken, isWorker);
    }
    setLoading(false);
  }, []);

  const getUserByToken = async (token, isWorker) => {
    try {
      const isWorkerFlag = isWorker === "true";
      const url = isWorkerFlag
        ? "http://localhost:3000/api/workers/getByToken"
        : "http://localhost:3000/api/users/getByToken";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch user/worker");
      }

      setUser(data);
      dispatch(login(data)); // ✅ renamed to avoid conflict with state
    } catch (error) {
      console.error("❌ Error getting user by token:", error.message);
      // Uncomment this if you want logout on failure
      // localStorage.clear();
      // window.location.href = "/auth";
    }
  };

  return (
    <Router>
      <Navbar />
      {loading ? (
        <Loader />
      ) : !isLoggedIn ? (
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/request" element={<Request />} />
          <Route path="/about" element={<About />} />
          <Route path="/sendRequest" element={<RequestForm />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
      <Footer />
      <BottomNav />
    </Router>
  );
}

export default App;
