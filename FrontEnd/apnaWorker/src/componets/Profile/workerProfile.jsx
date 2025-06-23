// components/WorkerProfile.js

import React from 'react';
import './WorkerProfile.css';
import { useNavigate } from 'react-router-dom';

export const WorkerProfile = ({ worker }) => {
  const navigator = useNavigate();
  const handleLogout = ()=>{
    localStorage.removeItem("workerToken");
    localStorage.removeItem("UserToken");
    localStorage.removeItem("isWorker");
    navigator('/auth');
    window.location.reload();
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        
        {/* Profile Image */}
        <div className="profile-image">
          <img src={worker.profileImage} alt="Worker" />
        </div>

        {/* Worker Details */}
        <div className="profile-details">
          <div className="header">
            <h2>{worker.name}</h2>
            <button className="edit-btn">Edit</button>
          </div>
          <p className="category">{worker.category}</p>

          {/* Rating */}
          <div className="rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`star ${i < worker.rating ? 'filled' : ''}`}
              >
                ★
              </span>
            ))}
            <span className="rating-text">({worker.rating}/5)</span>
          </div>

          {/* Info */}
          <div className="info-grid">
            <p><strong>Experience:</strong> {worker.experience} years</p>
            <p><strong>Location:</strong> {worker.location}</p>
            <p><strong>Phone:</strong> {worker.phone}</p>
            <p><strong>Email:</strong> {worker.email}</p>
            <p><strong>Status:</strong> {worker.available ? "Available" : "Not Available"}</p>
          </div>
            <div>
              <button className="edit-profile-btn">Edit Profile</button>
              <button onClick={handleLogout} className="m-2 p-3 rounded-xl hover:bg-red-700 cursor-pointer bg-red-500 text-white">Logout</button>
            </div>
          
        </div>
      </div>
    </div>
  );
};




