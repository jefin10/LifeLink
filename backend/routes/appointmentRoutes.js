const express = require("express");
const { handleBook } = require("../controllers/appointmentController");
const router = express.Router();



router.post('/book',handleBook);
module.exports=router;
