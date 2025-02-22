const express = require("express");
const { registerHospital,loginHospital,getHospitalData, getPatientData, getDoctorsByHospital, addPatient, returnHospitalId, getAllHospitals } = require("../controllers/hospitalController");
const { authMiddleware } = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerHospital);
router.post('/login', loginHospital);
router.get("/dashboard", authMiddleware, getHospitalData);

router.get('/patients',getPatientData);
router.get('/doctors', getDoctorsByHospital);
router.post('/addPatient',addPatient);
router.get("/me", returnHospitalId);

router.get('/getall',getAllHospitals);
module.exports = router;
