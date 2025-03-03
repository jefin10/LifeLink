import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/appointment.css";
import i2 from "../Images/3.png"
import { useNavigate } from "react-router-dom";




const DoctorRegister = () => {
  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    password: "",
    hospitalId: "",
  });
  const navigate = useNavigate()


  const [hospitals, setHospitals] = useState([]);
  const [message, setMessage] = useState("");
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
      if (response.data.success){
        navigate('/login')
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    
    <div className="container">
          <div className="left-section">
            <div className="left-text">
              <div className="left-big-title">Save Lives, One Match at a Time – Join LifeLink and Make a Difference Today! </div>
            </div>
            <div className="left-image">
              <img src={i2} alt="Healthcare illustration" />
            </div>
          </div>
    
          <div className="right-section">
            <div className="login-boxx">
              {message}
              <h1>Doctor Registration Form </h1>
    
              <label>Enter doctor name </label>
              <input type="text" name="name" placeholder="Doctor Name" onChange={handleChange} required />
    
              <label>Enter Email</label>
              <input type="email" name="email" placeholder="Email" onChange={handleChange} required />

    
              <label>Enter password</label>
              <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

    
              <label>Select Hospital:</label>
              <select name="hospitalId" onChange={handleChange} required>
          <option value="">Select Hospital</option>
          {hospitals.map((hospital) => (
            <option key={hospital._id} value={hospital._id}>
              {hospital.name}
            </option>
          ))}
        </select>
    
              
    
              <button onClick={handleSubmit}>Register </button>
            </div>
          </div>
        </div>
  );
};

export default DoctorRegister;
