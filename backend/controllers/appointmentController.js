const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");


const handleBook = async (req, res) => {
    try {
        const { date, time, doctorId, hospitalId, name, age, condition, phone, email, reason } = req.body;

        if (!date || !time || !doctorId || !hospitalId || !name || !age || !condition) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate refs exist
        const [doctor, hospital] = await Promise.all([
            Doctor.findById(doctorId),
            Hospital.findById(hospitalId),
        ]);
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });
        if (!hospital) return res.status(404).json({ message: "Hospital not found" });

        // Build a valid Date from "YYYY-MM-DD" + "HH:MM" (24h)
        const [hh, mm] = time.split(":");
        const paddedHour = String(hh).padStart(2, "0");
        const paddedMin = String(mm || "00").padStart(2, "0");
        const appointmentDateTime = new Date(`${date}T${paddedHour}:${paddedMin}:00`);

        if (Number.isNaN(appointmentDateTime.getTime())) {
            return res.status(400).json({ message: "Invalid date or time" });
        }
        if (appointmentDateTime.getTime() < Date.now()) {
            return res.status(400).json({ message: "Appointment must be in the future" });
        }

        // Match on (name + age + hospital) so two unrelated people with the
        // same first name in different hospitals don't collide.
        let patient = await Patient.findOne({
            name: name.trim(),
            age,
            hospitalId,
        });

        if (patient) {
            patient.doctorId = doctorId;
            patient.condition = condition;
            if (phone) patient.phone = phone;
            if (email) patient.email = email;
            await patient.save();
        } else {
            patient = await Patient.create({
                name: name.trim(),
                age,
                condition,
                phone,
                email,
                doctorId,
                hospitalId,
            });
        }

        const appointment = await Appointment.create({
            patient: patient._id,
            doctor: doctorId,
            hospital: hospitalId,
            date: appointmentDateTime,
            reason,
            status: "Pending",
        });

        res.status(201).json({
            message: "Appointment booked successfully",
            appointmentId: appointment._id,
            status: appointment.status,
        });
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({
            message: "Error booking appointment",
            error: error.message,
        });
    }
};

module.exports = { handleBook };
