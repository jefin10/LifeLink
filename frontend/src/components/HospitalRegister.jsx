import React, { useState } from "react";
import "../style/appointment.css";
import i2 from "../Images/3.png";
import { useNavigate } from "react-router-dom";
import { Building2, Mail, Lock, MapPin, Phone } from "lucide-react";
import api from "../api/apiService";

const HospitalRegister = () => {
  const [hospital, setHospital] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setHospital({ ...hospital, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const response = await api.post("/api/hospital/register", hospital);
      setMessage(response.data.message || "Registered successfully.");
      setTimeout(() => navigate("/login"), 1200);
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
          <p className="appt-eyebrow">For hospitals</p>
          <div className="left-big-title">Bring your hospital online in minutes.</div>
          <p style={{ color: "#64748b", fontSize: 14 }}>Doctors and patients sync automatically once you're set up.</p>
        </div>
        <div className="left-image">
          <img src={i2} alt="Healthcare illustration" />
        </div>
      </div>
      <div className="right-section">
        <form className="login-boxx" onSubmit={handleSubmit}>
          <h1>Register your hospital</h1>

          <label><Building2 size={12}/> Hospital name *</label>
          <input type="text" name="name" placeholder="e.g. City Care Hospital" onChange={handleChange} required />

          <label><Mail size={12}/> Email *</label>
          <input type="email" name="email" placeholder="admin@hospital.com" onChange={handleChange} required />

          <label><Lock size={12}/> Password *</label>
          <input type="password" name="password" placeholder="Minimum 6 characters" minLength={6} onChange={handleChange} required />

          <label><MapPin size={12}/> Address *</label>
          <input type="text" name="address" placeholder="Street, city, postcode" onChange={handleChange} required />

          <label><Phone size={12}/> Phone (optional)</label>
          <input type="tel" name="phone" placeholder="+91 …" onChange={handleChange} />

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

export default HospitalRegister;
