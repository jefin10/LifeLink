const express = require("express");
const { registerHospital,loginHospital } = require("../controllers/hospitalController");

const router = express.Router();

router.post("/register", registerHospital);
router.post('/login', loginHospital);

module.exports = router;
