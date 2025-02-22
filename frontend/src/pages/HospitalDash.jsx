import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from "../Images/logo.png";
import "../style/hospital.css";
import HospitalNavbar from '../modules/HospitalNavbar';
import HospitalSidebar from '../modules/HospitalSidebar';

const HospitalDash = () => {
    const [hospitalData, setHospitalData] = useState(null);

    useEffect(() => {
        const fetchHospitalData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/hospital/dashboard", {
                    withCredentials: true, 
                });
                setHospitalData(response.data);
            } catch (error) {
                console.error("Error fetching hospital data:", error);
            }
        };

        fetchHospitalData();
    }, []);

    return (
        <>
            <HospitalNavbar />
            <div className="main-container">
                <div className="hospital-sidebar">
                    <HospitalSidebar />
                </div>

                <main className="main-content">
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">
                            {hospitalData ? hospitalData.hospitalName : "Hospital"}
                        </h1>
                        <p className="dashboard-subtitle">Welcome to LifeLink</p>
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
