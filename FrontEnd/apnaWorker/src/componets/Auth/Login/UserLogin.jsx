import React, { useState, useEffect } from 'react';
import './UserLogin.css';

const UserLogin = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    coordinates: [77.7558, 20.9334],  // Default Bangalore
  });

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login user:', form);
    // send data to backend...
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
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

export default UserLogin;
