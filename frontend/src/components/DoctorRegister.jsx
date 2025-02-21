import React, { useState, useEffect } from "react";
import axios from "axios";

const DoctorRegister = () => {
  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    password: "",
    hospitalId: "",
  });

  const [hospitals, setHospitals] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch hospitals from backend
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/doctors/hospitals");
        setHospitals(response.data);
      } catch (error) {
        console.error("Error fetching hospitals", error);
      }
    };
    fetchHospitals();
  }, []);

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/doctors/register", doctor);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Doctor Registration</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Doctor Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        
        <select name="hospitalId" onChange={handleChange} required>
          <option value="">Select Hospital</option>
          {hospitals.map((hospital) => (
            <option key={hospital._id} value={hospital._id}>
              {hospital.name}
            </option>
          ))}
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default DoctorRegister;
