import { useState } from "react";
import Calendar from "react-calendar";
import { CalendarDays, Users, Clock } from "lucide-react";
import "../style/doctor-dash.css"; // Our custom CSS file
import "../style/calender-styles.css"; // Your enhanced calendar styles
import DoctorNav from "../modules/DoctorNav";
import DoctorSide from "../modules/DoctorSide";
import "../style/scrollbar.css"; 
const appointmentsData = {
  "2025-02-20": [
    { time: "11:00 AM", name: "Dr. Smith", department: "Surgery", status: "Confirmed" },
    { time: "1:00 PM", name: "Dr. Jane", department: "Pediatrics", status: "Pending" },
    { time: "3:00 PM", name: "Dr. Lee", department: "Cardiology", status: "Confirmed" },
  ],
  "2025-02-21": [
    { time: "10:00 AM", name: "Dr. Adams", department: "Neurology", status: "Confirmed" },
    { time: "2:00 PM", name: "Dr. Emily", department: "Orthopedics", status: "Pending" },
  ],
};

const DoctorDash = () => {
  const [date, setDate] = useState(new Date());
  const formattedDate = date.toISOString().split("T")[0];
  const appointments = appointmentsData[formattedDate] || [];

  return (
    <div className="doctor-dash-container">
      <DoctorNav />

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
                <p className="stat-value">{appointments.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-container stat-icon-blue">
                <Users className="stat-icon" />
              </div>
              <div className="stat-text">
                <p className="stat-label">Total Patients</p>
                <p className="stat-value">1,248</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-container stat-icon-yellow">
                <Clock className="stat-icon" />
              </div>
              <div className="stat-text">
                <p className="stat-label">Pending Appointments</p>
                <p className="stat-value">8</p>
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
              {appointments.length > 0 ? (
                <div className="appointments-list">
                  {appointments.map((appt, idx) => (
                    <div key={idx} className="appointment-item">
                      <div className="appointment-info">
                        <div className="appointment-icon-container">
                          <Clock className="appointment-icon" />
                        </div>
                        <div className="appointment-details">
                          <p className="doctor-name">{appt.name}</p>
                          <p className="department">{appt.department}</p>
                        </div>
                      </div>
                      <div className="appointment-status">
                        <p className="appointment-time">{appt.time}</p>
                        <span
                          className={`status-badge ${
                            appt.status === "Confirmed" ? "confirmed" : "pending"
                          }`}
                        >
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
