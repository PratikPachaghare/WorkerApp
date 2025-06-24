import React, { useState, useEffect } from 'react';
import './UserLogin.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WorkerLogin = () => {
  const [Loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    coordinates: [77.7558, 20.9334],  // Default Bangalore
  });

  const navigator = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/workers/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          emailOrPhone: form.email,
          password: form.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Login failed:", data.message || "Unknown error");
        toast.error("Invalid credentials");
        return;
      }
      localStorage.setItem("workerToken", data.token);
      localStorage.setItem("isWorker", data.worker.isWorker);
      console.log("Worker login successfully");
      toast.success("Login successful");
      setLoading(false);
      setTimeout(() => {
          window.location.href = "/"; // full reload but maintains route
        }, 1000);
    } catch (error) {
      setLoading(false);
      console.error("Error in handleLogin:", error);
      toast.error("Login failed. Please try again later.");
    }
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleLogin}>
        <h2>Login Account</h2>
        <label htmlFor="Email">Email Or Phone</label>
        <input type="text" name="email" id='Email' placeholder="Email or Phone" required onChange={handleInput} />
        <label htmlFor="Password">Password</label>
        <input type="password" name="password" id='Password' placeholder="Password" required onChange={handleInput} />
        <button type="submit" className='detect-btn mt-2 m-auto justify-center'>
          Login
        </button>
      </form>

      {/* ✅ Toast container */}
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default WorkerLogin;
