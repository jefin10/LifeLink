import React, { useState, useEffect } from "react";
import "../style/Login.css";
import i2 from "../Images/3.png";
import { useNavigate } from "react-router-dom";
import api, { loginUser } from "../api/apiService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
        // no active session — stay on login
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e?.preventDefault?.();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser(role, email, password);

      if (response.data.role === "doctor") {
        navigate("/doctordash");
      } else if (response.data.role === "hospital") {
        navigate("/hospitaldash");
      } else {
        navigate("/");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
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
            Don't have an account?{" "}
            <span className="left-login-botton" onClick={() => navigate("/regd")}>Register</span>
          </div>
        </div>
        <div className="left-image">
          <img src={i2} alt="Healthcare illustration" />
        </div>
      </div>
      <div className="right-section">
        <form className="login-box" onSubmit={handleLogin}>
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
              autoComplete="email"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            {error && <div className="login-error">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
