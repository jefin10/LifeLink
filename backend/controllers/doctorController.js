const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const Patient = require("../models/Patient");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, hospitalId, specialization } = req.body;

    if (!name || !email || !password || !hospitalId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(400).json({ message: "Hospital not found" });
    }

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already registered" });
    }

    const newDoctor = new Doctor({ name, email, password, hospital: hospitalId, specialization });

    await newDoctor.save();
    res.status(201).json({ success: true, message: "Doctor registered successfully!" });
  } catch (error) {
    console.error("Register doctor error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const { hospitalId } = req.body;
    if (!hospitalId) {
      return res.status(400).json({ message: "Hospital ID is required" });
    }

    const doctors = await Doctor.find({ hospital: hospitalId }).select("name specialization email");
    res.json({ doctors });
  } catch (e) {
    console.error("getAllDoctors error:", e);
    res.status(500).json({ message: "Error fetching doctors" });
  }
};

const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({}, "name _id address");
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const loginDoctor = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const sessionToken = uuidv4();
    doctor.sessionToken = sessionToken;
    await doctor.save();

    const secure = process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production";
    res.cookie("session_token", sessionToken, {
      httpOnly: true,
      secure,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful", role: "doctor", name: doctor.name });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const logoutDoctor = async (req, res) => {
  try {
    const { session_token } = req.cookies;
    if (session_token) {
      await Doctor.updateOne({ sessionToken: session_token }, { $unset: { sessionToken: "" } });
    }
    const secure = process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production";
    res.clearCookie("session_token", { httpOnly: true, secure, sameSite: "Lax" });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate("patient", "name age condition phone email")
      .populate("hospital", "name address")
      .sort({ date: 1 });

    const formattedAppointments = appointments.map(apt => ({
      _id: apt._id,
      patientName: apt.patient?.name || "Unknown",
      department: apt.hospital?.name || "—",
      time: new Date(apt.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: apt.date,
      status: apt.status,
      age: apt.patient?.age,
      condition: apt.patient?.condition,
      reason: apt.reason || "",
    }));

    res.json({ success: true, appointments: formattedAppointments });
  } catch (e) {
    console.error("Error fetching appointments:", e);
    res.status(500).json({ message: "Error fetching appointments" });
  }
};

const getPatientCount = async (req, res) => {
  try {
    const patientCount = await Patient.countDocuments({ doctorId: req.user._id });
    res.json({ success: true, patientCount });
  } catch (e) {
    console.error("getPatientCount error:", e);
    res.status(500).json({ success: false, message: "Error fetching patient count" });
  }
};

const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ doctorId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, patients });
  } catch (e) {
    console.error("Error fetching patients:", e);
    res.status(500).json({ success: false, message: "Error fetching patients" });
  }
};

const getPendingAppointments = async (req, res) => {
  try {
    const pendingAppointmentCount = await Appointment.countDocuments({
      doctor: req.user._id,
      status: "Pending",
    });
    res.json({ success: true, pendingAppointmentCount });
  } catch (e) {
    console.error("getPendingAppointments error:", e);
    res.status(500).json({ success: false, message: "Error fetching pending appointments" });
  }
};

const confirmAppointments = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: "Appointment ID is required" });
    }

    const updatedAppointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, doctor: req.user._id },
      { status: "Confirmed" },
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.json({ success: true, message: "Appointment confirmed", appointment: updatedAppointment });
  } catch (e) {
    console.error("Error confirming appointment:", e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const removeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: "Appointment ID is required" });
    }

    const deletedAppointment = await Appointment.findOneAndDelete({
      _id: appointmentId,
      doctor: req.user._id,
    });

    if (!deletedAppointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.json({ success: true, message: "Appointment removed successfully" });
  } catch (error) {
    console.error("Error removing appointment:", error);
    res.status(500).json({ success: false, message: "Error removing appointment" });
  }
};


module.exports = {
  confirmAppointments,
  removeAppointment,
  getPatients,
  loginDoctor,
  getAllDoctors,
  getAppointments,
  getPatientCount,
  getPendingAppointments,
  logoutDoctor,
  registerDoctor,
  getHospitals,
};
