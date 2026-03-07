const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api', apiRoutes);

// Root route - serve frontend index.html for any other route
app.get('*', (req, res) => {
    // If it's an API route that didn't match anything, return 404
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ message: 'API endpoint not found' });
    }
    // Otherwise serve the frontend index.html
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`--------------------------------------------------`);
    console.log(`🛒 GROCIFY: Grocery Management System is online!`);
    console.log(`--------------------------------------------------`);
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`📁 Frontend served from: ${path.join(__dirname, '../frontend')}`);
    console.log(`--------------------------------------------------`);
});
