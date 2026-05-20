import React, { useState, useEffect } from "react";
import "../style/appointment.css";
import i2 from "../Images/3.png";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Building2, Stethoscope } from "lucide-react";
import api from "../api/apiService";

const DoctorRegister = () => {
  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    password: "",
    hospitalId: "",
    specialization: "",
  });
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await api.get("/api/doctors/hospitals");
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
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const response = await api.post("/api/doctors/register", doctor);
      setMessage(response.data.message || "Registered.");
      if (response.data.success) {
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="left-section">
        <div className="left-text">
          <p className="appt-eyebrow">For doctors</p>
          <div className="left-big-title">Join your hospital on LifeLink.</div>
          <p style={{ color: "#64748b", fontSize: 14 }}>See your schedule clearly. Confirm appointments in one click.</p>
        </div>
        <div className="left-image">
          <img src={i2} alt="Healthcare illustration" />
        </div>
      </div>

      <div className="right-section">
        <form className="login-boxx" onSubmit={handleSubmit}>
          <h1>Doctor registration</h1>

          <label><User size={12}/> Doctor name *</label>
          <input type="text" name="name" placeholder="Dr. Full Name" onChange={handleChange} required />

          <label><Mail size={12}/> Email *</label>
          <input type="email" name="email" placeholder="you@hospital.com" onChange={handleChange} required />

          <label><Lock size={12}/> Password *</label>
          <input type="password" name="password" placeholder="Minimum 6 characters" minLength={6} onChange={handleChange} required />

          <label><Stethoscope size={12}/> Specialization</label>
          <input type="text" name="specialization" placeholder="e.g. Cardiology" onChange={handleChange} />

          <label><Building2 size={12}/> Hospital *</label>
          <select name="hospitalId" onChange={handleChange} required value={doctor.hospitalId}>
            <option value="">Select hospital</option>
            {hospitals.map((hospital) => (
              <option key={hospital._id} value={hospital._id}>
                {hospital.name}
              </option>
            ))}
          </select>

          {error && <div className="appt-alert error">{error}</div>}
          {message && <div className="appt-alert success">{message}</div>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Creating…" : "Create account"}
          </button>

          <p style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>
            Already registered? <span style={{ color: "#dc2626", cursor: "pointer", fontWeight: 600 }} onClick={() => navigate("/login")}>Sign in</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegister;
