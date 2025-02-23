import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/doctor-dash.css";
import DoctorNav from "../modules/DoctorNav";
import DoctorSide from "../modules/DoctorSide";
import { useNavigate } from "react-router-dom";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/doctors/appointments", {
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

  const confirmAppointment = async (id) => {
    try {
        const response = await axios.post(
            "http://localhost:5000/api/doctors/appointment/confirm",
            { appointmentId: id },
            { withCredentials: true }
          );
      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === id ? { ...apt, status: "Confirmed" } : apt
        )
      );
    } catch (error) {
      console.error("Error confirming appointment:", error.response?.data || error.message);
    }
  };

  const removeAppointment = async (id) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/doctors/appointment/remove",
        { appointmentId: id },
        { withCredentials: true }
      );
  
      if (response.data.success) {
        setAppointments((prev) => prev.filter((apt) => apt._id !== id));
      }
    } catch (error) {
      console.error("Error removing appointment:", error.response?.data || error.message);
    }
  };
  

  return (
    <div className="doctor-dash-container">
      <DoctorNav />
      <div className="doctor-dash-body">
        <div className="doctor-sidebar">
          <DoctorSide />
        </div>
        <main className="doctor-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Appointments</h1>
            <p className="dashboard-subtitle">Your scheduled appointments</p>
          </div>
          <div className="appointments-container">
            {appointments.length > 0 ? (
              <table className="patients-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Department</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt._id}>
                      <td>{apt._id}</td>
                      <td>{apt.patientName}</td>
                      <td>{apt.department}</td>
                      <td>{apt.time}</td>
                      <td>{apt.status}</td>
                      <td>
                        {apt.status !== "Confirmed" && (
                          <button onClick={() => confirmAppointment(apt._id)}>
                            Confirm
                          </button>
                        )}
                        <button onClick={() => removeAppointment(apt._id)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No Appointments Found</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorAppointments;
