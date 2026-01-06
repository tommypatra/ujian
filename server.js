require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// test endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Server ujian jalan' });
});

// 404 handler (WAJIB PALING BAWAH)
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        data: null
    });
});

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
