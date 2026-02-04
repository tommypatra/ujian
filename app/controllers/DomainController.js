// app/controllers/DomainController.js
const DomainService = require('../services/DomainService');
const DomainRequest = require('../requests/DomainRequest');

const isDev = process.env.APP_ENV === 'development';

class DomainController {

    /**
     * GET /Domains
     * Ambil list (pagination, search, dll)
     */
    static async index(req, res) {
        try {
            const data_exec = await DomainService.getAll(req.query);
            return res.status(200).json({
                message: 'Data ditemukan',
                data: data_exec,
            });
        } catch (err) {
            console.error('DomainController.index error:', err);

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * GET /Domains/:id
     * Ambil detail
     */
    static async show(req, res) {
        try {
            const { id } = req.params;

            const data_exec = await DomainService.findById(id);
            return res.status(200).json({
                message: 'Data detail',
                data: data_exec
            });
        } catch (err) {
            console.error('DomainController.show error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * POST /Domains
     * Tambah baru
     */
    static async store(req, res) {
        try {
            const { error, value } = DomainRequest.store(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await DomainService.store(value);
            return res.status(201).json({
                message: 'Tambah data berhasil',
                data: data_exec
            });
        } catch (err) {
            console.error('DomainController.store error:', err);

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * PUT /Domains/:id
     * Update data
     */
    static async update(req, res) {
        try {
            const { id } = req.params;

            const { error, value } = DomainRequest.update(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await DomainService.update(id, value);
            return res.status(200).json({
                message: 'Data berhasil diperbarui',
                data: data_exec
            });
        } catch (err) {
            console.error('DomainController.update error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * DELETE /Domains/:id
     * Hapus
     */
    static async destroy(req, res) {
        try {
            const { id } = req.params;
            const data_exec = await DomainService.destroy(id);
            return res.status(200).json({
                message: 'Data berhasil dihapus',
                data: data_exec
            });
        } catch (err) {
            console.error('DomainController.destroy error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

}

module.exports = DomainController;
