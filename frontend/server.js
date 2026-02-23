const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_PORT = process.env.BACKEND_PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Frontend server is running' });
});

// Start server with auto port detection
const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log('============================================================');
        console.log('  SportsVerse AI v2.0 Frontend Server');
        console.log('============================================================');
        console.log(`  Server running on: http://localhost:${port}`);
        console.log(`  Backend API at: http://localhost:${BACKEND_PORT}`);
        console.log('============================================================');
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is busy, trying ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });
};

startServer(PORT);
