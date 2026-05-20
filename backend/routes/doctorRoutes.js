const express = require("express");

const {
    loginDoctor,
    logoutDoctor,
    registerDoctor,
    getHospitals,
    getAppointments,
    getPatientCount,
    getPendingAppointments,
    getAllDoctors,
    getPatients,
    confirmAppointments,
    removeAppointment,
    cancelAppointment,
    completeAppointment,
} = require("../controllers/doctorController");
const { authMiddleware } = require("../controllers/authController");

const router = express.Router();

// Public
router.post("/getall", getAllDoctors);
router.get("/hospitals", getHospitals);
router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.post("/logout", logoutDoctor);

// Authenticated (doctor session)
router.get("/protected", authMiddleware, (req, res) => {
    res.json({ message: `Welcome, Dr. ${req.user.name}` });
});
router.get("/patients", authMiddleware, getPatients);
router.get("/appointments", authMiddleware, getAppointments);
router.get("/patients/count", authMiddleware, getPatientCount);
router.get("/appointments/pending", authMiddleware, getPendingAppointments);
router.post("/appointment/confirm", authMiddleware, confirmAppointments);
router.post("/appointment/cancel", authMiddleware, cancelAppointment);
router.post("/appointment/complete", authMiddleware, completeAppointment);
router.post("/appointment/remove", authMiddleware, removeAppointment);

module.exports = router;
