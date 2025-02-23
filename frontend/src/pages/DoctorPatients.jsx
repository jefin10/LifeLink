import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/hospital.css";

import DoctorNav from "../modules/DoctorNav";
import DoctorSide from "../modules/DoctorSide";


const DoctorPatients = () => {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    
    
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/doctors/patients", {
                    withCredentials: true,
                });
                setPatients(response.data.patients || []);
                
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };

        fetchPatients();
    }, []);

   
    

   

    return (
        <>
            <DoctorNav />
            <div className="main-container">
                <div className="hospital-sidebar">
                    <DoctorSide/>
                </div>

                <main className="main-content">
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">Patients</h1>
                        <p className="dashboard-subtitle">List of all patients under your care</p>
                       
                        
                    </div>

                    

                    <div className="patients-container">
                        {patients.length > 0 ? (
                            <table className="patients-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Age</th>
                                        <th>Condition</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients.map((patient, index) => (
                                        <tr key={index}>
                                            <td>{patient._id}</td>
                                            <td>{patient.name}</td>
                                            <td>{patient.age}</td>
                                            <td>{patient.condition}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-data">No Patients Found</p>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default DoctorPatients;
