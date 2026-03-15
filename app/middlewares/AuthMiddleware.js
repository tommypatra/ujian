const jwt = require('jsonwebtoken');
const db = require('../../config/database');

module.exports = async function auth(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Token tidak ditemukan'
        });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Token tidak valid'
        });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // cek jika peserta
        if (decoded.roles && decoded.roles.includes('peserta')) {

            const conn = await db.getConnection();
            try {

                const [rows] = await conn.query(
                    `SELECT token_login FROM pesertas WHERE id = ? LIMIT 1`,
                    [decoded.id]
                );

                if (!rows.length) {
                    return res.status(401).json({
                        message: 'Peserta tidak ditemukan'
                    });
                }

                if (rows[0].token_login !== token) {
                    return res.status(401).json({
                        message: 'Sesi login sudah tidak valid'
                    });
                }

            } finally {
                conn.release();
            }
        }

        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({
            message: 'Token tidak valid atau kadaluarsa'
        });
    }
};