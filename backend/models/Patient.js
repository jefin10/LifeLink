const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String }, // no unique constraint here
    age: { type: Number, required: true },
    condition: { type: String, required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true }
});

module.exports = mongoose.model("Patient", patientSchema);