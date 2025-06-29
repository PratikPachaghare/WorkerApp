// pages/Requast.jsx
import React, { useEffect, useState } from 'react';
import './Requast.css';
import RequestForm from '../componets/Requast/RequestForm';
import { useLocation } from 'react-router-dom';
import PeddingRequast from '../componets/Requast/PeddingRequast';
import AcceptedRequeast from '../componets/Requast/AcceptedRequeast';
import { useSelector } from 'react-redux';

const Requast = () => {
  const User = useSelector((state)=>state.user.userData);
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

  const handalRequastData = async ()=>{
     try {
        const responce = await fetch("http://localhost:3000/api/requast/getDataByUserId",{
          method:"Get",
          body:{userId:User._id}
        })
      
      if(!responce.ok){
        console.log("ressponse not get :",responce);
      }  

      console.log("responce : ",responce);
      setRequests(responce.requests);
      setAccepted(responce.accepted);

     } catch (error) {
        console.log("error to fetch requast data",error);
     }
  }

  useEffect(()=>{
    handalRequastData();
  },[]);


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
          <PeddingRequast requests={requests} handleAccept={handleAccept} handleReject={handleReject} />
        )}

        {activeTab === 'accepted' && (
          <AcceptedRequeast accepted={accepted} details={"details"}/>
        )}
      </div>
    </div>
  </div>  
  );
};

export default Requast;
