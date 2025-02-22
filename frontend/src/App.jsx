import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import  Login from './components/Login';
import HospitalRegister from './components/HospitalRegister';
import DoctorRegister from './components/DoctorRegister';
import HospitalDash from './pages/HospitalDash';
import DoctorDash from './pages/DoctorDash';
import HospitalPatients from './pages/HospitalPatients';
import HospitalDoctors from './pages/HospitalDoctors';
import Appointment from './pages/Appointment';

const Layout = ({ children }) => {
  return (
    <>
      
      {children}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Layout>
            <Navbar/>
            <Home />
          </Layout>
        } />
        <Route path="/about" element={
          <Layout>
            <Navbar/>
            <About />
          </Layout>
        } />
        <Route path="/login" element={
          <Layout>
            <Navbar/>
            <Login/>
          </Layout>
        } />
        
        <Route path="*" element={
          <Layout>
            <div>404: Page not found!</div>
          </Layout>
        } />
        <Route path="/reg" element={
         
            <HospitalRegister/>
          
        } />
        <Route path="/regd" element={
         
         <DoctorRegister/>
       
     } />
     <Route path="/hospitaldash" element={
         
         <HospitalDash/>
       
     } />
     <Route path="/hospitaldash/patients" element={
         
         <HospitalPatients/>
       
     } />
     <Route path="/hospitaldash/doctors" element={
         
         <HospitalDoctors/>
       
     } />

     <Route path="/doctordash" element={
         
         <DoctorDash/>
       
     } />
     <Route path="/appointment" element={
         <Layout>
            <Navbar/>
         <Appointment/>
         </Layout>
       
     } />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;