import React from 'react';
import './WorkerCard.css';
import worker_image from '../../../Assets/worker-image.png';

const WorkerCard = ({ worker }) => {
  return (
    <div className="worker-card">
  <div className="image-container">
    <img src={worker.profileImage} alt={worker.name} className="worker-image" />
    <div className="rating-badge">
      <span className="rating-text">{worker.rating}<span className=" text-amber-300 ">★</span> </span>
    </div>
  </div>
  <div className="worker-info">
    <h3>{worker.name}</h3>
    <p>{worker.address &&
  worker.address
    .split(",")
    .slice(0, 2)
    .map(part => part.trim().toLowerCase())
    .join(", ")
}
</p>
    <div className='flex justify-center gap-2 '>
      <p className='m-1 mt-3 text-blue-700 '>{worker.category}</p>
      <button>Book Now</button>
    </div>
  </div>
</div>


  );
};

export default WorkerCard;