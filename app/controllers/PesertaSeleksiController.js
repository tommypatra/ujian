// app/controllers/PesertaSeleksiController.js
const PesertaSeleksiService = require('../services/PesertaSeleksiService');
const PesertaSeleksiRequest = require('../requests/PesertaSeleksiRequest');
const PesertaUjianRequest = require('../requests/PesertaUjianRequest');

const isDev = process.env.APP_ENV === 'development';

class PesertaSeleksiController {
    /**
     * GET /PesertaSeleksis
     * Ambil jadwal peserta tertentu
     */

    static async cariJadwal(req, res) {
        try {
            const peserta_id = parseInt(req.user.id) || null;
            const data_exec = await PesertaSeleksiService.findAllByPesertaId(peserta_id);
            return res.status(200).json({
                message: 'Data detail',
                data: data_exec
            });
        } catch (err) {
            console.error('PesertaSeleksiController.show error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }


    /**
     * GET /PesertaSeleksis
     * Ambil list (pagination, search, dll)
     */
    static async index(req, res) {
        try {
            const data_exec = await PesertaSeleksiService.getAll(req);
            return res.status(200).json({
                message: 'Data ditemukan',
                data: data_exec,
            });
        } catch (err) {
            console.error('PesertaSeleksiController.index error:', err);

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * GET /PesertaSeleksis/:id
     * Ambil detail
     */
    static async show(req, res) {
        try {
            const { id } = req.params;

            const data_exec = await PesertaSeleksiService.findById(id);
            return res.status(200).json({
                message: 'Data detail',
                data: data_exec
            });
        } catch (err) {
            console.error('PesertaSeleksiController.show error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * POST /PesertaSeleksis
     * Tambah baru
     */
    static async store(req, res) {
        try {
            const { error, value } = PesertaSeleksiRequest.store(req.body);
            const seleksi_id = parseInt(req.params.seleksi_id) || null;

            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await PesertaSeleksiService.store(value,seleksi_id);
            return res.status(201).json({
                message: 'Tambah data berhasil',
                data: data_exec
            });
        } catch (err) {
            console.error('PesertaSeleksiController.store error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * PUT /PesertaSeleksis/:id
     * Update data
     */
    static async update(req, res) {
        try {
            const { id, seleksi_id } = req.params;
            const { error, value } = PesertaSeleksiRequest.update(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await PesertaSeleksiService.update(id, value,seleksi_id);
            return res.status(200).json({
                message: 'Data berhasil diperbarui',
                data: data_exec
            });
        } catch (err) {
            console.error('PesertaSeleksiController.update error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * DELETE /PesertaSeleksis/:id
     * Hapus
     */
    static async destroy(req, res) {
        try {
            const { id, seleksi_id } = req.params;
            const data_exec = await PesertaSeleksiService.destroy(id,seleksi_id);
            return res.status(200).json({
                message: 'Data berhasil dihapus',
                data: data_exec
            });
        } catch (err) {
            console.error('PesertaSeleksiController.destroy error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }


    /**
     * POST /enterUjian/:jadwal_seleksi_id
     * Update data peserta seleksi
     */
    static async enterUjian(req, res) {
        try {
            const { jadwal_seleksi_id } = req.params;
            const peserta_id = req.user.id;

            if (!req.uploadedFiles?.enter_foto) {
                return res.status(422).json({
                    message: 'Foto enter ujian wajib diupload',
                    data: null
                });
            }

            const enter_foto = req.uploadedFiles.enter_foto.relative_path;
            const data_exec = await PesertaSeleksiService.enterUjian(peserta_id,jadwal_seleksi_id,{enter_foto});

            return res.status(200).json({
                message: 'Enter ujian berhasil dilakukan',
                data: data_exec
            });
        } catch (err) {
            console.error('PesertaSeleksiController.enterUjian error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    

}

module.exports = PesertaSeleksiController;
