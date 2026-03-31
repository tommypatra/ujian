// app/controllers/ReschedulePanitiaController.js
const ReschedulePanitiaService = require('../services/ReschedulePanitiaService');
const ReschedulePanitiaRequest = require('../requests/ReschedulePanitiaRequest');

const isDev = process.env.APP_ENV === 'development';

class ReschedulePanitiaController {

    /**
     * GET /ReschedullePanitias
     * Ambil list (pagination, search, dll)
     */
    static async index(req, res) {
        try {
            const data_exec = await ReschedulePanitiaService.getAll(req);
            return res.status(200).json({
                message: 'Data ditemukan',
                data: data_exec,
            });
        } catch (err) {
            console.error('ReschedulePanitiaController.index error:', err);

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * GET /ReschedullePanitias/:id
     * Ambil detail
     */
    static async show(req, res) {
        try {
            const { id } = req.params;

            const data_exec = await ReschedulePanitiaService.findById(id);
            return res.status(200).json({
                message: 'Data detail',
                data: data_exec
            });
        } catch (err) {
            console.error('ReschedulePanitiaController.show error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }


    /**
     * PUT /ReschedullePanitias/:id
     * Update data
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const user_id = parseInt(req.user.id) || null;

            const { error, value } = ReschedulePanitiaRequest.update(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await ReschedulePanitiaService.validasi(id, user_id, value);
            return res.status(200).json({
                message: 'Data berhasil diperbarui',
                data: data_exec
            });
        } catch (err) {
            console.error('ReschedulePanitiaController.update error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

}

module.exports = ReschedulePanitiaController;
