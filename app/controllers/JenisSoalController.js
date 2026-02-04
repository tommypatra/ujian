// app/controllers/JenisSoalController.js
const JenisSoalService = require('../services/JenisSoalService');
const JenisSoalRequest = require('../requests/JenisSoalRequest');

const isDev = process.env.APP_ENV === 'development';

class JenisSoalController {

    /**
     * GET /JenisSoals
     * Ambil list (pagination, search, dll)
     */
    static async index(req, res) {
        try {
            const data_exec = await JenisSoalService.getAll(req.query);
            return res.status(200).json({
                message: 'Data ditemukan',
                data: data_exec,
            });
        } catch (err) {
            console.error('JenisSoalController.index error:', err);

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * GET /JenisSoals/:id
     * Ambil detail
     */
    static async show(req, res) {
        try {
            const { id } = req.params;

            const data_exec = await JenisSoalService.findById(id);
            return res.status(200).json({
                message: 'Data detail',
                data: data_exec
            });
        } catch (err) {
            console.error('JenisSoalController.show error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * POST /JenisSoals
     * Tambah baru
     */
    static async store(req, res) {
        try {
            const { error, value } = JenisSoalRequest.store(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await JenisSoalService.store(value);
            return res.status(201).json({
                message: 'Tambah data berhasil',
                data: data_exec
            });
        } catch (err) {
            console.error('JenisSoalController.store error:', err);

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * PUT /JenisSoals/:id
     * Update data
     */
    static async update(req, res) {
        try {
            const { id } = req.params;

            const { error, value } = JenisSoalRequest.update(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await JenisSoalService.update(id, value);
            return res.status(200).json({
                message: 'Data berhasil diperbarui',
                data: data_exec
            });
        } catch (err) {
            console.error('JenisSoalController.update error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * DELETE /JenisSoals/:id
     * Hapus
     */
    static async destroy(req, res) {
        try {
            const { id } = req.params;
            const data_exec = await JenisSoalService.destroy(id);
            return res.status(200).json({
                message: 'Data berhasil dihapus',
                data: data_exec
            });
        } catch (err) {
            console.error('JenisSoalController.destroy error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

}

module.exports = JenisSoalController;
