const db = require('../../config/database');

module.exports = async function PengawasUjianMiddleware(req, res, next) {
    try {
        const user = req.user; // dari AuthMiddleware
        const seleksiId = parseInt(req.params.seleksi_id);

        if (!seleksiId || isNaN(seleksiId)) {
            return res.status(400).json({
                message: 'Parameter seleksi_id tidak valid',
                data: null
            });
        }

        // admin bebas
        if (user.roles.includes('admin')) {
            return next();
        }

        const conn = await db.getConnection();
        try {
            const [rows] = await conn.query(`
                SELECT ps.id
                FROM pengawas_seleksis ps
                INNER JOIN jadwal_seleksis js ON js.id = ps.jadwal_seleksi_id 
                WHERE ps.id = ?
                    AND js.seleksi_id = ?
                LIMIT 1
            `, [user.id, seleksiId]);

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
