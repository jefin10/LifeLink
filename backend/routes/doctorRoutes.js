const express = require("express");




const { loginDoctor, logoutDoctor, authMiddleware ,registerDoctor, getHospitals, getAppointments, getPatientCount, getPendingAppointments, getAllDoctors} = require("../controllers/doctorController");

const router = express.Router();
router.post('/getall',getAllDoctors)
router.get("/hospitals", getHospitals);
router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.post("/logout", logoutDoctor);
router.get("/protected", authMiddleware, (req, res) => {
    res.json({ message: `Welcome, Dr. ${req.user.name}` });
});
router.get("/hospitals", getHospitals); 
router.get("/appointments",getAppointments);
router.get('/patients/count',getPatientCount);
router.get('/appointments/pending',getPendingAppointments);
module.exports = router;
