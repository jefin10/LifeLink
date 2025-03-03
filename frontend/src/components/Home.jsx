import React from 'react';
import "../style/home.css";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="main-title">Revolutionizing Healthcare, One Click at a Time
        </h1>
        <p className="subtitle">One platform for seamless healthcare management</p>
        
        <div className="user-paths">
          <div className="path-card">
            <span className="icon">🏥</span>
            <h2>Hospitals</h2>
            <p>Streamline operations and manage appointments efficiently</p>
            <button className="path-button hospital" onClick={() => navigate("/hospitaldash")}>Hospital Portal</button>
          </div>

          <div className="path-card">
            <span className="icon">👨‍⚕️</span>
            <h2>Doctors</h2>
            <p>Manage your schedule and connect with patients easily</p>
            <button className="path-button doctor" onClick={() => navigate("/doctordash")}>Doctor Login</button>
          </div>

          <div className="path-card">
            <span className="icon">👥</span>
            <h2>Patients</h2>
            <p>Book appointments and access healthcare services</p>
            <button className="path-button patient" onClick={() => navigate("/appointment")}>Book Appointment</button>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Home;