import React from 'react';
import '../style/navbar.css';
import logo from "../Images/logo.png";
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleAboutClick = () => {
    navigate('/about');
  };
  const handleLoginClick = () => {
    navigate('/Login');
  };
  const handleHomeClick = () => {
    navigate('/');
  };
  return (
    <div className="navbar">
      <div className="left-nav" onClick={handleHomeClick}>
        <div id="logo">
          <img src={logo} alt="LifeLink Logo" />
        </div>
        <div id="name">LifeLink</div>
      </div>
      
      <div className="center-nav">
        <div>Hospitals</div>
        <div>Doctors</div>
        <div onClick={handleAboutClick}>About</div>
      </div>
      
      <div className="right-nav">
        <div onClick={handleLoginClick} className="login-btn">
          Login
        </div>
      </div>
    </div>
  );
};

export default Navbar;