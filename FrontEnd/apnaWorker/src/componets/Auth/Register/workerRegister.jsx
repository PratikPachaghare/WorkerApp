import React, { useState } from "react";
import "./UserRegister.css";
import "./WorkerProfile.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import imageCompression from "browser-image-compression";
import axios from "axios";
import { useEffect } from "react";
import Loader from "../../Loder/Loader";
import { useNavigate } from "react-router-dom";



const WorkerRegister = () => {
  const navigator = useNavigate();
  const [Loding,setLoding] = useState(false);
  const [Address,setAddress] = useState('Amravati');
  const categoriesData = ['All', 'Electrician', 'Plumber', 'Carpenter', 'Painter', 'Driver', 'Cook', 'Cleaner', 'AC Mechanic'];
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    categories:"",
    experience:"",
    description:"",
    coordinates: [77.7558, 20.9334],
    profileImage: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

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
        setForm({ ...form, profileImage: compressedFile });
        setImagePreview(URL.createObjectURL(compressedFile));
      } catch (err) {
        console.error("Compression failed:", err);
      }
    }
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setForm({ ...form, gender: e.target.value });
  };

  const markerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
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

  const detectMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        getAddressFromCoords(lat,lng);
        setForm({ ...form, coordinates: [lng, lat] });
      });
    } else {
      alert("Geolocation not supported");
    }
  };

  const getPointedLocation = ()=>{
     getAddressFromCoords(form.coordinates[1],form.coordinates[0]);
  }


   const getAddressFromCoords = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      setAddress(data.display_name);
      return data;
    } catch (err) {
      console.error("Error fetching address:", err);
      return "Address not found";
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoding(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("phone", form.phone);
    formData.append("gender", form.gender);
    formData.append("categories", form.categories);
    formData.append("experience", form.experience);
    formData.append("description", form.description);
    formData.append("longitude", form.coordinates[0]);
    formData.append("latitude", form.coordinates[1]);
    formData.append("address", Address);
    if (form.profileImage) {
      formData.append("profileImage", form.profileImage);
    }
    try {
      const response = await axios.post("http://localhost:3000/api/workers/register", formData);
      alert("Worker registered successfully");
      console.log(response.data);
      navigator("/");
    } catch (err) {
      console.error("Registration failed:", err);
    }
    setLoding(false);
  };

  return (
    <div className="register-container">
      
      <form className="register-form" onSubmit={handleSubmit}>
        {Loding && <Loader/>}
        <h2>Create Account</h2>

        <div className="profile-upload-container">
          <label htmlFor="profileImage" className="profile-image-label">
            <div className="profile-image-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" />
              ) : (
                <span>+</span>
              )}
            </div>
          </label>

          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="image/*"
            onChange={handleImage}
            hidden
            required
          />
          <p className="upload-text">Upload profile photo</p>
        </div>

        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          onChange={handleInput}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleInput}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleInput}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          required
          onChange={handleInput}
        />

        <label htmlFor="gender" className="block">Gender:</label>
        <select
          id="gender"
          name="gender"
          required
          value={form.gender}
          onChange={handleGenderChange}
          
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label htmlFor="categories" className="block">categories:</label>
        <select
          id="categories"
          name="categories"
          required
          value={form.categories}
          onChange={handleInput}
          className="block"
        >
          <option value="" disabled>
            Select Gender
          </option>
          {categoriesData.map((categori)=>
            <option key={categori} value={categori}>{categori}</option>
          )}
        </select>

        <label htmlFor="experience" className="block">experience:</label>
        <select
          id="experience"
          name="experience"
          required
          value={form.experience}
          onChange={handleInput}
          className="block"
        >
          <option value="" disabled>
            Select experience
          </option>
          <option value="1" >1 Year</option>
          <option value="2" >2 Year</option>
          <option value="3" >3 Year</option>
          <option value="4" >4 Year</option>
          <option value="5" >5 Year</option>
          
        </select>
        
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
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarker />
          </MapContainer>

          <div className="map-tools">
            <p>
              Selected: Lat {form.coordinates[1].toFixed(4)}, Lng{" "}
              {form.coordinates[0].toFixed(4)}
            </p>

          <input
          type="Address"
          name="Address"
          placeholder={Address}
          required
          disabled={true}
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
              Detect My Location
            </button>
          </div>  
          </div>
        </div>

        <label>write yourself and your achivment:</label>
            <textarea
              name="description"
              placeholder="I have able to repair AC , frez, House wiring etc...."
              value={form.description}
              onChange={handleInput}
              rows={8} // Increase vertical size
              cols={40}
              className="block border border-black "
            />

        <button type="submit" className="detect-btn mt-2 m-auto justify-center">
          Register
        </button>
      </form>
    </div>
  );
};

export default WorkerRegister;
