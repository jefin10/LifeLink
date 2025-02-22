const express = require("express");
const { checkCookies } = require("../controllers/authController");
const {logout} = require("../controllers/authController")
const router = express.Router();
router.get('/check-cookies',checkCookies);
router.post('/logout',logout);
module.exports = router;