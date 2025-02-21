const Hospital = require('../models/Hospital');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id, role: "hospital" }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register Hospital
const registerHospital = async (req, res) => {
    try {
      const { name, email, password, address } = req.body;
  
      const existingHospital = await Hospital.findOne({ email });
      if (existingHospital) {
        return res.status(400).json({ message: "Hospital already registered" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newHospital = new Hospital({ name, email, password: hashedPassword, address });
  
      await newHospital.save();
      res.status(201).json({ message: "Hospital registered successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  };
// Login Hospital
const loginHospital = async (req, res) => {
  const { email, password } = req.body;

  try {
      const hospital = await Hospital.findOne({ email });
      if (!hospital) {
          console.log("Hospital not found for email:", email);
          return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log("Comparing password for:", email);
      console.log("Input password:", password);
      console.log("Stored hash:", hospital.password);

      const isMatch = await bcrypt.compare(password, hospital.password);
      if (!isMatch) {
          console.log("Password did not match for", email);
          return res.status(401).json({ message: "Invalid credentials" });
      }

      const sessionToken = uuidv4();
      hospital.sessionToken = sessionToken;
      await hospital.save();

      res.cookie("session_token", sessionToken, {
          httpOnly: true,
          secure: false, 
          maxAge: 24 * 60 * 60 * 1000, 
      });

      res.json({ message: "Login successful", role: "hospital" });
  } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server error" });
  }
};


module.exports = { registerHospital, loginHospital };
