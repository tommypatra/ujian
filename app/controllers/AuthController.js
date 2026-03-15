const AuthService = require('../services/AuthService');
const UserRequest = require('../requests/UserRequest');

class AuthController {

    /**
     * GET /cekToken
     */
    static async cekToken(req, res) {
        try {
            return res.status(200).json({
                message: 'token valid',
                data: null,
            });
        } catch (err) {
            console.error('UserController.index error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }


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
            return res.status(422).json({
                message: err.message,
                data: null
            });
        }
    }

    static async loginSeleksi(req, res) {
        try {
        const { error, value } = UserRequest.loginSeleksi(req.body);
        if (error) {
            return res.status(422).json({
                message: error.details[0].message,
                data: null
            });
        }

        const result = await AuthService.loginSeleksi(value);

        return res.status(200).json({
            message: 'Login berhasil',
            data: result
        });

        } catch (err) {
            return res.status(422).json({
                message: err.message,
                data: null
            });
        }
    }


    /**
     * PUT /Domains/:id
     * Update data
     */
    static async resetPeserta(req, res) {
        try {
            const user_id = req.user.id; 
            // console.log('user id ',user_id);
            const data_exec = await AuthService.resetPeserta(user_id);
            return res.status(200).json({
                message: 'logout reset peserta berhasil',
                data: 1
            });
        } catch (err) {
            console.error('DomainController.update error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }


}

module.exports = AuthController;
