// app/controllers/JadwalSeleksiController.js
const JadwalSeleksiService = require('../services/JadwalSeleksiService');
const JadwalSeleksiRequest = require('../requests/JadwalSeleksiRequest');

const isDev = process.env.APP_ENV === 'development';

class JadwalSeleksiController {

    /**
     * GET /JadwalSeleksis
     * Ambil list (pagination, search, dll)
     */
    static async index(req, res) {
        try {
            const data_exec = await JadwalSeleksiService.getAll(req);
            return res.status(200).json({
                message: 'Data ditemukan',
                data: data_exec,
            });
        } catch (err) {
            console.error('JadwalSeleksiController.index error:', err);

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * GET /JadwalSeleksis/:id
     * Ambil detail
     */
    static async show(req, res) {
        try {
            const { id } = req.params;

            const data_exec = await JadwalSeleksiService.findById(id);
            return res.status(200).json({
                message: 'Data detail',
                data: data_exec
            });
        } catch (err) {
            console.error('JadwalSeleksiController.show error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * POST /JadwalSeleksis
     * Tambah baru
     */
    static async store(req, res) {
        try {
            const { error, value } = JadwalSeleksiRequest.store(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await JadwalSeleksiService.store(value);
            return res.status(201).json({
                message: 'Tambah data berhasil',
                data: data_exec
            });
        } catch (err) {
            console.error('JadwalSeleksiController.store error:', err);
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
     * PUT /JadwalSeleksis/:id
     * Update data
     */
    static async update(req, res) {
        try {
            const { id } = req.params;

            const { error, value } = JadwalSeleksiRequest.update(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await JadwalSeleksiService.update(id, value);
            return res.status(200).json({
                message: 'Data berhasil diperbarui',
                data: data_exec
            });
        } catch (err) {
            console.error('JadwalSeleksiController.update error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * DELETE /JadwalSeleksis/:id
     * Hapus
     */
    static async destroy(req, res) {
        try {
            const { id } = req.params;
            const data_exec = await JadwalSeleksiService.destroy(id);
            return res.status(200).json({
                message: 'Data berhasil dihapus',
                data: data_exec
            });
        } catch (err) {
            console.error('JadwalSeleksiController.destroy error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

}

module.exports = JadwalSeleksiController;
