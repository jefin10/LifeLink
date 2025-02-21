const express = require("express");




const { loginDoctor, logoutDoctor, authMiddleware ,registerDoctor, getHospitals} = require("../controllers/doctorController");

const router = express.Router();
router.get("/hospitals", getHospitals);
router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.post("/logout", logoutDoctor);
router.get("/protected", authMiddleware, (req, res) => {
    res.json({ message: `Welcome, Dr. ${req.user.name}` });
});
router.get("/hospitals", getHospitals); 

module.exports = router;
