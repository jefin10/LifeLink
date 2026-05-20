import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, UserRound, Download } from "lucide-react";
import "../style/hospitalpatients.css";
import "../style/doctor-dash.css";

import DoctorNav from "../modules/DoctorNav";
import DoctorSide from "../modules/DoctorSide";
import { API_URL } from "../api/apiService";
import { downloadCsv } from "../api/exportCsv";


const DoctorPatients = () => {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/doctors/patients`, {
                    withCredentials: true,
                });
                setPatients(response.data.patients || []);
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };

        fetchPatients();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return patients;
        return patients.filter(p =>
            p.name?.toLowerCase().includes(q) ||
            p.condition?.toLowerCase().includes(q) ||
            String(p.age).includes(q)
        );
    }, [patients, search]);

    return (
        <div className="doctor-dash-container">
            <div className="navbar-container">
                <DoctorNav />
            </div>
            <div className="doctor-dash-body">
                <div className="doctor-sidebar">
                    <DoctorSide />
                </div>
                <main className="doctor-main">
                    <div className="dashboard-header" style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12}}>
                        <div>
                            <p className="dashboard-eyebrow">Your roster</p>
                            <h1 className="dashboard-title">Patients</h1>
                            <p className="dashboard-subtitle">All patients under your care.</p>
                        </div>
                        <button
                            className="secondary-btn"
                            onClick={() => downloadCsv("my-patients.csv", filtered.map(p => ({
                                Name: p.name,
                                Age: p.age,
                                Condition: p.condition,
                                Phone: p.phone || "",
                                Email: p.email || "",
                            })))}
                        >
                            <Download size={14}/> Export
                        </button>
                    </div>

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
                            <p className="muted">{filtered.length} of {patients.length}</p>
                        </div>

                        {filtered.length > 0 ? (
                            <div className="table-scroll">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Age</th>
                                            <th>Condition</th>
                                            <th>Contact</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((patient) => (
                                            <tr key={patient._id}>
                                                <td>
                                                    <div className="cell-name">
                                                        <span className="avatar"><UserRound size={14}/></span>
                                                        {patient.name}
                                                    </div>
                                                </td>
                                                <td>{patient.age}</td>
                                                <td>{patient.condition}</td>
                                                <td>{patient.phone || patient.email || "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <UserRound size={28}/>
                                <p>No patients found{search ? " for that search" : ""}.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DoctorPatients;
