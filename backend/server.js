const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
require("dotenv").config();
const path = require('path'); // Add this

const app = express();

// Middleware
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:3000" , 'http://localhost:5174'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); 

connectDB();

// Routes
app.use('/api/hospital', require('./routes/hospitalRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
