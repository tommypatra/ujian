// app/controllers/SoalSeleksiController.js
const SoalSeleksiService = require('../services/SoalSeleksiService');
const SoalSeleksiRequest = require('../requests/SoalSeleksiRequest');

const isDev = process.env.APP_ENV === 'development';

class SoalSeleksiController {

    /**
     * GET /SoalSeleksis
     * Ambil list (pagination, search, dll)
     */
    static async index(req, res) {
        try {
            const data_exec = await SoalSeleksiService.getAll(req);
            return res.status(200).json({
                message: 'Data ditemukan',
                data: data_exec,
            });
        } catch (err) {
            console.error('SoalSeleksiController.index error:', err);

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    static async availableBankSoal(req, res) {
        try {
            const seleksi_id = parseInt(req.params.seleksi_id);
            const domain_soal_id = parseInt(req.query.domain_soal_id);

            if (!domain_soal_id) {
                return res.status(422).json({
                    message: 'domain_soal_id wajib diisi',
                    data: null
                });
            }

            const data_exec = await SoalSeleksiService.getAvailableBankSoal(
                seleksi_id,
                domain_soal_id,
                req.query
            );

            return res.status(200).json({
                message: 'Data bank soal tersedia',
                data: data_exec
            });

        } catch (err) {
            console.error('availableBankSoal error:', err);
            return res.status(500).json({
                message: process.env.APP_ENV === 'development'
                    ? err.message
                    : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * GET /SoalSeleksis/:id
     * Ambil detail
     */
    static async show(req, res) {
        try {
            const { id } = req.params;

            const data_exec = await SoalSeleksiService.findById(id);
            return res.status(200).json({
                message: 'Data detail',
                data: data_exec
            });
        } catch (err) {
            console.error('SoalSeleksiController.show error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * POST /bulkInsert
     * Tambah baru bulkInsert
     */
    static async bulkInsert(req, res) {
        // console.log('BODY DI CONTROLLER:', req.body);
        try {
            const { error, value } = SoalSeleksiRequest.storeBulkInsert(req.body);
            const seleksi_id = parseInt(req.params.seleksi_id) || null;
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await SoalSeleksiService.bulkInsert(seleksi_id, value);
            return res.status(201).json({
                message: 'Tambah data berhasil',
                data: data_exec
            });
        } catch (err) {
            console.error('SoalSeleksiController.store error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }


    /**
     * POST /SoalSeleksis
     * Tambah baru
     */
    static async store(req, res) {
        // console.log('BODY DI CONTROLLER:', req.body);
        try {
            const { error, value } = SoalSeleksiRequest.store(req.body);
            const seleksi_id = parseInt(req.params.seleksi_id) || null;
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await SoalSeleksiService.store(value, seleksi_id);
            return res.status(201).json({
                message: 'Tambah data berhasil',
                data: data_exec
            });
        } catch (err) {
            console.error('SoalSeleksiController.store error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * PUT /SoalSeleksis/:id
     * Update data
     */
    static async update(req, res) {
        try {
            const { id } = req.params;

            const { error, value } = SoalSeleksiRequest.update(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await SoalSeleksiService.update(id, value);
            return res.status(200).json({
                message: 'Data berhasil diperbarui',
                data: data_exec
            });
        } catch (err) {
            console.error('SoalSeleksiController.update error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * DELETE /SoalSeleksis/:id
     * Hapus
     */
    static async destroy(req, res) {
        try {
            const { id } = req.params;
            const data_exec = await SoalSeleksiService.destroy(id);
            return res.status(200).json({
                message: 'Data berhasil dihapus',
                data: data_exec
            });
        } catch (err) {
            console.error('SoalSeleksiController.destroy error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    static async bulkDelete(req, res) {
        try {
            const { error, value } = SoalSeleksiRequest.bulkDelete(req.body);
            const seleksi_id = parseInt(req.params.seleksi_id);

            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const result = await SoalSeleksiService.bulkDelete(
                seleksi_id,
                value
            );

            return res.status(200).json({
                message: 'Soal berhasil dihapus',
                data: result
            });

        } catch (err) {
            console.error('Bulk delete error:', err);
            return res.status(500).json({
                message: err.message,
                data: null
            });
        }
    }

    
}

module.exports = SoalSeleksiController;
