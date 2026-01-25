const db = require('../../config/database');

module.exports = async function RolePengelolaMiddleware(req, res, next) {
    try {
        const user = req.user; // dari AuthMiddleware

        if (!req.user.roles.includes('pengguna','admin')) {
            return res.status(403).json({
                message: 'Akses khusus pengelola'
            });
        }

        return next();

    } catch (err) {
        console.error('middleware error:', err);
        return res.status(500).json({
            message: 'Internal server error',
            data: null
        });
    }
};
