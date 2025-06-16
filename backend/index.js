const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

require("dotenv").config();

const PORT = process.env.PORT || 4000;

// Enhanced CORS configuration
const corsOptions = {
    origin: [
        "http://localhost:3000", 
        "https://code-sync-part-1-1.onrender.com"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    exposedHeaders: ['set-cookie'],
    optionsSuccessStatus: 200 // For legacy browser support
};

// Apply CORS before other middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Connect to database
require("./config/database").connect();

// Route import and mount 
const user = require("./routes/user");
app.use("/api/v1/auth", user);

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "OK", 
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});

app.get("/", (req, res) => {
    res.send("<h1>Auth App</h1>");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});