import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/hospitalpatients.css"; // NEW CSS FILE
import HospitalNavbar from "../modules/HospitalNavbar";
import HospitalSidebar from "../modules/HospitalSidebar";
import { API_URL } from "../api/apiService";

const HospitalPatients = () => {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [hospitalId, setHospitalId] = useState(null);
    const [newPatient, setNewPatient] = useState({
        name: "",
        age: "",
        condition: "",
        doctorId: "",
        hospitalId: hospitalId,
    });

    useEffect(() => {
        const fetchHospitalId = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/hospital/me`, {
                    withCredentials: true,
                });
                setHospitalId(response.data.hospitalId);
                setNewPatient(prev => ({ ...prev, hospitalId: response.data.hospitalId }));
            } catch (error) {
                console.error("Error fetching hospital ID:", error);
            }
        };
        fetchHospitalId();
    }, []);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/hospital/patients`, {
                    withCredentials: true,
                });
                setPatients(response.data.patients || []);
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };
        fetchPatients();
    }, []);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/hospital/doctors`, {
                    withCredentials: true,
                });
                setDoctors(response.data.doctors || []);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            }
        };
        fetchDoctors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPatient(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddPatient = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/hospital/addPatient`, newPatient, {
                withCredentials: true,
            });
            setPatients([...patients, response.data.patient]);
            setShowForm(false);
            setNewPatient({ name: "", age: "", condition: "", doctorId: "" });
        } catch (error) {
            console.error("Error adding patient:", error);
        }
    };

    return (
        <>
            <div className="navbar-container">
                <HospitalNavbar />
            </div>
            <div className="main-container">
                <div className="hospital-sidebar">
                    <HospitalSidebar />
                </div>
                <main className="main-content">
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">Patients</h1>
                        <p className="dashboard-subtitle">List of all patients in the hospital</p>
                        <button className="add-patient-btn" onClick={() => setShowForm(!showForm)}>
                            {showForm ? "Close Form" : "Add Patient"}
                        </button>
                    </div>
                    {showForm && (
                        <form className="patient-form" onSubmit={handleAddPatient}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Patient Name"
                                value={newPatient.name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="number"
                                name="age"
                                placeholder="Age"
                                value={newPatient.age}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="condition"
                                placeholder="Condition"
                                value={newPatient.condition}
                                onChange={handleChange}
                                required
                            />
                            <select name="doctorId" value={newPatient.doctorId} onChange={handleChange} required>
                                <option value="">Select Doctor</option>
                                {doctors.map((doctor) => (
                                    <option key={doctor._id} value={doctor._id}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </select>
                            <button type="submit" className="btn-submit">Add Patient</button>
                        </form>
                    )}
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

export default HospitalPatients;