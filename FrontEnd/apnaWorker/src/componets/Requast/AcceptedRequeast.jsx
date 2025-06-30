import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Accept.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// only shows the user location 
// function openGoogleMaps(lat, lng) {
//   const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
//   window.open(url, "_blank", "noopener,noreferrer");
// }

// show the path also from worker to user lcoation 
function openGoogleMapsDirection(workerLat, workerLng, userLat, userLng) {
  const url = `https://www.google.com/maps/dir/?api=1&origin=${workerLat},${workerLng}&destination=${userLat},${userLng}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export default function AcceptedRequeast({ accepted, workerLocation }) {
  return (
    <div className="accepted-list">
      {accepted.length === 0 ? (
        <p>No accepted requests yet.</p>
      ) : (
        accepted.map((req) => {
          // Note: GeoJSON is [longitude, latitude]
          const userLng = req.location.coordinates[1];
          const userLat = req.location.coordinates[0];

          const workerLat = workerLocation[0];
          const workerLng = workerLocation[1];

          const distance = getDistanceFromLatLonInKm(
            workerLat,
            workerLng,
            userLat,
            userLng
          ).toFixed(2);

          return (
            <div key={req._id} className="request-card accepted">
              <div
                className="details-image-container"
                style={{
                  display: "flex",
                  gap: "20px",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <div className="details" style={{ flex: 1, minWidth: "280px" }}>
                  <h3>{req.user.name}</h3>
                  <p><strong>Phone:</strong> {req.user.phone}</p>
                  <p><strong>Email:</strong> {req.user.email}</p>
                  <p><strong>Address:</strong> {req.user.address}</p>
                  <p><strong>Message:</strong> {req.message}</p>
                  <p><strong>Date:</strong> {new Date(req.requestedDate).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {req.requestedTime}</p>

                  {/* ADD THIS BUTTON */}
                  <button
                    className="track-btn"
                    onClick={() =>  openGoogleMapsDirection(workerLat, workerLng, userLat, userLng)}
                    style={{
                      background: "#0077cc",
                      color: "#fff",
                      padding: "10px 15px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginTop: "10px",
                    }}
                  >
                    Track Location on Google Maps
                  </button>
                </div>

                {req.image && (
                  <div className="image-container" style={{ flex: "0 0 300px" }}>
                    <img
                      src={req.image}
                      alt="request"
                      style={{ width: "100%", borderRadius: "6px" }}
                    />
                  </div>
                )}
              </div>

              <div className="map-container" style={{ marginTop: "20px" }}>
                <MapContainer
                  center={[userLat, userLng]}
                  zoom={9}
                  scrollWheelZoom={false}
                  style={{ height: "300px", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[userLat, userLng]}>
                    <Popup>
                      User Location: {req.user.address}
                      <br />
                      {req.user.name}
                      <br />
                      <span
                        onClick={() => openGoogleMaps(userLat, userLng)}
                        style={{
                          cursor: "pointer",
                          color: "blue",
                          textDecoration: "underline",
                        }}
                      >
                        Track Location on Google Maps
                      </span>
                    </Popup>
                  </Marker>
                  <Marker position={[workerLat, workerLng]}>
                    <Popup>Worker Location</Popup>
                  </Marker>
                </MapContainer>

                <p
                  className="distance-text"
                  style={{ marginTop: "10px", fontWeight: "bold" }}
                >
                  Distance between worker and user: <strong>{distance} km</strong>
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
