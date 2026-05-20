const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
require("dotenv").config();
const path = require('path');

const app = express();

// Middleware
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:3000,http://localhost:5174")
    .split(",")
    .map(o => o.trim())
    .filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        // allow same-origin / curl / SSR (no origin) and any whitelisted origin
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

connectDB();

// Routes
app.use('/api/hospital', require('./routes/hospitalroutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
