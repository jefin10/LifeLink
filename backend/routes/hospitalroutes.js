const express = require("express");
const { registerHospital, loginHospital, getHospitalData, getPatientData, getDoctorsByHospital, addPatient, returnHospitalId, getAllHospitals, getHospitalAppointments } = require("../controllers/hospitalController");
const { authMiddleware } = require("../controllers/authController");
const router = express.Router();

// Public
router.post("/register", registerHospital);
router.post("/login", loginHospital);
router.get("/getall", getAllHospitals);

// Authenticated (hospital session)
router.get("/dashboard", authMiddleware, getHospitalData);
router.get("/patients", authMiddleware, getPatientData);
router.get("/doctors", authMiddleware, getDoctorsByHospital);
router.post("/addPatient", authMiddleware, addPatient);
router.get("/me", authMiddleware, returnHospitalId);
router.get("/appointments", authMiddleware, getHospitalAppointments);

module.exports = router;
