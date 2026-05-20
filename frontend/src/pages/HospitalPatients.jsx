import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Plus, Search, X, UserRound } from "lucide-react";
import "../style/hospitalpatients.css";
import HospitalNavbar from "../modules/HospitalNavbar";
import HospitalSidebar from "../modules/HospitalSidebar";
import { API_URL } from "../api/apiService";

const HospitalPatients = () => {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [hospitalId, setHospitalId] = useState(null);
    const [newPatient, setNewPatient] = useState({
        name: "",
        age: "",
        condition: "",
        doctorId: "",
        phone: "",
        email: "",
    });

    useEffect(() => {
        const fetchHospitalId = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/hospital/me`, {
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
            setPatients([response.data.patient, ...patients]);
            setShowForm(false);
            setNewPatient({ name: "", age: "", condition: "", doctorId: "", phone: "", email: "" });
        } catch (error) {
            console.error("Error adding patient:", error);
        }
    };

    const filteredPatients = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return patients;
        return patients.filter(p =>
            p.name?.toLowerCase().includes(q) ||
            p.condition?.toLowerCase().includes(q) ||
            String(p.age).includes(q)
        );
    }, [patients, search]);

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
                        <div>
                            <p className="dashboard-eyebrow">Roster</p>
                            <h1 className="dashboard-title">Patients</h1>
                            <p className="dashboard-subtitle">All patients registered under this hospital.</p>
                        </div>
                        <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
                            {showForm ? <><X size={16}/> Close</> : <><Plus size={16}/> Add patient</>}
                        </button>
                    </div>

                    {showForm && (
                        <form className="card patient-form" onSubmit={handleAddPatient}>
                            <h3 className="card-title">New patient</h3>
                            <div className="form-grid">
                                <div className="field">
                                    <label>Name *</label>
                                    <input type="text" name="name" placeholder="Full name" value={newPatient.name} onChange={handleChange} required />
                                </div>
                                <div className="field">
                                    <label>Age *</label>
                                    <input type="number" min="0" max="150" name="age" placeholder="e.g. 32" value={newPatient.age} onChange={handleChange} required />
                                </div>
                                <div className="field full">
                                    <label>Condition *</label>
                                    <input type="text" name="condition" placeholder="e.g. Hypertension" value={newPatient.condition} onChange={handleChange} required />
                                </div>
                                <div className="field">
                                    <label>Doctor *</label>
                                    <select name="doctorId" value={newPatient.doctorId} onChange={handleChange} required>
                                        <option value="">Select doctor</option>
                                        {doctors.map((doctor) => (
                                            <option key={doctor._id} value={doctor._id}>
                                                {doctor.name}{doctor.specialization ? ` — ${doctor.specialization}` : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="field">
                                    <label>Phone</label>
                                    <input type="tel" name="phone" placeholder="Optional" value={newPatient.phone} onChange={handleChange} />
                                </div>
                                <div className="field full">
                                    <label>Email</label>
                                    <input type="email" name="email" placeholder="Optional" value={newPatient.email} onChange={handleChange} />
                                </div>
                            </div>
                            <button type="submit" className="primary-btn solid">Save patient</button>
                        </form>
                    )}

                    <div className="card">
                        <div className="card-toolbar">
                            <div className="search-wrap">
                                <Search size={14} />
                                <input
                                    placeholder="Search by name, condition, age"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <p className="muted">{filteredPatients.length} of {patients.length}</p>
                        </div>

                        {filteredPatients.length > 0 ? (
                            <div className="table-scroll">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Age</th>
                                            <th>Condition</th>
                                            <th>Doctor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPatients.map((patient) => (
                                            <tr key={patient._id}>
                                                <td>
                                                    <div className="cell-name">
                                                        <span className="avatar"><UserRound size={14}/></span>
                                                        {patient.name}
                                                    </div>
                                                </td>
                                                <td>{patient.age}</td>
                                                <td>{patient.condition}</td>
                                                <td>{patient.doctorId?.name || "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <UserRound size={28} />
                                <p>No patients found{search ? " for that search" : ""}.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default HospitalPatients;
