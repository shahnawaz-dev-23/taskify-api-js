const express = require('express');
const app = express();
const connectDB = require('./config/database');

// Connect MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/v1', userRoutes);

module.exports = app;