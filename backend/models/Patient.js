const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }, 
});

module.exports = mongoose.model("Patient", patientSchema);
