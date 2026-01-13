// app/controllers/ReschedullePesertaController.js
const ReschedullePesertaService = require('../services/ReschedullePesertaService');
const ReschedullePesertaRequest = require('../requests/ReschedullePesertaRequest');

const isDev = process.env.APP_ENV === 'development';

class ReschedullePesertaController {

    /**
     * GET /ReschedullePesertas
     * Ambil list (pagination, search, dll)
     */
    static async index(req, res) {
        try {
            const data_exec = await ReschedullePesertaService.getAll(req);
            return res.status(200).json({
                message: 'Data ditemukan',
                data: data_exec,
            });
        } catch (err) {
            console.error('ReschedullePesertaController.index error:', err);

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * GET /ReschedullePesertas/:id
     * Ambil detail
     */
    static async show(req, res) {
        try {
            const { id } = req.params;

            const data_exec = await ReschedullePesertaService.findById(id);
            return res.status(200).json({
                message: 'Data detail',
                data: data_exec
            });
        } catch (err) {
            console.error('ReschedullePesertaController.show error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * POST /ReschedullePesertas
     * Tambah baru
     */
    static async store(req, res) {
        try {

            const payload = {
                ...req.body,
                peserta_seleksi_id: req.params?.peserta_seleksi_id,
                dokumen_pendukung: req.uploadedFiles?.dokumen_pendukung?.relative_path
            };
            
            const { error, value } = ReschedullePesertaRequest.store(payload);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await ReschedullePesertaService.store(value);
            return res.status(201).json({
                message: 'Tambah data berhasil',
                data: data_exec
            });
        } catch (err) {
            console.error('ReschedullePesertaController.store error:', err);

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
     * PUT /ReschedullePesertas/:id
     * Update data
     */
    static async update(req, res) {
        try {
            const { id,peserta_seleksi_id } = req.params;
            const payload = {
                ...req.body,
                peserta_seleksi_id: peserta_seleksi_id,
                dokumen_pendukung: req.uploadedFiles?.dokumen_pendukung?.relative_path
            };

            const { error, value } = ReschedullePesertaRequest.update(payload);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await ReschedullePesertaService.update(id, value,peserta_seleksi_id);
            return res.status(200).json({
                message: 'Data berhasil diperbarui',
                data: data_exec
            });
        } catch (err) {
            console.error('ReschedullePesertaController.update error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * DELETE /ReschedullePesertas/:id
     * Hapus
     */
    static async destroy(req, res) {
        try {
            const { id,peserta_seleksi_id } = req.params;
            const data_exec = await ReschedullePesertaService.destroy(id,peserta_seleksi_id);
            return res.status(200).json({
                message: 'Data berhasil dihapus',
                data: data_exec
            });
        } catch (err) {
            console.error('ReschedullePesertaController.destroy error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

}

module.exports = ReschedullePesertaController;
