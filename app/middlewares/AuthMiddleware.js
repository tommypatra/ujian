const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Token tidak ditemukan'
        });
    }

    // format: Bearer <token>
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            message: 'Token tidak valid'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // simpan payload ke request
        req.user = decoded;
        // { id, email, roles, iat, exp }

        next();
    } catch (err) {
        return res.status(401).json({
            message: 'Token tidak valid atau kadaluarsa'
        });
    }
};
