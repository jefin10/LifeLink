const Hospital = require("../models/Hospital");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({}, "name address _id");
    res.status(200).json({ hospitals });
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const registerHospital = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    if (!name || !email || !password || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingHospital = await Hospital.findOne({ email });
    if (existingHospital) {
      return res.status(400).json({ message: "Hospital already registered" });
    }

    const newHospital = new Hospital({ name, email, password, address, phone });

    await newHospital.save();
    res.status(201).json({ success: true, message: "Hospital registered successfully!" });
  } catch (error) {
    console.error("Register hospital error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

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
  res.json({ hospitalId: req.user._id, name: req.user.name });
};

const getHospitalData = async (req, res) => {
  try {
    const hospital = req.user;
    const totalDoctors = await Doctor.countDocuments({ hospital: hospital._id });
    const totalPatients = await Patient.countDocuments({ hospitalId: hospital._id });
    const totalAppointments = await require("../models/Appointment").countDocuments({ hospital: hospital._id });

    res.json({
      hospitalName: hospital.name,
      address: hospital.address,
      totalDoctors,
      totalPatients,
      totalAppointments,
    });
  } catch (error) {
    console.error("getHospitalData error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPatientData = async (req, res) => {
  try {
    const patients = await Patient.find({ hospitalId: req.user._id })
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });
    res.status(200).json({ patients });
  } catch (error) {
    console.error("getPatientData error:", error);
    res.status(500).json({ error: "Error fetching patients" });
  }
};

const getDoctorsByHospital = async (req, res) => {
  try {
    const doctors = await Doctor.find({ hospital: req.user._id }).select("name email specialization createdAt");
    res.status(200).json({ doctors });
  } catch (error) {
    console.error("getDoctorsByHospital error:", error);
    res.status(500).json({ error: "Error fetching doctors" });
  }
};

const getHospitalAppointments = async (req, res) => {
  try {
    const Appointment = require("../models/Appointment");
    const appointments = await Appointment.find({ hospital: req.user._id })
      .populate("patient", "name age condition phone")
      .populate("doctor", "name specialization")
      .sort({ date: -1 });

    const formatted = appointments.map(apt => ({
      _id: apt._id,
      patientName: apt.patient?.name || "Unknown",
      patientAge: apt.patient?.age,
      condition: apt.patient?.condition || "—",
      doctorName: apt.doctor?.name || "Unknown",
      doctorSpec: apt.doctor?.specialization || "",
      date: apt.date,
      time: new Date(apt.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: apt.status,
    }));

    res.json({ success: true, appointments: formatted });
  } catch (error) {
    console.error("getHospitalAppointments error:", error);
    res.status(500).json({ message: "Error fetching appointments" });
  }
};

const addPatient = async (req, res) => {
  try {
    const { name, age, condition, doctorId, phone, email } = req.body;

    if (!name || !age || !condition || !doctorId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newPatient = new Patient({
      name,
      age,
      condition,
      doctorId,
      phone,
      email,
      hospitalId: req.user._id,
    });
    await newPatient.save();

    res.status(201).json({ message: "Patient added successfully", patient: newPatient });
  } catch (error) {
    console.error("addPatient error:", error);
    res.status(500).json({ error: "Error adding patient" });
  }
};

module.exports = {
  getAllHospitals,
  returnHospitalId,
  registerHospital,
  loginHospital,
  getHospitalData,
  getDoctorsByHospital,
  getPatientData,
  addPatient,
  getHospitalAppointments,
};
