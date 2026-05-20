const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
    date: { type: Date, required: true },
    reason: { type: String, trim: true },
    status: { type: String, enum: ["Pending", "Confirmed", "Cancelled", "Completed"], default: "Pending" }
}, { timestamps: true });

appointmentSchema.index({ doctor: 1, date: 1 });
appointmentSchema.index({ hospital: 1, date: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
