import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from "../Images/logo.png";
import "../style/hospitaldash.css";
import HospitalNavbar from '../modules/HospitalNavbar';
import HospitalSidebar from '../modules/HospitalSidebar';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../api/apiService";

const HospitalDash = () => {
    const [hospitalData, setHospitalData] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchHospitalData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/hospital/dashboard`, {
                    withCredentials: true, 
                });
                setHospitalData(response.data);
            } catch (error) {
                console.error("Error fetching hospital data:", error);
            }
        };

        fetchHospitalData();
    }, []);
    useEffect(() => {
        const checkSession = async () => {
          try {
            const response = await axios.get(`${API_URL}/api/auth/check-cookies`, { withCredentials: true });
            
           if (response.data.role === "hospital") {
              navigate("/hospitaldash");
            }else{
                navigate("/login")
            }
          } catch (error) {
            
            navigate('/login')
          }
        };
    
        checkSession();
      }, []);
    return (
        <>
        <div className='navbar-container'>
        <HospitalNavbar />

        </div>
            <div className="main-container">
                <div className="hospital-sidebar">
                    <HospitalSidebar />
                </div>

<main className="main-content">
<div className="dashboard-header">
        <img src={logo} alt="LifeLink Logo" className="dashboard-logo" />
        <div className="dashboard-header-text">
            <h1 className="dashboard-title">
                {hospitalData ? hospitalData.hospitalName : "Hospital"}
            </h1>
            <p className="dashboard-subtitle">Welcome to LifeLink</p>
        </div>
    </div>
    <div className="stats-container">
        <div className="stat-card">
            <p className="stat-label">Total Patients</p>
            <p className="stat-value">
                {hospitalData ? hospitalData.totalPatients : "Loading..."}
            </p>
        </div>
        <div className="stat-card">
            <p className="stat-label">Total Doctors</p>
            <p className="stat-value">
                {hospitalData ? hospitalData.totalDoctors : "Loading..."}
            </p>
        </div>
    </div>
</main>
            </div>
        </>
    );
};

export default HospitalDash;