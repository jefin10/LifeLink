import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck } from 'lucide-react';
import "../style/sidebar.css";

const DoctorSide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastSegment = location.pathname.split("/").filter(Boolean).pop();

  const items = [
    { key: "doctordash",   label: "Dashboard",    icon: <LayoutDashboard size={16} />, to: "/doctordash" },
    { key: "patients",     label: "Patients",     icon: <Users size={16} />,           to: "/doctordash/patients" },
    { key: "appointments", label: "Appointments", icon: <CalendarCheck size={16} />,   to: "/doctordash/appointments" },
  ];

  return (
    <aside className="sidebar2">
      <p className="sidebar-section-title">Doctor</p>
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

export default DoctorSide;
