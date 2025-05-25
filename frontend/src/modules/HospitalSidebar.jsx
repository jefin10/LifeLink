import React from 'react';
import "../style/sidebar.css"; 
import { useLocation, useNavigate } from 'react-router-dom';
const HospitalSidebar = () => {
  const navigate= useNavigate();
  const location = useLocation();
  let lastSegment = location.pathname.split("/").filter(Boolean).pop();
  return (
    <aside className="sidebar2">
      <button className={`sidebar-link2 ${lastSegment === "hospitaldash" ? "active" : ""}`} onClick={() => navigate('/hospitaldash')}>
        
        Dashboard
      </button>
      <button className={`sidebar-link2 ${lastSegment === "patients" ? "active" : ""}`} onClick={() => navigate('/hospitaldash/patients')}>
        
        Patients
      </button>
      <button className={`sidebar-link2 ${lastSegment === "doctors" ? "active" : ""}`} onClick={() => navigate('/hospitaldash/doctors')}>
        Doctors
      </button>
    </aside>
  );
};

export default HospitalSidebar;
