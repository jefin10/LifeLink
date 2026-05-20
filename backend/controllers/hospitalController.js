const Hospital = require("../models/Hospital");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid'); 
const generateToken = (id) => {
    return jwt.sign({ id, role: "hospital" }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
const getAllHospitals = async (req,res) => {
  try {
    const hospitals = await Hospital.find(); 
    res.status(200).json({ hospitals });
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const registerHospital = async (req, res) => {
    try {
      const { name, email, password, address } = req.body;
  
      const existingHospital = await Hospital.findOne({ email });
      if (existingHospital) {
        return res.status(400).json({ message: "Hospital already registered" });
      }
  
      
      const newHospital = new Hospital({ name, email, password: password, address });
  
      await newHospital.save();
      res.status(201).json({ message: "Hospital registered successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  };
// Login Hospital
const loginHospital = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
      const hospital = await Hospital.findOne({ email });
      if (!hospital) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, hospital.password);
      if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      const sessionToken = uuidv4();
      hospital.sessionToken = sessionToken;
      await hospital.save();

      const secure = process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production";
      res.cookie("session_token", sessionToken, {
          httpOnly: true,
          secure,
          sameSite: "Lax",
          maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ message: "Login successful", role: "hospital", name: hospital.name });
  } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server error" });
  }
};


const returnHospitalId = async (req, res) => {
  try {
      const { session_token } = req.cookies;
      if (!session_token) {
          return res.status(401).json({ message: "No session found" });
      }
      const hospital = await Hospital.findOne({ sessionToken: session_token });
    

      // Fetch hospital details from the database
      if (!hospital) {
          return res.status(404).json({ message: "Hospital not found" });
      }

      res.json({ hospitalId: hospital._id, name: hospital.name });
  } catch (error) {
      console.error("Error fetching hospital:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};
const getHospitalData = async (req, res) => {
  console.log("hi")
  try {
    
      const hospital = await Hospital.findById(req.user._id);
      if (!hospital) {
          return res.status(404).json({ message: "Hospital not found" });
      }

      const totalDoctors = await Doctor.countDocuments({ hospital: hospital._id });
      const totalPatients = await Patient.countDocuments({ hospitalId: hospital._id });

      res.json({
          hospitalName: hospital.name,
          totalDoctors,
          totalPatients
      });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
};
const getPatientData = async (req, res) => {
  try {
    const { session_token } = req.cookies;
      if (!session_token) {
          return res.status(401).json({ message: "No session found" });
      }
      const hospital = await Hospital.findOne({ sessionToken: session_token });
    const patients = await Patient.find({ hospitalId:hospital._id }).populate("doctorId", "name");
    res.status(200).json({ patients });
  } catch (error) {
    res.status(500).json({ error: "Error fetching patients" });
  }
};



const getDoctorsByHospital = async (req, res) => {
  try {
    const { session_token } = req.cookies;
      if (!session_token) {
          return res.status(401).json({ message: "No session found" });
      }
      const hospital = await Hospital.findOne({ sessionToken: session_token });

    const doctors = await Doctor.find({ hospital: hospital._id });
    
    res.status(200).json({ doctors });
  } catch (error) {
    res.status(500).json({ error: "Error fetching doctors" });
  }
};



const addPatient = async (req, res) => {
    try {
        const { name, age, condition, doctorId, hospitalId } = req.body;
        
        if (!name || !age || !condition || !doctorId || !hospitalId) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newPatient = new Patient({ name, age, condition, doctorId, hospitalId });
        await newPatient.save();

        res.status(201).json({ message: "Patient added successfully", patient: newPatient });
    } catch (error) {
        res.status(500).json({ error: "Error adding patient" });
    }
};

module.exports = { getAllHospitals,returnHospitalId,registerHospital, loginHospital ,getHospitalData,getDoctorsByHospital,getPatientData,addPatient};
