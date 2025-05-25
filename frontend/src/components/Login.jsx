import React, { useState, useEffect } from "react";
import "../style/Login.css";
import i2 from "../Images/3.png";
import { useNavigate } from "react-router-dom";
import api, { loginUser } from "../api/apiService";

const Login = () => {
  const [email, setEmail] = useState("jefin@gmail.com");
  const [password, setPassword] = useState("jefin2123");
  const [role, setRole] = useState("doctor");
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get("/api/auth/check-cookies");
        
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
    try {
      const response = await loginUser(role, email, password);
      
      console.log("Response:", response.data);
      alert(response.data.message);
      
      if (response.data.role === "doctor") {
        navigate("/doctordash");
      } else if (response.data.role === "hospital") {
        navigate("/hospitaldash");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      alert("Login failed: " + (error.response?.data?.message || error.message));
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
            <div className="left-login-botton" onClick={() => navigate('/regd')}>Login</div>
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