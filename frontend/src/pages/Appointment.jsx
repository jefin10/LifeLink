import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/appointment.css";
import i2 from "../Images/3.png";
import { useNavigate } from "react-router-dom";

const Appointment = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [condition, setCondition] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/hospital/getall");
        setHospitals(response.data.hospitals);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchHospitals();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        if (!selectedHospital) {
          setDoctors([]); 
          return;
        }
        
        const response = await axios.post(
          "http://localhost:5000/api/doctors/getall",
          { hospitalId: selectedHospital },
          { headers: { "Content-Type": "application/json" } }
        );
        
        if (response.data && response.data.doctors) {
          setDoctors(response.data.doctors);
        } else {
          setDoctors([]);
          console.error("No doctors data in response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      }
    };
  
    fetchDoctors();
  }, [selectedHospital]);

  const handleAppointment = async () => {
    if (!date || !time || !selectedDoctor || !selectedHospital || !name || !age || !condition) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/appointments/book",
        { date, time, doctorId: selectedDoctor, hospitalId: selectedHospital, name, age, condition },
        { withCredentials: true }
      );

      alert(response.data.message);
      navigate("/");
    } catch (error) {
      console.error("Error booking appointment:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container">
      <div className="left-section">
        <div className="left-text">
          <div className="left-big-title">Book Your Appointment</div>
          <div className="left-login">Ensure timely medical care with just a few clicks.</div>
        </div>
        <div className="left-image">
          <img src={i2} alt="Healthcare illustration" />
        </div>
      </div>

      <div className="right-section">
        <div className="login-boxx">
          <h1>Appointment Form</h1>

          <label>Select Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

          <label>Select Time:</label>
          <select value={time} onChange={(e) => setTime(e.target.value)}>
            <option value="">Select Time</option>
            {[...Array(4)].map((_, i) => {
              const hour = 8 + i;
              return <option key={hour} value={`${hour}:00`}>{hour}:00 AM</option>;
            })}
            <option value="12:00">12:00 PM</option>
            {[...Array(6)].map((_, i) => {
              const hour = 1 + i;
              return <option key={hour} value={`${hour}:00`}>{hour}:00 PM</option>;
            })}
          </select>

          <label>Select Hospital:</label>
          <select value={selectedHospital} onChange={(e) => setSelectedHospital(e.target.value)}>
            <option value="">Select Hospital</option>
            {hospitals.map((hospital) => (
              <option key={hospital._id} value={hospital._id}>
                {hospital.name} - {hospital.location}
              </option>
            ))}
          </select>

          <label>Select Doctor:</label>
          <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>

          <label>Patient Name:</label>
          <input type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />

          <label>Age:</label>
          <input type="number" placeholder="Enter Age" value={age} onChange={(e) => setAge(e.target.value)} />

          <label>Medical Condition:</label>
          <input placeholder="Describe your condition" value={condition} onChange={(e) => setCondition(e.target.value)} />

          <button onClick={handleAppointment}>Book Appointment</button>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
