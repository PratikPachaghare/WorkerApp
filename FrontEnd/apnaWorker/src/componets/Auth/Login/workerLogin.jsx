import React, { useState, useEffect } from 'react';
import './UserLogin.css';
import { useNavigate } from 'react-router-dom';

const WorkerLogin = () => {
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
  try {
    const response = await fetch("http://localhost:3000/api/workers/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Login failed:", data.message || "Unknown error");
      alert("Invalid credentials");
      return;
    }

    localStorage.setItem("workerToken", data.token);
    console.log("Worker login successfully");
    alert("Login successful");
    navigator("/");
    window.location.reload();
  } catch (error) {
    console.error("Error in handleLogin:", error);
    alert("Login failed. Please try again later.");
  }
};


  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleLogin}>
        <h2>Login Account</h2>
        {/* <input type="text" name="name" placeholder="Name" required onChange={handleInput} /> */}
        <input type="email" name="email" placeholder="Email" required onChange={handleInput} />
        <input type="password" name="password" placeholder="Password" required onChange={handleInput} />
        {/* <input type="tel" name="phone" placeholder="Phone" required onChange={handleInput} /> */}
        <button type="submit" className='detect-btn mt-2 m-auto justify-center'>
            Login</button>
      </form>
    </div>
  );
};

export default WorkerLogin;
