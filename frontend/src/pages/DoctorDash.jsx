import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { CalendarDays, Users, Clock, CheckCircle2 } from "lucide-react";
import axios from "axios";
import "../style/doctor-dash.css";
import "../style/calender-styles.css";
import DoctorNav from "../modules/DoctorNav";
import DoctorSide from "../modules/DoctorSide";
import "../style/scrollbar.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api/apiService";

const DoctorDash = () => {
  const [date, setDate] = useState(new Date());
  const [allAppointments, setAllAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [pendingAppointments, setPendingAppointments] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/doctors/appointments`, {
          withCredentials: true,
        });
        setAllAppointments(response.data.appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    const fetchTotalPatients = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/doctors/patients/count`, {
          withCredentials: true,
        });
        setTotalPatients(response.data.patientCount);
      } catch (error) {
        console.error("Error fetching patient count:", error);
      }
    };

    const fetchPendingAppointments = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/doctors/appointments/pending`, {
          withCredentials: true,
        });
        setPendingAppointments(response.data.pendingAppointmentCount);
      } catch (error) {
        console.error("Error fetching pending appointments:", error);
      }
    };

    fetchAppointments();
    fetchTotalPatients();
    fetchPendingAppointments();
  }, []);

  useEffect(() => {
    const filterAppointmentsByDate = () => {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);

      const filtered = allAppointments.filter(appt => {
        const appointmentDate = new Date(appt.date);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate.getTime() === selectedDate.getTime();
      });

      setFilteredAppointments(filtered);
    };

    filterAppointmentsByDate();
  }, [date, allAppointments]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/check-cookies`, { withCredentials: true });
        if (response.data.role !== "doctor") {
          navigate("/login");
        }
      } catch (error) {
        navigate('/login');
      }
    };

    checkSession();
  }, [navigate]);

  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

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
            <p className="dashboard-eyebrow">Today, {today.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
            <h1 className="dashboard-title">Good to see you, doctor</h1>
            <p className="dashboard-subtitle">Here's what your day looks like.</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-container stat-icon-red">
                <CalendarDays className="stat-icon" />
              </div>
              <div className="stat-text">
                <p className="stat-label">Today's Appointments</p>
                <p className="stat-value">{filteredAppointments.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-container stat-icon-blue">
                <Users className="stat-icon" />
              </div>
              <div className="stat-text">
                <p className="stat-label">Total Patients</p>
                <p className="stat-value">{totalPatients}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-container stat-icon-yellow">
                <Clock className="stat-icon" />
              </div>
              <div className="stat-text">
                <p className="stat-label">Pending Appointments</p>
                <p className="stat-value">{pendingAppointments}</p>
              </div>
            </div>
          </div>

          <div className="calendar-appointments-grid">
            <section className="calendar-card">
              <h2 className="section-title">Calendar</h2>
              <Calendar onChange={setDate} value={date} className="react-calendar" />
            </section>
            <section className="appointments-card">
              <div className="appointments-card-header">
                <div>
                  <h2 className="section-title">
                    {isToday ? "Today's appointments" : `Appointments for ${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`}
                  </h2>
                  <p className="section-sub">{filteredAppointments.length} scheduled</p>
                </div>
              </div>
              {filteredAppointments.length > 0 ? (
                <div className="appointments-list">
                  {filteredAppointments.map((appt) => (
                    <div key={appt._id} className="appointment-item">
                      <div className="appointment-info">
                        <div className="appointment-icon-container">
                          {appt.status === "Confirmed" ? <CheckCircle2 className="appointment-icon" /> : <Clock className="appointment-icon" />}
                        </div>
                        <div className="appointment-details">
                          <p className="doctor-name">{appt.patientName}</p>
                          <p className="department">{appt.condition || appt.department}</p>
                        </div>
                      </div>
                      <div className="appointment-status">
                        <p className="appointment-time">{appt.time}</p>
                        <span className={`status-badge ${appt.status.toLowerCase()}`}>
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-appointments">
                  <Clock className="empty-icon" />
                  <p className="empty-text">No appointments scheduled for this day.</p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDash;
