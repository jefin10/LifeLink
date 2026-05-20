import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Stethoscope, CalendarDays, MapPin } from 'lucide-react';
import "../style/hospitaldash.css";
import HospitalNavbar from '../modules/HospitalNavbar';
import HospitalSidebar from '../modules/HospitalSidebar';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../api/apiService";

const HospitalDash = () => {
    const [hospitalData, setHospitalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        const bootstrap = async () => {
            try {
                const session = await axios.get(`${API_URL}/api/auth/check-cookies`, { withCredentials: true });
                if (session.data.role !== "hospital") {
                    navigate("/login");
                    return;
                }
                const dash = await axios.get(`${API_URL}/api/hospital/dashboard`, { withCredentials: true });
                if (!cancelled) setHospitalData(dash.data);
            } catch (error) {
                navigate('/login');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        bootstrap();
        return () => { cancelled = true; };
    }, [navigate]);

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
                        <div className="dashboard-header-text">
                            <p className="dashboard-eyebrow">Hospital portal</p>
                            <h1 className="dashboard-title">
                                {hospitalData?.hospitalName || (loading ? "Loading…" : "Hospital")}
                            </h1>
                            {hospitalData?.address && (
                                <p className="dashboard-subtitle">
                                    <MapPin size={16} /> {hospitalData.address}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="stats-container">
                        <div className="stat-card">
                            <div className="stat-icon-wrap stat-blue">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="stat-label">Total Patients</p>
                                <p className="stat-value">
                                    {hospitalData ? hospitalData.totalPatients : "—"}
                                </p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-wrap stat-green">
                                <Stethoscope size={20} />
                            </div>
                            <div>
                                <p className="stat-label">Total Doctors</p>
                                <p className="stat-value">
                                    {hospitalData ? hospitalData.totalDoctors : "—"}
                                </p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-wrap stat-red">
                                <CalendarDays size={20} />
                            </div>
                            <div>
                                <p className="stat-label">Total Appointments</p>
                                <p className="stat-value">
                                    {hospitalData ? (hospitalData.totalAppointments ?? 0) : "—"}
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default HospitalDash;
