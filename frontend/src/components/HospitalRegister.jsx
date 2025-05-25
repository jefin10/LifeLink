import React, { useState } from "react";
import api from "../api/apiService";

const HospitalRegister = () => {
  const [hospital, setHospital] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setHospital({ ...hospital, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/hospital/register", hospital);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Hospital Registration</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Hospital Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default HospitalRegister;
