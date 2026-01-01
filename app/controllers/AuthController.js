const AuthService = require('../services/AuthService');
const UserRequest = require('../requests/UserRequest');

class AuthController {
    static async login(req, res) {
        try {
        const { error, value } = UserRequest.login(req.body);
        if (error) {
            return res.status(422).json({
                message: error.details[0].message,
                data: null
            });
        }

        const result = await AuthService.login(value);

        return res.status(200).json({
            message: 'Login berhasil',
            data: result
        });

        } catch (err) {
            return res.status(401).json({
                message: err.message,
                data: null
            });
        }
    }
}

module.exports = AuthController;
