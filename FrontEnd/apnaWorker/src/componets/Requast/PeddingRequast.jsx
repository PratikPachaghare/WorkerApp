import React from 'react'

export default function PeddingRequast({requests,handleAccept,handleReject}) {
  return (
    <div>
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
    </div>
  )
}
