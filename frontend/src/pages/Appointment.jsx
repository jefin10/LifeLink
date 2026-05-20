import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/appointment.css";
import i2 from "../Images/3.png";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Building2, Stethoscope, User, Hash, Activity, CheckCircle2 } from "lucide-react";
import { API_URL } from "../api/apiService";

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
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const minDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/hospital/getall`);
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
          setSelectedDoctor("");
          return;
        }

        const response = await axios.post(
          `${API_URL}/api/doctors/getall`,
          { hospitalId: selectedHospital },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data && response.data.doctors) {
          setDoctors(response.data.doctors);
        } else {
          setDoctors([]);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, [selectedHospital]);

  const handleAppointment = async (e) => {
    e?.preventDefault?.();
    setError("");
    setSuccess("");

    if (!date || !time || !selectedDoctor || !selectedHospital || !name || !age || !condition) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/appointments/book`,
        { date, time, doctorId: selectedDoctor, hospitalId: selectedHospital, name, age, condition, phone, email, reason },
        { withCredentials: true }
      );

      setSuccess(response.data.message || "Appointment booked.");
      setTimeout(() => navigate("/"), 1400);
    } catch (err) {
      setError(err.response?.data?.message || "Could not book appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="appt-container">
      <aside className="appt-left">
        <div className="appt-left-inner">
          <p className="appt-eyebrow">For patients</p>
          <h1 className="appt-title">Book your appointment</h1>
          <p className="appt-sub">Pick a hospital, choose a doctor, lock in a time. We'll do the rest.</p>

          <ul className="appt-bullets">
            <li><CheckCircle2 size={16} /> No phone calls or paperwork</li>
            <li><CheckCircle2 size={16} /> See your doctor's real-time slots</li>
            <li><CheckCircle2 size={16} /> Instant confirmation from the clinic</li>
          </ul>

          <div className="appt-image">
            <img src={i2} alt="Healthcare illustration" />
          </div>
        </div>
      </aside>

      <main className="appt-right">
        <form className="appt-card" onSubmit={handleAppointment}>
          <h2>Appointment details</h2>
          <p className="appt-card-sub">All fields marked with * are required.</p>

          <div className="appt-grid">
            <div className="field">
              <label><Building2 size={14}/> Hospital *</label>
              <select value={selectedHospital} onChange={(e) => setSelectedHospital(e.target.value)} required>
                <option value="">Select hospital</option>
                {hospitals.map((hospital) => (
                  <option key={hospital._id} value={hospital._id}>{hospital.name}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label><Stethoscope size={14}/> Doctor *</label>
              <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required disabled={!selectedHospital}>
                <option value="">{selectedHospital ? "Select doctor" : "Choose hospital first"}</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name}{doctor.specialization ? ` — ${doctor.specialization}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label><Calendar size={14}/> Date *</label>
              <input type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>

            <div className="field">
              <label><Clock size={14}/> Time *</label>
              <select value={time} onChange={(e) => setTime(e.target.value)} required>
                <option value="">Select time</option>
                {[...Array(4)].map((_, i) => {
                  const hour = 8 + i;
                  const value = `${String(hour).padStart(2, "0")}:00`;
                  return <option key={value} value={value}>{hour}:00 AM</option>;
                })}
                <option value="12:00">12:00 PM</option>
                {[...Array(6)].map((_, i) => {
                  const hour24 = 13 + i;
                  const display = hour24 - 12;
                  const value = `${String(hour24).padStart(2, "0")}:00`;
                  return <option key={value} value={value}>{display}:00 PM</option>;
                })}
              </select>
            </div>

            <div className="field">
              <label><User size={14}/> Patient name *</label>
              <input type="text" placeholder="e.g. Priya Sharma" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="field">
              <label><Hash size={14}/> Age *</label>
              <input type="number" min="0" max="150" placeholder="e.g. 32" value={age} onChange={(e) => setAge(e.target.value)} required />
            </div>

            <div className="field full">
              <label><Activity size={14}/> Medical condition *</label>
              <input type="text" placeholder="Briefly describe the issue" value={condition} onChange={(e) => setCondition(e.target.value)} required />
            </div>

            <div className="field">
              <label>Phone (optional)</label>
              <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="field">
              <label>Email (optional)</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="field full">
              <label>Note for doctor (optional)</label>
              <textarea rows={3} placeholder="Anything the doctor should know in advance" value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
          </div>

          {error && <div className="appt-alert error">{error}</div>}
          {success && <div className="appt-alert success">{success}</div>}

          <button type="submit" className="appt-submit" disabled={submitting}>
            {submitting ? "Booking…" : "Book appointment"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Appointment;
