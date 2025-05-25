import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { CalendarDays, Users, Clock } from "lucide-react";
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
  const navigate= useNavigate();
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
        
       if (response.data.role === "doctor") {
          navigate("/doctordash");
        }
      } catch (error) {
        
        navigate('/login')
      }
    };

    checkSession();
  }, []);
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
              <h2 className="section-title">Appointments for {date.toDateString()}</h2>
              {filteredAppointments.length > 0 ? (
                <div className="appointments-list">
                  {filteredAppointments.map((appt) => (
                    <div key={appt._id} className="appointment-item">
                      <div className="appointment-info">
                        <div className="appointment-icon-container">
                          <Clock className="appointment-icon" />
                        </div>
                        <div className="appointment-details">
                          <p className="doctor-name">{appt.patientName}</p>
                          <p className="department">{appt.department}</p>
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
                  <p className="empty-text">No appointments scheduled for this day</p>
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