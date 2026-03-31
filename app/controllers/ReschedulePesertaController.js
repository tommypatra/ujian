// app/controllers/ReschedulePesertaController.js
const fs = require('fs').promises;

const ReschedulePesertaService = require('../services/ReschedulePesertaService');
const ReschedulePesertaRequest = require('../requests/ReschedulePesertaRequest');

const isDev = process.env.APP_ENV === 'development';

class ReschedulePesertaController {

    /**
     * GET /ReschedullePesertas
     * Ambil list (pagination, search, dll)
     */
    static async index(req, res) {
        try {
            const data_exec = await ReschedulePesertaService.getAll(req);
            return res.status(200).json({
                message: 'Data ditemukan',
                data: data_exec,
            });
        } catch (err) {
            console.error('ReschedulePesertaController.index error:', err);

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
            const peserta_id = parseInt(req.user.id) || null;

            const data_exec = await ReschedulePesertaService.findById(id,peserta_id);
            return res.status(200).json({
                message: 'Data detail',
                data: data_exec
            });
        } catch (err) {
            console.error('ReschedulePesertaController.show error:', err);
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

        const relativePath = req.uploadedFiles.file?.relative_path;   // simpan ke DB
        const absolutePath = req.uploadedFiles.file?.absolute_path;   // untuk fs.unlink
        const peserta_id = parseInt(req.user.id) || null;

        try {

            if (!req.uploadedFiles?.file) {
                return res.status(422).json({
                    message: 'Foto enter ujian wajib diupload',
                    data: null
                });
            }            

            const payload = {
                ...req.body,
                peserta_seleksi_id: req.params?.peserta_seleksi_id,
                peserta_id
            };
            
            // console.log(payload);

            const { error, value } = ReschedulePesertaRequest.store(payload);
            if (error) {
                if (absolutePath) {
                    await fs.unlink(absolutePath).catch(() => {});
                }                

                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const file = relativePath;
            const data_exec = await ReschedulePesertaService.store(value,{file});
            return res.status(201).json({
                message: 'Tambah data berhasil',
                data: data_exec
            });
        } catch (err) {
            console.error('ReschedulePesertaController.store error:', err);
            if (absolutePath) {
                await fs.unlink(absolutePath).catch(() => {});
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
        const file = req.uploadedFiles?.file;

        const relativePath = file?.relative_path;
        const absolutePath = file?.absolute_path;

        try {
            const { id, peserta_seleksi_id } = req.params;
            const peserta_id = parseInt(req.user.id) || null;

            const payload = {
                ...req.body,
                peserta_seleksi_id: peserta_seleksi_id,
            };

            const { error, value } = ReschedulePesertaRequest.update(payload);
            if (error) {

                if (absolutePath) {
                    await fs.unlink(absolutePath).catch(() => {});
                }                

                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const file = relativePath;
            const data_exec = await ReschedulePesertaService.update(id, peserta_id, value, {file});
            return res.status(200).json({
                message: 'Data berhasil diperbarui',
                data: data_exec
            });
        } catch (err) {
            console.error('ReschedulePesertaController.update error:', err);

            if (absolutePath) {
                await fs.unlink(absolutePath).catch(() => {});
            }                

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    static async kirim(req, res) {

        try {
            const { id,peserta_seleksi_id } = req.params;
            const data_exec = await ReschedulePesertaService.kirim(id, peserta_seleksi_id);
            return res.status(200).json({
                message: 'Data berhasil diperbarui',
                data: data_exec
            });
        } catch (err) {
            console.error('ReschedulePesertaController.update error:', err);

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
            const { id, peserta_seleksi_id } = req.params;
            const peserta_id = parseInt(req.user.id) || null;

            const data_exec = await ReschedulePesertaService.destroy(id, peserta_id, peserta_seleksi_id);
            return res.status(200).json({
                message: 'Data berhasil dihapus',
                data: data_exec
            });
        } catch (err) {
            console.error('ReschedulePesertaController.destroy error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

}

module.exports = ReschedulePesertaController;
