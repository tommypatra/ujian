// app/controllers/SeleksiController.js
const SeleksiService = require('../services/SeleksiService');
const SeleksiRequest = require('../requests/SeleksiRequest');

const isDev = process.env.APP_ENV === 'development';

class SeleksiController {

    /**
     * GET /Seleksis
     * Ambil list (pagination, search, dll)
     */
    static async index(req, res) {
        try {
            const data_exec = await SeleksiService.getAll(req.query);
            return res.status(200).json({
                message: 'Data ditemukan',
                data: data_exec,
            });
        } catch (err) {
            console.error('SeleksiController.index error:', err);

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * GET /Seleksis/:id
     * Ambil detail
     */
    static async show(req, res) {
        try {
            const { id } = req.params;

            const data_exec = await SeleksiService.findById(id);
            return res.status(200).json({
                message: 'Data detail',
                data: data_exec
            });
        } catch (err) {
            console.error('SeleksiController.show error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * POST /Seleksis
     * Tambah baru
     */
    static async store(req, res) {
        try {
            const { error, value } = SeleksiRequest.store(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await SeleksiService.store(value);
            return res.status(201).json({
                message: 'Tambah data berhasil',
                data: data_exec
            });
        } catch (err) {
            console.error('SeleksiController.store error:', err);
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
     * PUT /Seleksis/:id
     * Update data
     */
    static async update(req, res) {
        try {
            const { id } = req.params;

            const { error, value } = SeleksiRequest.update(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await SeleksiService.update(id, value);
            return res.status(200).json({
                message: 'Data berhasil diperbarui',
                data: data_exec
            });
        } catch (err) {
            console.error('SeleksiController.update error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * DELETE /Seleksis/:id
     * Hapus
     */
    static async destroy(req, res) {
        try {
            const { id } = req.params;
            const data_exec = await SeleksiService.destroy(id);
            return res.status(200).json({
                message: 'Data berhasil dihapus',
                data: data_exec
            });
        } catch (err) {
            console.error('SeleksiController.destroy error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

}

module.exports = SeleksiController;
