// components/Navbar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './Navbar.css';
import logo_img from '../../Assets/logo.jpg'

const Navbar = ({ user,login }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink to="/" className="logo-link">
          <img src={logo_img} alt="Logo" className="logo-img" />
          <span className="logo-text">NearKaamWala</span>
        </NavLink>
      </div>

      <div className="navbar-right">
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''}>Home</NavLink>
          <NavLink to="/request" className={({ isActive }) => isActive ? 'active-link' : ''}>Request</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active-link' : ''}>About</NavLink>
        </div>

      {/* login or not handdle  */}
      {!login?
      <div className="nav-profile">
          <NavLink to="/auth" className="profile-link">
              <div className='flex'>
                <div className='bg-blue-500 text-1xl border rounded justify-center text-center p-1 pr-2 pl-2 text-white'>Login</div>
                <p className='text-2xl m-1'>/</p>
                <div className='bg-blue-500 text-1xl border rounded justify-center text-center p-1 pr-2 pl-2 text-white'>Register</div>
              </div>
          </NavLink>
        </div>
      :<div className="nav-profile">
          <NavLink to="/profile" className="profile-link">
            <FaUserCircle className="profile-icon" />
            <span className="profile-name">{user?.name || 'Profile'}</span>
            {user?.photo && (
              <img
                src={user.photo}
                alt="Profile"
                className="profile-img"
              />
            )}
          </NavLink>
        </div>}
      </div>
    </nav>
  );
};

export default Navbar;
