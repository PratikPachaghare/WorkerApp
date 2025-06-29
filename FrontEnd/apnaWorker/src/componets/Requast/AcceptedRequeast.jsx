import React from 'react'

export default function AcceptedRequeast({accepted,details}) {
  return (
    <div>
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
    </div>
  )
}
