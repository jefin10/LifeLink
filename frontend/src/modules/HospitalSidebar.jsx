import React from 'react';
import "../style/sidebar.css";
import { LayoutDashboard, Users, Stethoscope, CalendarCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const HospitalSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastSegment = location.pathname.split("/").filter(Boolean).pop();

  const items = [
    { key: "hospitaldash", label: "Dashboard", icon: <LayoutDashboard size={16} />, to: "/hospitaldash" },
    { key: "patients",     label: "Patients",  icon: <Users size={16} />,           to: "/hospitaldash/patients" },
    { key: "doctors",      label: "Doctors",   icon: <Stethoscope size={16} />,     to: "/hospitaldash/doctors" },
    { key: "appointments", label: "Appointments", icon: <CalendarCheck size={16} />, to: "/hospitaldash/appointments" },
  ];

  return (
    <aside className="sidebar2">
      <p className="sidebar-section-title">Hospital</p>
      {items.map((it) => (
        <button
          key={it.key}
          className={`sidebar-link2 ${lastSegment === it.key ? "active" : ""}`}
          onClick={() => navigate(it.to)}
        >
          <span className="sidebar-link-icon">{it.icon}</span>
          {it.label}
        </button>
      ))}
    </aside>
  );
};

export default HospitalSidebar;
