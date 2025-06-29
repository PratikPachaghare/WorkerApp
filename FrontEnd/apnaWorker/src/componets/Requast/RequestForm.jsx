import React, { useState, useRef } from "react";
import "./RequestForm.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation, useNavigate } from "react-router-dom";
import CardShow from "./workerDetailCard";
import imageCompression from "browser-image-compression";
import Loader from "../Loder/Loader";

const RequestForm = ({ userId }) => {
  const [Lodding,setLodding] = useState(false);
  const [LoddingLoc,setLoddingLoc] = useState(false);
  const location = useLocation();
  const navigator = useNavigate();
  const { worker, data } = location.state || {};

  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };
  const [Location, setLocation] = useState("Amravati");
  const [form, setForm] = useState({
    message: "",
    date: "",
    time: "",
    ProblamImage:"",
    coordinates: [77.7796, 20.9374],
    LocationName: { Location }, // Amravati
  });

  const mapRef = useRef(null);

  const handleChange = (e) => {
    if(e.target.name=="time"){
      console.log("time :",e.target.value);
    }
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

    const handleImage = async (e) => {
      const imageFile = e.target.files[0];
      if (imageFile) {
        const options = {
          maxSizeMB: 0.4,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };
        try {
          const compressedFile = await imageCompression(imageFile, options);
          setForm({ ...form, ProblamImage: compressedFile });
          setImage(URL.createObjectURL(compressedFile));
        } catch (err) {
          console.error("Compression failed:", err);
        }
      }
    };

  const markerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLodding(true);
    try {
      // Combine date and time into a single Date object
      const formData = new FormData();
      formData.append("user", data._id);
      formData.append("worker", worker._id);
      formData.append("message", form.message);
      formData.append("requestedTime", form.time);
      formData.append("requestedDate", form.date);
      formData.append("longtitude", form.coordinates[1]);
      formData.append("latitude", form.coordinates[0]);
      formData.append("address", data.address);

      if(form.ProblamImage){
        formData.append("ProblamImage",form.ProblamImage);
      }

      const response = await fetch(
        "http://localhost:3000/api/requests/create",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      setLodding(false);
      if (response.ok) {
        alert("Request submitted successfully!");
        navigator("/request");
      } else {
        console.error("Failed:", result);
        alert("Failed to submit request");
      }
    } catch (error) {
      setLodding(false);
      console.error("❌ Error submitting request:", error);
    }
  };

  const detectMyLocation = () => {
    setLoddingLoc(true);
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
    setLoddingLoc(false);
  };

    const getPointedLocation = ()=>{
     getAddressFromCoords(form.coordinates[1],form.coordinates[0]);
  }

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
        {Lodding && <Loader/>}
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

                <div className="flex gap-1">
                  <button
                    type="button"
                    className="detect-btn"
                    onClick={getPointedLocation}
                  >
                    get pointend location
                  </button>
                  <button
                    type="button"
                    className="detect-btn"
                    onClick={detectMyLocation}
                  >
                    {LoddingLoc? "Lodding...":"Detect My Location"}
                  </button>
                </div>

                <label htmlFor="imageUpload">
                  Upload problam image *Not required
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  name="img"
                  accept="image/*"
                  onChange={handleImage}
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
