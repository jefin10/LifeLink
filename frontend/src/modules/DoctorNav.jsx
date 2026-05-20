import React, { useEffect, useState } from 'react';
import logo from "../Images/logo.png";
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiService';

const DoctorNav = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    let cancelled = false;
    api.get("/api/auth/check-cookies")
      .then((r) => { if (!cancelled) setName(r.data?.name || ""); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <nav className="app-nav">
      <div className="app-nav-inner">
        <div className="app-nav-brand">
          <img src={logo} alt="LifeLink Logo" className="app-nav-logo" />
          <span className="app-nav-name">LifeLink</span>
          <span className="app-nav-divider" />
          <span className="app-nav-tag">Doctor</span>
        </div>

        <div className="app-nav-right">
          {name && <span className="app-nav-user">Dr. {name}</span>}
          <button className="app-nav-logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNav;
