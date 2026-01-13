// app/controllers/PesertaController.js
const PesertaService = require('../services/PesertaService');
const PesertaRequest = require('../requests/PesertaRequest');

const isDev = process.env.APP_ENV === 'development';

class PesertaController {

    /**
     * GET /Pesertas
     * Ambil list (pagination, search, dll)
     */
    static async index(req, res) {
        try {
            const data_exec = await PesertaService.getAll(req);
            return res.status(200).json({
                message: 'Data ditemukan',
                data: data_exec,
            });
        } catch (err) {
            console.error('PesertaController.index error:', err);

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * GET /Pesertas/:id
     * Ambil detail
     */
    static async show(req, res) {
        try {
            const { id } = req.params;

            const data_exec = await PesertaService.findById(id);
            return res.status(200).json({
                message: 'Data detail',
                data: data_exec
            });
        } catch (err) {
            console.error('PesertaController.show error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * POST /Pesertas
     * Tambah baru
     */
    static async store(req, res) {
        try {
            const { error, value } = PesertaRequest.store(req.body);
            const seleksi_id = parseInt(req.params.seleksi_id) || null;

            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await PesertaService.store(value,seleksi_id);
            return res.status(201).json({
                message: 'Tambah data berhasil',
                data: data_exec
            });
        } catch (err) {
            console.error('PesertaController.store error:', err);

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
     * PUT /Pesertas/:id
     * Update data
     */
    static async update(req, res) {
        try {
            const { id, seleksi_id } = req.params;

            const { error, value } = PesertaRequest.update(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await PesertaService.update(id,value,seleksi_id);

            return res.status(200).json({
                message: 'Data berhasil diperbarui',
                data: data_exec
            });
        } catch (err) {
            console.error('PesertaController.update error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * DELETE /Pesertas/:id
     * Hapus
     */
    static async destroy(req, res) {
        try {
            const { id, seleksi_id } = req.params;
            const data_exec = await PesertaService.destroy(id,seleksi_id);
            return res.status(200).json({
                message: 'Data berhasil dihapus',
                data: data_exec
            });
        } catch (err) {
            console.error('PesertaController.destroy error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    // login peserta
    static async loginPeserta(req, res) {
        try {
        const { error, value } = PesertaRequest.loginPeserta(req.body);
        if (error) {
            return res.status(422).json({
                message: error.details[0].message,
                data: null
            });
        }

        const result = await PesertaService.loginPeserta(value);

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

module.exports = PesertaController;
