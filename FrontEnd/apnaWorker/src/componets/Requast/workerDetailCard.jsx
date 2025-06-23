import React from 'react';
import './CardShow.css';
import worker_image from '../../Assets/worker-image.png';
import { useNavigate } from 'react-router-dom';

const CardShow = ({worker}) => {
  const navigate = useNavigate();

  return (
    <div className="card-show-container">
      <button onClick={() => navigate(-1)} className="back-button">← Back</button>
      <div className="card-show">
        <img src={worker_image} alt="Amit Sharma" className="card-show-image" />
        <div className="card-show-details">
          <h2>{worker.name}</h2>
          <p><strong>Address:</strong> Delhi, India</p>
          <p><strong>Description:</strong> Expert in household repairs and maintenance. Specializes in residential electrical systems with over 10 years of experience.</p>
          <p><strong>Rating:</strong> <span className="yellow-text">4.5★</span></p>
          <p><strong>category:</strong> {worker.category}</p>
          <p><strong>Subcategory:</strong> House wiring, AC Reapir, Electrician</p>
        </div>
      </div>
    </div>
  );
};

export default CardShow;
