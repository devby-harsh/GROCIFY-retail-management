const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api', apiRoutes);

app.get('*', (req, res) => {
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ message: 'API endpoint not found' });
    }

    res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Running on http://localhost:${PORT}`);
});