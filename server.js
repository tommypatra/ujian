require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === AKTIFKAN CORS ===
app.use(cors({
    origin: '*',          // sementara (dev)
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','Authorization','X-Form-Submit']
}));

// routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// test endpoint
app.get('/', (req, res) => {
    // res.json({ message: 'Server ujian jalan' });
    res.type('html').send('<h1>API Ujian Running</h1>');
});

// 404 handler (WAJIB PALING BAWAH)
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        data: null
    });
});

const PORT = process.env.PORT || process.env.APP_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});