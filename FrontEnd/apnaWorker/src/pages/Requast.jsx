// pages/Requast.jsx
import React, { useEffect, useState } from 'react';
import './Requast.css';
import PeddingRequast from '../componets/Requast/PeddingRequast';
import AcceptedRequeast from '../componets/Requast/AcceptedRequeast';
import { useSelector } from 'react-redux';
import { Loader2 } from '../componets/Loder/Loader';

const Requast = () => {
  const [Lodding,setLodding] = useState(false);
  const User = useSelector((state) => state.user.userData);
  const isWorker = useSelector((state)=> state.user.isWorker);
  const [activeTab, setActiveTab] = useState('request');
  const [pending, setPending] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [workerLng,setWorkerLng] = useState(0);
  const [workerLat,setWorkerLat] = useState(0);
  const workerPosition = [workerLat, workerLng];

  const handalRequastData = async () => {
    setLodding(true);
    try {
      const api = isWorker==true?'http://localhost:3000/api/requests/getRequastDataByWorkerId':'http://localhost:3000/api/requests/getRequastDataByUserId';
      const response = await fetch(
        api,
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

      setPending(data.pending || []);
      setAccepted(data.accepted || []);
    } catch (error) {
      console.log('Error fetching request data:', error);
    }
    setLodding(false);
  };

  useEffect(() => {
    
    setTimeout(()=>{
      setWorkerLng(User.location.coordinates[0])
      setWorkerLat(User.location.coordinates[1])
      handalRequastData();
    },50)
    
  }, []);

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
         {Lodding && <Loader2/>}
        <div className="request-tabs">
          <button
            className={activeTab === 'request' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('request')}
          >
            {isWorker==true?"Request":"Send"}
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
