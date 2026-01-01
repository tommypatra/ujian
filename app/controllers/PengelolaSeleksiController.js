// app/controllers/PengelolaSeleksiController.js
const PengelolaSeleksiService = require('../services/PengelolaSeleksiService');
const PengelolaSeleksiRequest = require('../requests/PengelolaSeleksiRequest');

const isDev = process.env.APP_ENV === 'development';

class PengelolaSeleksiController {

    /**
     * GET /PengelolaSeleksis
     * Ambil list (pagination, search, dll)
     */
    static async index(req, res) {
        try {
            const data_exec = await PengelolaSeleksiService.getAll(req.query);
            return res.status(200).json({
                message: 'Data ditemukan',
                data: data_exec,
            });
        } catch (err) {
            console.error('PengelolaSeleksiController.index error:', err);

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * GET /PengelolaSeleksis/:id
     * Ambil detail
     */
    static async show(req, res) {
        try {
            const { id } = req.params;

            const data_exec = await PengelolaSeleksiService.findById(id);
            return res.status(200).json({
                message: 'Data detail',
                data: data_exec
            });
        } catch (err) {
            console.error('PengelolaSeleksiController.show error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * POST /PengelolaSeleksis
     * Tambah baru
     */
    static async store(req, res) {
        // console.log('BODY DI CONTROLLER:', req.body);
        try {
            const { error, value } = PengelolaSeleksiRequest.store(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await PengelolaSeleksiService.store(value);
            return res.status(201).json({
                message: 'Tambah data berhasil',
                data: data_exec
            });
        } catch (err) {
            console.error('PengelolaSeleksiController.store error:', err);
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
     * PUT /PengelolaSeleksis/:id
     * Update data
     */
    static async update(req, res) {
        try {
            const { id } = req.params;

            const { error, value } = PengelolaSeleksiRequest.update(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await PengelolaSeleksiService.update(id, value);
            return res.status(200).json({
                message: 'Data berhasil diperbarui',
                data: data_exec
            });
        } catch (err) {
            console.error('PengelolaSeleksiController.update error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * DELETE /PengelolaSeleksis/:id
     * Hapus
     */
    static async destroy(req, res) {
        try {
            const { id } = req.params;
            const data_exec = await PengelolaSeleksiService.destroy(id);
            return res.status(200).json({
                message: 'Data berhasil dihapus',
                data: data_exec
            });
        } catch (err) {
            console.error('PengelolaSeleksiController.destroy error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

}

module.exports = PengelolaSeleksiController;
