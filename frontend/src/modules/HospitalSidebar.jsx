import React from 'react';
import "../style/hospital.css"; 
import { useLocation, useNavigate } from 'react-router-dom';
const HospitalSidebar = () => {
  const navigate= useNavigate();
  const location = useLocation();
  let lastSegment = location.pathname.split("/").filter(Boolean).pop();
  return (
    <aside className="sidebar2">
      <div className={`sidebar-link2 ${lastSegment === "hospitaldash" ? "activee" : ""}`} onClick={() => navigate('/hospitaldash')}>
        
        Dashboard
      </div>
      <div className={`sidebar-link2 ${lastSegment === "patients" ? "activee" : ""}`} onClick={() => navigate('/hospitaldash/patients')}>
        
        Patients
      </div>
      <div className={`sidebar-link2 ${lastSegment === "doctors" ? "activee" : ""}`} onClick={() => navigate('/hospitaldash/doctors')}>
        Doctors
      </div>
    </aside>
  );
};

export default HospitalSidebar;
