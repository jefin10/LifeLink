const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    specialization: { type: String, trim: true, default: "General Physician" },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
    sessionToken: { type: String, index: true, sparse: true },
}, { timestamps: true });

doctorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model("Doctor", doctorSchema);
