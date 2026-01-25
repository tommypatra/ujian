const db = require('../../config/database');

module.exports = async function PemilikSoalPGMiddleware(req, res, next) {
    try {
        const user_id = req.user.id; 
        const bank_soal_id = req.params.bank_soal_id; 
        

        if (!req.user.roles.includes('pengguna')) {
            return res.status(403).json({
                message: 'Akses tidak diperbolehkan'
            });
        }

        const conn = await db.getConnection();
        try {
            const [rows] = await conn.query(`
                SELECT 1 FROM bank_soals bs 
                JOIN jenis_soals js 
                    ON js.id = bs.jenis_soal_id
                WHERE 
                    bs.id = ? AND 
                    bs.pembuat_user_id = ? AND
                    js.kode = 'PG'
                LIMIT 1
                `, [bank_soal_id, user_id]);

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
