import React, { useState,useEffect } from "react";
import axios from "axios";
import "../style/Login.css";
import i2 from "../Images/3.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor");
  const navigate = useNavigate();
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/check-cookies", { withCredentials: true });
        
        if (response.data.role === "doctor") {
          navigate("/doctordash");
        } else if (response.data.role === "hospital") {
          navigate("/hospitaldash");
        }
      } catch (error) {
        console.log("No active session found");
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async () => {
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Role:", role);
    try {
      let response;
      if(role == "doctor"){
        response = await axios.post(
          "http://localhost:5000/api/doctors/login",
          { email, password, role },
          { withCredentials: true }
        );
      }else{
        response = await axios.post(
          "http://localhost:5000/api/hospital/login",
          { email, password, role },
          { withCredentials: true }
        );
      }
      
      console.log("Response:", response.data);
      alert(response.data.message, response.data.role);
      if (response.data.role === "doctor") {
        navigate("/doctordash");
      } else if (response.data.role === "hospital") {
        navigate("/hospitaldash");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(
        "Login Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="container">
      <div className="left-section">
        <div className="left-text">
          <div className="left-big-title">
            Connecting Patients, Doctors, and Hospitals
          </div>
          <div className="left-login">
            Already have an account?{" "}
            <div className="left-login-botton">Login</div>
          </div>
        </div>
        <div className="left-image">
          <img src={i2} alt="Healthcare illustration" />
        </div>
      </div>
      <div className="right-section">
        <div className="login-box">
          <h1>Login</h1>
          <div>
            <div className="role-selector">
              <p>Select your role:</p>
              <div className="role-options">
                <label className={`role-option ${role === "doctor" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="doctor"
                    checked={role === "doctor"}
                    onChange={() => setRole("doctor")}
                  />
                  Doctor
                </label>
                <label className={`role-option ${role === "hospital" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="hospital"
                    checked={role === "hospital"}
                    onChange={() => setRole("hospital")}
                  />
                  Hospital
                </label>
              </div>
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;