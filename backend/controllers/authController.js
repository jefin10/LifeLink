const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};
const registerUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        let user;
        if (role === "hospital") {
            user = new Hospital({ name, email, password, address });
        } else if (role === "doctor") {
            user = new Doctor({ name, email, password });
        } else if (role === "patient") {
            user = new Patient({ name, email, password });
        } else {
            return res.status(400).json({ message: "Invalid role" });
        }

        await user.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        let user;
        if (role === "hospital") {
            user = await Hospital.findOne({ email });
        } else if (role === "doctor") {
            user = await Doctor.findOne({ email });
        } else if (role === "patient") {
            user = await Patient.findOne({ email });
        } else {
            return res.status(400).json({ message: "Invalid role" });
        }

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(user);
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const checkCookies = async (req, res) => {
    try {
      const { session_token } = req.cookies;
      console.log(session_token);
      if (!session_token) {
        return res.status(401).json({ message: "No session found" });
      }
  
      const doctor = await Doctor.findOne({ sessionToken: session_token });
      if (doctor) {
        return res.json({ role: "doctor" });
      }
  
      const hospital = await Hospital.findOne({ sessionToken: session_token });
      if (hospital) {
        return res.json({ role: "hospital" });
      }
  
      return res.status(401).json({ message: "Invalid session" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  const authMiddleware = async (req, res, next) => {
    try {
        console.log("Cookies received:", req.cookies); // Debugging

        const { session_token } = req.cookies;
        if (!session_token) {
            return res.status(401).json({ message: "Unauthorized: No session token" });
        }
        console.log("going to next");
        let user = await Hospital.findOne({ sessionToken: session_token });

        if (!user) {
            user = await Doctor.findOne({ sessionToken: session_token });
            if (!user) {
                return res.status(401).json({ message: "Unauthorized: Invalid session" });
            }
        }

        req.user = user;
        console.log("going to necxt");
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const logout = async (req, res) => {
    try {
        const { session_token } = req.cookies;
        if (!session_token) {
            return res.status(401).json({ message: "No active session" });
        }
        const doctor = await Doctor.findOne({ sessionToken: session_token });
        const hospital = await Hospital.findOne({ sessionToken: session_token });

        if (doctor) {
            doctor.sessionToken = null;
            await doctor.save();
        } else if (hospital) {
            hospital.sessionToken = null;
            await hospital.save();
        } else {
            return res.status(401).json({ message: "Invalid session" });
        }
        res.clearCookie("session_token", {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
        });

        return res.json({ message: "Logged out successfully" });

    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = { registerUser, loginUser,checkCookies ,logout,authMiddleware};
