const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

const validateUser = async (req,res) => {
    const {session_token} = req.cookies;
    if (!session_token) {
            return res.status(401).json({ message: "No session found" });
          }
      
          const doctor = await Doctor.findOne({ sessionToken: session_token });
    if (doctor) {
            return res.json({ role: "doctor" });
          }
      
          const hospital = await Hospital.findOne({ sessionToken: session_token });
     if (hospital) {
            return res.json({ role: "hospital" });
        }
        return res.status(401).json({ message: "No session found" });
}
module.exports = validateUser;
