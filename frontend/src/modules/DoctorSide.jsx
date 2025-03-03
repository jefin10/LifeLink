import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../style/hospital.css"; // Ensure this file contains your sidebar CSS

const DoctorSide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let lastSegment = location.pathname.split("/").filter(Boolean).pop();  return (
    <aside className="sidebar2">
      <button className={`sidebar-link2 ${lastSegment === "doctordash" ? "active" : ""}`}
      onClick={() => navigate('/doctordash')}>
        
        Dashboard
      </button>
      <button className={`sidebar-link2 ${lastSegment === "patients" ? "active" : ""}`} onClick={() => navigate('/doctordash/patients')}>
        
        Patients
      </button>
      <button className={`sidebar-link2 ${lastSegment === "appointments" ? "active" : ""}`} onClick={() => navigate('/doctordash/appointments')}>
        
        Appointments
      </button>
    </aside>
  );
};

export default DoctorSide;