import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CalendarCheck, Search, CheckCircle2, XCircle, Clock, Check } from "lucide-react";
import "../style/doctor-dash.css";
import "../style/hospitalpatients.css";
import DoctorNav from "../modules/DoctorNav";
import DoctorSide from "../modules/DoctorSide";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api/apiService";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/doctors/appointments`, {
        withCredentials: true,
      });
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("Error fetching appointments:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, action, newStatus) => {
    try {
      await axios.post(
        `${API_URL}/api/doctors/appointment/${action}`,
        { appointmentId: id },
        { withCredentials: true }
      );
      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === id ? { ...apt, status: newStatus } : apt
        )
      );
    } catch (error) {
      console.error(`Error ${action}:`, error.response?.data || error.message);
    }
  };

  const confirmAppointment = (id) => updateStatus(id, "confirm", "Confirmed");
  const cancelAppointment  = (id) => updateStatus(id, "cancel",  "Cancelled");
  const completeAppointment = (id) => updateStatus(id, "complete", "Completed");

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return appointments.filter(a => {
      if (filter !== "All" && a.status !== filter) return false;
      if (!q) return true;
      return (
        a.patientName?.toLowerCase().includes(q) ||
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
    <div className="doctor-dash-container">
      <div className="navbar-container">
        <DoctorNav />
      </div>
      <div className="doctor-dash-body">
        <div className="doctor-sidebar">
          <DoctorSide />
        </div>
        <main className="doctor-main">
          <div className="dashboard-header">
            <p className="dashboard-eyebrow">Schedule</p>
            <h1 className="dashboard-title">Appointments</h1>
            <p className="dashboard-subtitle">Confirm, complete or cancel patient requests.</p>
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
                  placeholder="Search patient or condition"
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
                      <th>Time</th>
                      <th>Status</th>
                      <th style={{textAlign: "right"}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((apt) => (
                      <tr key={apt._id}>
                        <td>
                          <div className="cell-name">
                            <span className="avatar"><Clock size={14}/></span>
                            {apt.patientName}
                          </div>
                        </td>
                        <td>{apt.condition || "—"}</td>
                        <td>{apt.time}</td>
                        <td>
                          <span className={`status-badge ${apt.status.toLowerCase()}`}>{apt.status}</span>
                        </td>
                        <td style={{textAlign: "right"}}>
                          {apt.status === "Pending" && (
                            <button onClick={() => confirmAppointment(apt._id)} className="row-btn confirm">
                              <CheckCircle2 size={14}/> Confirm
                            </button>
                          )}
                          {apt.status === "Confirmed" && (
                            <button onClick={() => completeAppointment(apt._id)} className="row-btn complete">
                              <Check size={14}/> Complete
                            </button>
                          )}
                          {apt.status !== "Cancelled" && apt.status !== "Completed" && (
                            <button onClick={() => cancelAppointment(apt._id)} className="row-btn cancel">
                              <XCircle size={14}/> Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <CalendarCheck size={28}/>
                <p>No appointments here yet.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorAppointments;
