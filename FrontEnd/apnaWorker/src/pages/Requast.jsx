// pages/Requast.jsx
import React, { useEffect, useState } from 'react';
import './Requast.css';
import PeddingRequast from '../componets/Requast/PeddingRequast';
import AcceptedRequeast from '../componets/Requast/AcceptedRequeast';
import { useSelector } from 'react-redux';

const Requast = () => {
  const User = useSelector((state) => state.user.userData);
  console.log("User : ",User);
  const [activeTab, setActiveTab] = useState('request');
  const [pending, setPending] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const workerLng = User.location.coordinates[0];
  const workerLat = User.location.coordinates[1];
  const workerPosition = [workerLat, workerLng];

  const handalRequastData = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/requests/getRequastDataByWorkerId',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ workerId: User._id }),
        }
      );

      if (!response.ok) {
        console.log('Response not OK:', response);
        return;
      }

      const data = await response.json();
      console.log('Response data:', data);

      setPending(data.pending || []);
      setAccepted(data.accepted || []);
    } catch (error) {
      console.log('Error fetching request data:', error);
    }
  };

  useEffect(() => {
    handalRequastData();
  }, []);

  /**
   * Accept request:
   * - Send API to update request status
   * - Move request from pending → accepted
   */
  const handleAccept = async (req) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/requests/accept/${req._id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        console.error('Failed to accept request');
        return;
      }

      // Update frontend state
      setAccepted([...accepted, { ...req, status: 'accepted' }]);
      setPending(pending.filter((r) => r._id !== req._id));
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  /**
   * Reject request:
   * - Optionally send API to update status
   * - Remove request from pending
   */
  const handleReject = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/requests/reject/${id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        console.error('Failed to reject request');
        return;
      }

      // Remove from pending list
      setPending(pending.filter((r) => r._id !== id));
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
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
            <PeddingRequast
              pending={pending}
              handleAccept={handleAccept}
              handleReject={handleReject}
            />
          )}

          {activeTab === 'accepted' && (
            <AcceptedRequeast accepted={accepted} workerLocation={workerPosition}/>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requast;
