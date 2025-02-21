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

module.exports = { registerUser, loginUser };
