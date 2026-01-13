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
            const seleksi_id = parseInt(req.params.seleksi_id) || null;


            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await JadwalSeleksiService.store(value,seleksi_id);
            return res.status(201).json({
                message: 'Tambah data berhasil',
                data: data_exec
            });
        } catch (err) {
            console.error('JadwalSeleksiController.store error:', err);

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
            const { id, seleksi_id } = req.params;

            const { error, value } = JadwalSeleksiRequest.update(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await JadwalSeleksiService.update(id, value, seleksi_id);
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
            const { id,seleksi_id } = req.params;
            const data_exec = await JadwalSeleksiService.destroy(id,seleksi_id);
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
