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
            const sql = `
                SELECT ps.id
                FROM pengelola_seleksis ps
                WHERE ps.user_id = ?
                    AND ps.seleksi_id = ?
                    AND ps.jabatan = 'pengawas'
                LIMIT 1
            `;
            console.log(sql,user.id, seleksiId);

            const [rows] = await conn.query(sql, [user.id, seleksiId]);

            if (rows.length === 0) {
                return res.status(403).json({
                    message: 'Anda tidak memiliki akses ke pengawas seleksi ini',
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
