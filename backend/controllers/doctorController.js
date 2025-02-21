const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const bcrypt = require("bcryptjs");

const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, hospitalId } = req.body;

    // Check if hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(400).json({ message: "Hospital not found" });
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already registered" });
    }

    const newDoctor = new Doctor({ name, email, password: password, hospital: hospitalId });

    await newDoctor.save();
    res.status(201).json({ message: "Doctor registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Fetch all hospitals
const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({}, "name _id");
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const { v4: uuidv4 } = require('uuid'); 

const loginDoctor = async (req, res) => {
  const { email, password } = req.body;

  try {
      const doctor = await Doctor.findOne({ email });
      if (!doctor) {
          console.log("Doctor not found for email:", email);
          return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log("Comparing password for:", email);
      console.log("Input password:", password);
      console.log("Stored hash:", doctor.password);

      const isMatch = await bcrypt.compare(password, doctor.password);
      if (!isMatch) {
          console.log("Password did not match for", email);
          return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate session token
      const sessionToken = uuidv4();
      doctor.sessionToken = sessionToken;
      await doctor.save();

      // Set cookie
      res.cookie("session_token", sessionToken, {
          httpOnly: true,
          secure: false, // Use true in production with HTTPS
          maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.json({ message: "Login successful", role: "doctor" });
  } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server error" });
  }
};

// Logout Doctor
const logoutDoctor = async (req, res) => {
    try {
        res.clearCookie("session_token");
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Auth Middleware for Protected Routes
const authMiddleware = async (req, res, next) => {
    const { session_token } = req.cookies;
    if (!session_token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const doctor = await Doctor.findOne({ sessionToken: session_token });
    if (!doctor) {
        return res.status(401).json({ message: "Invalid session" });
    }

    req.user = doctor;
    next();
};

module.exports = { loginDoctor, logoutDoctor, authMiddleware,registerDoctor, getHospitals };

