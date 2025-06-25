import React, { useState, useRef } from "react";
import "./RequestForm.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation } from "react-router-dom";
import CardShow from "./workerDetailCard";

const RequestForm = ({ userId }) => {
  const location = useLocation();
  const { worker,data } = location.state || {};

  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };
  const [Location, setLocation] = useState("Amravati");
  const [form, setForm] = useState({
    worker: "",
    message: "",
    requestedTime: "",
    coordinates: [77.7796, 20.9374],
    LocationName: { Location }, // Amravati
  });

  const mapRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getAddressFromCoords = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      console.log("Exact Address:", data.display_name);
      setLocation(data.display_name);
      return data;
    } catch (err) {
      console.error("Error fetching address:", err);
      return "Address not found";
    }
  };

  const markerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestPayload = {
      // user: userId,
      user: "bsfe100026584fec",
      // worker: workers,
      worker: worker,
      message: form.message,
      requestedTime: new Date(form.requestedTime),
      location: {
        type: "Point",
        coordinates: form.coordinates,
      },
    };
    console.log("Submitting request:", requestPayload);
    // Send to backend...
  };

  const detectMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setForm((prev) => ({ ...prev, coordinates: [lng, lat] }));
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 13);
        }
        const data = getAddressFromCoords(lat, lng);

        console.log("location detedt: ", location);
      });
    } else {
      alert("Geolocation not supported.");
    }
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setForm({ ...form, coordinates: [e.latlng.lng, e.latlng.lat] });
      },
    });

    return (
      <Marker
        position={[form.coordinates[1], form.coordinates[0]]}
        icon={markerIcon}
      />
    );
  }

  return (
    <div>
      <CardShow worker={worker} />
      <div className="request-form-container">
        <form className="request-form" onSubmit={handleSubmit}>
          <h2>Request a Service</h2>
          <div className="main-container-deckstop">
            <div className="Left">
              {/* Worker Selection */}
              <label>Worker of Service:</label>
              <input
                name="worker"
                // value={workers.name}
                value={worker.name}
                onChange={handleChange}
                required
                disabled={true}
              ></input>

              <label>Worker of category:</label>
              <input
                name="worker"
                // value={workers.name}
                value={worker.categories}
                onChange={handleChange}
                required
                disabled={true}
              ></input>

              <label>Worker Location:</label>
              <input
                name="worker"
                // value={workers.name}
                value={worker.address}
                onChange={handleChange}
                required
                disabled={true}
              ></input>

              {/* Message Text Area */}
              <label>Message of Service:</label>
              <textarea
                name="message"
                placeholder="Describe your problem..."
                value={form.message}
                onChange={handleChange}
                rows={8} // Increase vertical size
                cols={50}
              />

              {/* Date and Time */}
              <label>Select Date of Service:</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />

              <label>Select Time:</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
              />
            </div>
            {/* for deckstop container */}
            <div className="Right">
              {/* Map for Location */}
              <div className="map-section">
                <label>Choose service location:</label>
                <MapContainer
                  center={[form.coordinates[1], form.coordinates[0]]}
                  zoom={9}
                  scrollWheelZoom={false}
                  className="map"
                  whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  <LocationMarker />
                </MapContainer>

                <input
                  type="text"
                  name="LocationName"
                  placeholder={Location}
                  disabled={true}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="detect-btn block"
                  onClick={detectMyLocation}
                >
                  Detect My Location
                </button>

                <label htmlFor="imageUpload">
                  Upload problam image *Not required
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  name="img"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />

                {image && (
                  <div className="image-preview">
                    <img src={image} alt="Preview" className="w-3/5" />
                  </div>
                )}

                <p>
                  Selected: Lat {form.coordinates[1].toFixed(4)}, Lng{" "}
                  {form.coordinates[0].toFixed(4)}
                </p>
              </div>
            </div>
          </div>
          {/* Submit */}
          <button type="submit" className="submit-btn">
            Send Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;
