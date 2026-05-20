const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const hospitalSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    address: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    sessionToken: { type: String, index: true, sparse: true },
}, { timestamps: true });

// Hash password before saving
hospitalSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model("Hospital", hospitalSchema);
