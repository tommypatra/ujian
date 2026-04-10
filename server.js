require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');

// 🔥 WS
const { initWebSocket } = require('./ws');

// =====================
// INIT APP
// =====================
const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Form-Submit']
}));

// HANDLE PREFLIGHT
app.options('*', cors());

// =====================
// ROUTES
// =====================
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// =====================
// TEST ENDPOINT
// =====================
app.get('/', (req, res) => {
    res.type('html').send('<h1>API Ujian Running 🚀</h1>');
});

// =====================
// 404 HANDLER (WAJIB PALING BAWAH)
// =====================
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        data: null
    });
});

// =====================
// CREATE SERVER (WAJIB UNTUK WS)
// =====================
const PORT = process.env.PORT || process.env.APP_PORT || 3000;

const server = http.createServer(app);

// =====================
// INIT WEBSOCKET
// =====================
initWebSocket(server);

// =====================
// START SERVER
// =====================
server.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});