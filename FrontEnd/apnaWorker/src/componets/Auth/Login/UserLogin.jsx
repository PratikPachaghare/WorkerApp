import React, { useState } from "react";
import "./UserLogin.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loder/Loader.jsx";

const UserLogin = () => {
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    coordinates: [77.7558, 20.9334], // Optional if needed
  });

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        emailOrPhone: form.email, // Either email or phone in one field
        password: form.password,
      };

      const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login successful");
        localStorage.setItem("UserToken", data.token);
        localStorage.setItem("isWorker", data.user.isWorker);
        setLoading(false);
        setTimeout(() => {
          window.location.href = "/"; // full reload but maintains route
        }, 1000);
      } else {
        toast.error(data.message || "Login failed");
        setLoading(false);
      }
    } catch (error) {
      console.error("❌ Error during login:", error);
      toast.error("Add info correct :Please try again .");
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {Loading && <Loader />}
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Login Account</h2>
        <label htmlFor="Email">Email Or Phone</label>
        <input
          type="text"
          name="email"
          id="Email"
          className="border border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded"
          placeholder="Email or Phone"
          required
          onChange={handleInput}
        />

        <label htmlFor="Password">Password</label>
        <input
          type="password"
          name="password"
          id="Password"
          className="border border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded"
          placeholder="Password"
          required
          onChange={handleInput}
        />

        <button type="submit" className="detect-btn mt-2 m-auto justify-center">
          Login
        </button>
      </form>

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default UserLogin;
