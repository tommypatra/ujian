// app/controllers/ReschedulleSeleksiController.js
const ReschedulleSeleksiService = require('../services/ReschedulleSeleksiService');
const ReschedulleSeleksiRequest = require('../requests/ReschedulleSeleksiRequest');

const isDev = process.env.APP_ENV === 'development';

class ReschedulleSeleksiController {

    /**
     * GET /ReschedulleSeleksis
     * Ambil list (pagination, search, dll)
     */
    static async index(req, res) {
        try {
            const data_exec = await ReschedulleSeleksiService.getAll(req);
            return res.status(200).json({
                message: 'Data ditemukan',
                data: data_exec,
            });
        } catch (err) {
            console.error('ReschedulleSeleksiController.index error:', err);

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * GET /ReschedulleSeleksis/:id
     * Ambil detail
     */
    static async show(req, res) {
        try {
            const { id } = req.params;

            const data_exec = await ReschedulleSeleksiService.findById(id);
            return res.status(200).json({
                message: 'Data detail',
                data: data_exec
            });
        } catch (err) {
            console.error('ReschedulleSeleksiController.show error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }


    /**
     * PUT /ReschedulleSeleksis/:id
     * Update data
     */
    static async update(req, res) {
        try {
            const { id } = req.params;

            const { error, value } = ReschedulleSeleksiRequest.update(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await ReschedulleSeleksiService.update(id, value);
            return res.status(200).json({
                message: 'Data berhasil diperbarui',
                data: data_exec
            });
        } catch (err) {
            console.error('ReschedulleSeleksiController.update error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

}

module.exports = ReschedulleSeleksiController;
