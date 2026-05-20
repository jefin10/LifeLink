import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, Stethoscope, Mail } from "lucide-react";
import "../style/hospitalpatients.css";
import HospitalNavbar from "../modules/HospitalNavbar";
import HospitalSidebar from "../modules/HospitalSidebar";
import { API_URL } from "../api/apiService";

const HospitalDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState("");

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

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return doctors;
        return doctors.filter(d =>
            d.name?.toLowerCase().includes(q) ||
            d.email?.toLowerCase().includes(q) ||
            d.specialization?.toLowerCase().includes(q)
        );
    }, [doctors, search]);

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
                            <h1 className="dashboard-title">Doctors</h1>
                            <p className="dashboard-subtitle">All doctors registered under this hospital.</p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-toolbar">
                            <div className="search-wrap">
                                <Search size={14} />
                                <input
                                    placeholder="Search by name, email, specialty"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <p className="muted">{filtered.length} of {doctors.length}</p>
                        </div>

                        {filtered.length > 0 ? (
                            <div className="table-scroll">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Specialization</th>
                                            <th>Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((doctor) => (
                                            <tr key={doctor._id}>
                                                <td>
                                                    <div className="cell-name">
                                                        <span className="avatar"><Stethoscope size={14}/></span>
                                                        Dr. {doctor.name}
                                                    </div>
                                                </td>
                                                <td>{doctor.specialization || "General Physician"}</td>
                                                <td>
                                                    <span className="cell-link">
                                                        <Mail size={14}/> {doctor.email}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <Stethoscope size={28} />
                                <p>No doctors found{search ? " for that search" : ""}.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default HospitalDoctors;
