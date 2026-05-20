const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    age: { type: Number, required: true, min: 0, max: 150 },
    condition: { type: String, required: true, trim: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);
