import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/hospital.css";
import HospitalNavbar from "../modules/HospitalNavbar";
import HospitalSidebar from "../modules/HospitalSidebar";

const HospitalDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [hospitalId, setHospitalId] = useState(null);

    useEffect(() => {
        const fetchHospitalId = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/hospital/me", {
                    withCredentials: true,
                });
                setHospitalId(response.data.hospitalId);
            } catch (error) {
                console.error("Error fetching hospital ID:", error);
            }
        };

        fetchHospitalId();
    }, []);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/hospital/doctors", {
                    withCredentials: true,
                });
                setDoctors(response.data.doctors || []);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            }
        };

        fetchDoctors();
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
                        <h1 className="dashboard-title">Doctors</h1>
                        <p className="dashboard-subtitle">List of all doctors in the hospital</p>
                    </div>

                    <div className="doctors-container">
                        {doctors.length > 0 ? (
                            <table className="doctors-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Specialization</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doctors.map((doctor, index) => (
                                        <tr key={index}>
                                            <td>{doctor._id}</td>
                                            <td>{doctor.name}</td>
                                            <td>{doctor.specialization}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-data">No Doctors Found</p>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default HospitalDoctors;
