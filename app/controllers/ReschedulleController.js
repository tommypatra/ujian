// app/controllers/ReschedulleController.js
const ReschedulleService = require('../services/ReschedulleService');
const ReschedulleRequest = require('../requests/ReschedulleRequest');

const isDev = process.env.APP_ENV === 'development';

class ReschedulleController {

    /**
     * GET /Reschedulles
     * Ambil list (pagination, search, dll)
     */
    static async index(req, res) {
        try {
            const data_exec = await ReschedulleService.getAll(req);
            return res.status(200).json({
                message: 'Data ditemukan',
                data: data_exec,
            });
        } catch (err) {
            console.error('ReschedulleController.index error:', err);

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * GET /Reschedulles/:id
     * Ambil detail
     */
    static async show(req, res) {
        try {
            const { id } = req.params;

            const data_exec = await ReschedulleService.findById(id);
            return res.status(200).json({
                message: 'Data detail',
                data: data_exec
            });
        } catch (err) {
            console.error('ReschedulleController.show error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * POST /Reschedulles
     * Tambah baru
     */
    static async store(req, res) {
        try {
            const { error, value } = ReschedulleRequest.store(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await ReschedulleService.store(value);
            return res.status(201).json({
                message: 'Tambah data berhasil',
                data: data_exec
            });
        } catch (err) {
            console.error('ReschedulleController.store error:', err);
            const isDev = process.env.APP_ENV === 'development';   

            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    message: 'Duplikat data entry',
                    data: null
                });
            }

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }


    /**
     * PUT /Reschedulles/:id
     * Update data
     */
    static async update(req, res) {
        try {
            const { id } = req.params;

            const { error, value } = ReschedulleRequest.update(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await ReschedulleService.update(id, value);
            return res.status(200).json({
                message: 'Data berhasil diperbarui',
                data: data_exec
            });
        } catch (err) {
            console.error('ReschedulleController.update error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * DELETE /Reschedulles/:id
     * Hapus
     */
    static async destroy(req, res) {
        try {
            const { id } = req.params;
            const data_exec = await ReschedulleService.destroy(id);
            return res.status(200).json({
                message: 'Data berhasil dihapus',
                data: data_exec
            });
        } catch (err) {
            console.error('ReschedulleController.destroy error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

}

module.exports = ReschedulleController;
