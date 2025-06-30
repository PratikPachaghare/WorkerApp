import React, { useState } from 'react';
import './Pendding.css';

export default function PeddingRequast({ pending = [], handleAccept, handleReject }) {
  const [lightboxImage, setLightboxImage] = useState(null);

  return (
    <div>
      <div className="request-list">
        {pending.length === 0 ? (
          <p>No new requests.</p>
        ) : (
          pending.map((req) => (
            <div key={req._id} className="request-card">
              <h3>{req.user?.name || 'Unknown User'}</h3>
              <p>
                <strong>Address:</strong> {req.user?.address || 'N/A'}
              </p>
              <p>
                <strong>Message:</strong> {req.message}
              </p>
              <p>
                <strong>Date:</strong>{' '}
                {req.requestedDate
                  ? new Date(req.requestedDate).toLocaleDateString()
                  : 'N/A'}
              </p>
              <p>
                <strong>Time:</strong> {req.requestedTime || 'N/A'}
              </p>
              {req.image && (
                <div style={{ margin: '10px 0' }}>
                  <img
                    src={req.image}
                    alt="request"
                    style={{
                      width: '100%',
                      maxWidth: '300px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                    onClick={() => setLightboxImage(req.image)}
                  />
                </div>
              )}
              <div className="card-buttons">
                <button
                  className="accept"
                  onClick={() => handleAccept(req)}
                >
                  Accept
                </button>
                <button
                  className="reject"
                  onClick={() => handleReject(req._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxImage && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxImage(null)}
        >
          <img
            src={lightboxImage}
            alt="Zoomed"
            className="lightbox-image"
          />
        </div>
      )}
    </div>
  );
}
