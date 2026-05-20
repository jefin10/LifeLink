import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, CalendarCheck, UserRound } from "lucide-react";
import "../style/hospitalpatients.css";
import HospitalNavbar from "../modules/HospitalNavbar";
import HospitalSidebar from "../modules/HospitalSidebar";
import { API_URL } from "../api/apiService";

const HospitalAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/hospital/appointments`, {
                    withCredentials: true,
                });
                setAppointments(response.data.appointments || []);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };
        fetchAppointments();
    }, []);

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        return appointments.filter(a => {
            if (filter !== "All" && a.status !== filter) return false;
            if (!q) return true;
            return (
                a.patientName?.toLowerCase().includes(q) ||
                a.doctorName?.toLowerCase().includes(q) ||
                a.condition?.toLowerCase().includes(q)
            );
        });
    }, [appointments, search, filter]);

    const counts = useMemo(() => ({
        All: appointments.length,
        Pending: appointments.filter(a => a.status === "Pending").length,
        Confirmed: appointments.filter(a => a.status === "Confirmed").length,
        Completed: appointments.filter(a => a.status === "Completed").length,
    }), [appointments]);

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
                            <p className="dashboard-eyebrow">Schedule</p>
                            <h1 className="dashboard-title">Appointments</h1>
                            <p className="dashboard-subtitle">Every appointment across the hospital.</p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-toolbar">
                            <div className="tab-row">
                                {["All", "Pending", "Confirmed", "Completed"].map(tab => (
                                    <button
                                        key={tab}
                                        className={`tab ${filter === tab ? "active" : ""}`}
                                        onClick={() => setFilter(tab)}
                                    >
                                        {tab} <span className="tab-count">{counts[tab]}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="search-wrap">
                                <Search size={14} />
                                <input
                                    placeholder="Search patient, doctor, condition"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {visible.length > 0 ? (
                            <div className="table-scroll">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Patient</th>
                                            <th>Condition</th>
                                            <th>Doctor</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visible.map((a) => (
                                            <tr key={a._id}>
                                                <td>
                                                    <div className="cell-name">
                                                        <span className="avatar"><UserRound size={14}/></span>
                                                        {a.patientName}
                                                    </div>
                                                </td>
                                                <td>{a.condition}</td>
                                                <td>Dr. {a.doctorName}{a.doctorSpec ? ` (${a.doctorSpec})` : ""}</td>
                                                <td>{new Date(a.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })} · {a.time}</td>
                                                <td><span className={`status-badge ${a.status.toLowerCase()}`}>{a.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <CalendarCheck size={28}/>
                                <p>No appointments yet.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default HospitalAppointments;
