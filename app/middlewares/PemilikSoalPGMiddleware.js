const db = require('../../config/database');

module.exports = async function PemilikSoalPGMiddleware(req, res, next) {
    try {
        const user_id = req.user.id; 
        const seleksi_id = req.params.seleksi_id; 
        const bank_soal_id = req.params.bank_soal_id; 
        

        if (!req.user.roles.includes('pembuat-soal')) {
            return res.status(403).json({
                message: 'Akses khusus pembuat soal'
            });
        }

        const conn = await db.getConnection();
        try {
            const [rows] = await conn.query(`
                SELECT 1 FROM pengelola_seleksis ps
                JOIN soal_seleksis ss 
                    ON ss.seleksi_id = ps.seleksi_id
                JOIN bank_soals bs 
                    ON bs.id = ss.bank_soal_id
                    AND bs.pembuat_user_id = ps.user_id
                JOIN jenis_soals js 
                    ON js.id = bs.jenis_soal_id
                WHERE 
                    ps.jabatan = 'pembuat-soal' AND 
                    ps.seleksi_id = ? AND 
                    ps.user_id = ? AND 
                    bs.id = ? AND
                    js.kode = 'PG'
                LIMIT 1
                `, [seleksi_id, user_id, bank_soal_id]);

            if (rows.length === 0) {
                return res.status(403).json({
                    message: 'Anda tidak memiliki akses ke bank soal ini',
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
