module.exports = function requireRole(roleString) {
    return function (req, res, next) {
        if (!req.user || !Array.isArray(req.user.roles)) {
            return res.status(403).json({
                message: 'Akses ditolak'
            });
        }

        // parsing: "admin,pimpinan" atau "admin|pimpinan"
        const requiredRoles = roleString
            .split(/[,|]/)
            .map(role => role.trim())
            .filter(Boolean);

        const hasRole = requiredRoles.some(role =>
            req.user.roles.includes(role)
        );

        if (!hasRole) {
            return res.status(403).json({
                message: 'Role tidak memiliki akses'
            });
        }

        next();
    };
};
