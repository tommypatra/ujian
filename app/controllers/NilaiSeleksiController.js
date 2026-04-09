// app/controllers/NilaiSeleksiController.js
const NilaiSeleksiService = require('../services/NilaiSeleksiService');
const isDev = process.env.APP_ENV === 'development';

class NilaiSeleksiController {

    /**
     * GET /NilaiSeleksis
     * Ambil list (pagination, search, dll)
     */
    static async index(req, res) {
        try {
            const data_exec = await NilaiSeleksiService.getAll(req);
            return res.status(200).json({
                message: 'Data ditemukan',
                data: data_exec,
            });
        } catch (err) {
            console.error('NilaiSeleksiController.index error:', err);

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * GET /NilaiSeleksis/:id
     * Ambil detail
     */
    static async show(req, res) {
        try {
            const { id } = req.params;

            const data_exec = await NilaiSeleksiService.findById(id);
            return res.status(200).json({
                message: 'Data detail',
                data: data_exec
            });
        } catch (err) {
            console.error('NilaiSeleksiController.show error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * GET /NilaiSeleksis/:id
     * Ambil detail
     */
    static async findAllByKey(req, res) {
        try {
            const { peserta_seleksi_ids } = req.body;
            if (!Array.isArray(peserta_seleksi_ids) || peserta_seleksi_ids.length === 0) {
                return res.status(400).json({
                    message: 'peserta_seleksi_ids wajib berupa array dan tidak boleh kosong',
                    data: null
                });
            }
            const data_exec = await NilaiSeleksiService.findAllByKey(peserta_seleksi_ids);
            return res.status(200).json({
                message: 'Data detail',
                data: data_exec
            });
        } catch (err) {
            console.error('NilaiSeleksiController.show error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

}

module.exports = NilaiSeleksiController;
