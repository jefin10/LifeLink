import React from 'react'
import logo from "../Images/logo.png";
import "../style/hospital.css"

const HospitalDash = () => {
  return (
    <>
    <header>
        <div className="logo-container">
            <img src={logo} style={{ height: "20px" }} alt="LifeLink Logo"/>
            <h2 className="brand-name">LifeLink</h2>
        </div>
        
        <nav className="nav-links">
            <a href="/home" className="nav-link">Home</a>
            <a href="/about" className="nav-link">About</a>
            <a href="/contact" className="nav-link">Contact</a>
        </nav>
        <div className="header-actions">
            <button className="icon-button">
                <a href="/profile/Hospital/{{id}}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"/>
                </svg>
                </a>
            </button>
        </div>
        
    </header>

    <div className="main-container">
        <aside className="sidebar">
            <a href="#" className="sidebar-link active">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"/>
                </svg>
                Dashboard
            </a>
            <a href="/hospital_doctors/{{id}}" className="sidebar-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path
                          d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z"
                        ></path>               
                </svg>
                Doctors
            </a>
            
            <a href="/hospital_patients/{{id}}" className="sidebar-link ">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path
                          d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"
                        ></path>              
                </svg>
                Patients
            </a>
        </aside>

        <main className="main-content">
            <div className="dashboard-header">
                <h1 className="dashboard-title"> Hospital</h1>
                <p className="dashboard-subtitle">Welcome to LifeLink</p>
            </div>

            <div className="stats-container">
                <div className="stat-card">
                    <p className="stat-label">Total Patients</p>
                    <p className="stat-value"></p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Total Doctors</p>
                    <p className="stat-value"></p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Available Organs</p>
                    <p className="stat-value"></p>
                </div>
            </div>

            <div className="action-card">
                <p className="action-title">Add New Organ</p>
                <button className="action-button">New Organ</button>
            </div>

            <div className="action-card">
                <p className="action-title">Add New Patient</p>
                <a href="/patient_add/Hospital/{{id}}">
                    <button className="action-button">New Patient</button>
                </a>
            </div>
        </main>
    </div>
    </>
  )
}

export default HospitalDash
