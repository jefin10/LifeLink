const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");



const handleBook = async (req, res) => {
    try {
        const { date, time, doctorId, hospitalId, name, age, condition } = req.body;

        if (!date || !time || !doctorId || !doctorId || !name || !age || !condition) {
            return res.status(400).json({ message: "All fields are fkn required" });
        }

        // Convert date and time string to Date object
        const formatTime = (timeStr) => {
            const [hour, minute] = timeStr.split(":");
            const paddedHour = hour.length === 1 ? "0" + hour : hour;
            return `${paddedHour}:${minute}`;
          };
      
          // Construct a valid ISO date string
        const appointmentDateTime = new Date(`${date}T${formatTime(time)}`);

        // Find if patient exists based on name and age
        let patient = await Patient.findOne({ 
            name: name,
            age: age
        });

        if (patient) {
            // If patient exists but seeing a different doctor, update the doctorId
            if (patient.doctorId.toString() !== doctorId) {
                patient.doctorId = doctorId;
                patient.hospitalId = hospitalId;
                patient.condition = condition; // Update condition as it might have changed
                await patient.save();
            }
        } else {
            patient = await Patient.create({
                name,
                age,
                condition,
                doctorId: doctorId,
                hospitalId: hospitalId
            });
        }

        const appointment = await Appointment.create({
            patient: patient._id,
            doctor: doctorId,
            hospital: hospitalId,
            date: appointmentDateTime,
            status: "Pending"
        });

        res.status(201).json({
            message: "Appointment booked successfully",
            appointmentId: appointment._id,
            status: appointment.status
        });

    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ 
            message: "Error booking appointment",
            error: error.message 
        });
    }
};

module.exports = { handleBook };