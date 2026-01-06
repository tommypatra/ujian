const db = require('../../config/database');

module.exports = async function PesertaSeleksiMiddleware(req, res, next) {
    try {
        const user = req.user; // dari AuthMiddleware
        const peserta_seleksi_id = parseInt(req.params.peserta_seleksi_id);

        if (!req.user.roles.includes('peserta')) {
            return res.status(403).json({
                message: 'Akses khusus peserta'
            });
        }

        if (!peserta_seleksi_id || isNaN(peserta_seleksi_id)) {
            return res.status(400).json({
                message: 'Parameter peserta_seleksi_id tidak valid',
                data: null
            });
        }

        const conn = await db.getConnection();
        try {
            const [rows] = await conn.query(`
                    SELECT p.id FROM pesertas p
                    LEFT JOIN peserta_seleksis ps ON p.id=ps.peserta_id
                    WHERE p.id = ? AND ps.id = ? LIMIT 1
                `, [user.id, peserta_seleksi_id]
            );

            // console.log(user.id,' ',peserta_seleksi_id)

            if (rows.length === 0) {
                return res.status(403).json({
                    message: 'Anda tidak memiliki akses ke seleksi ini',
                    data: null
                });
            }

            return next();
        } finally {
            conn.release();
        }

    } catch (err) {
        console.error('middleware error:', err);
        return res.status(500).json({
            message: 'Internal server error',
            data: null
        });
    }
};
