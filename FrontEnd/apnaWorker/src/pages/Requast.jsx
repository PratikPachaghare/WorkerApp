// pages/Requast.jsx
import React, { useState } from 'react';
import './Requast.css';
import RequestForm from '../componets/Requast/RequestForm';
import { useLocation } from 'react-router-dom';

const Requast = () => {
  const [activeTab, setActiveTab] = useState('request');
  const [requests, setRequests] = useState([
    {
      id: 1,
      user: 'Amit Kumar',
      location: 'Delhi',
      time: 'Tomorrow 10 AM',
      message: 'Need a plumber for kitchen sink.',
    },
    {
      id: 2,
      user: 'Priya Sharma',
      location: 'Mumbai',
      time: 'Today 5 PM',
      message: 'TV not working, need quick repair.',
    },
  ]);

  const [accepted, setAccepted] = useState([]);

  const handleAccept = (req) => {
    setAccepted([...accepted, req]);
    setRequests(requests.filter((r) => r.id !== req.id));
  };

  const handleReject = (id) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  return (
    <div>
    <div className="request-container">
      <div className="request-tabs">
        <button
          className={activeTab === 'request' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('request')}
        >
          Request
        </button>
        <button
          className={activeTab === 'accepted' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('accepted')}
        >
          Accepted
        </button>
      </div>

      <div className="request-content">
        {activeTab === 'request' && (
          <div className="request-list">
            {requests.length === 0 ? (
              <p>No new requests.</p>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="request-card">
                  <h3>{req.user}</h3>
                  <p><strong>Location:</strong> {req.location}</p>
                  <p><strong>Time:</strong> {req.time}</p>
                  <p><strong>Message:</strong> {req.message}</p>
                  <div className="card-buttons">
                    <button className="accept" onClick={() => handleAccept(req)}>Accept</button>
                    <button className="reject" onClick={() => handleReject(req.id)}>Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'accepted' && (
          <div className="accepted-list">
            {accepted.length === 0 ? (
              <p>No accepted requests yet.</p>
            ) : (
              accepted.map((req) => (
                <div key={req.id} className="request-card accepted">
                  <h3>{req.user}</h3>
                  <p><strong>Location:</strong> {req.location}</p>
                  <p><strong>Time:</strong> {req.time}</p>
                  <p><strong>Message:</strong> {req.message}</p>
                  <p className="accepted-label">✔ Accepted</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  </div>  
  );
};

export default Requast;
