import React, { useState, useEffect } from 'react';
import './UserRegister.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

const UserRegister = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    coordinates: [77.7558, 20.9334],  // Default Bangalore
  });

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const markerIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

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

  const SearchLocation = () => {
    const [query, setQuery] = useState('');
    const map = useMap();

    const handleSearch = async () => {
      const provider = new OpenStreetMapProvider();
      const results = await provider.search({ query });
      if (results && results.length > 0) {
        const { x, y } = results[0];
        setForm({ ...form, coordinates: [x, y] });
        map.setView([y, x], 13);
      }
    };

    return (
      <div className="search-box">
        <input
          type="text"
          placeholder="Search location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" onClick={handleSearch}>Search</button>
      </div>
    );
  };

  const detectMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        setForm({ ...form, coordinates: [lng, lat] });
      });
    } else {
      alert('Geolocation not supported');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registering user:', form);
    // send data to backend...
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <input type="text" name="name" placeholder="Name" required onChange={handleInput} />
        <input type="email" name="email" placeholder="Email" required onChange={handleInput} />
        <input type="password" name="password" placeholder="Password" required onChange={handleInput} />
        <input type="tel" name="phone" placeholder="Phone" required onChange={handleInput} />

        <div className="map-section">
            
          <label>Select your location:</label>
          <MapContainer
            center={[form.coordinates[1], form.coordinates[0]]}
            zoom={9}
            scrollWheelZoom={true}
            className="map"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            
            <LocationMarker />
          </MapContainer>

          <div className="map-tools">
            <p>Selected: Lat {form.coordinates[1].toFixed(4)}, Lng {form.coordinates[0].toFixed(4)}</p>
            <button type="button" className="detect-btn" onClick={detectMyLocation}>
              Detect My Location
            </button>
          </div>
        </div>

        <button type="submit" className='detect-btn mt-2 m-auto justify-center'>Register</button>
      </form>
    </div>
  );
};

export default UserRegister;
