// app/controllers/PengawasUjianController.js
const PengawasUjianService = require('../services/PengawasUjianService');
const PengawasUjianRequest = require('../requests/PengawasUjianRequest');

const isDev = process.env.APP_ENV === 'development';

class PengawasUjianController {

    /**
     * GET /PesertaSeleksis
     * Ambil list (pagination, search, dll)
     */
    static async index(req, res) {
        try {        
            const data = await PengawasUjianService.getAll(req);
            return res.status(200).json({
                message: 'Data ditemukan',
                data
            });
        } catch (err) {
            console.error('PengawasUjianController.index error:', err);

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }


    /**
     * GET /PengawasUjians
     * Ambil detail dari pengawas id yang login
     */
    static async show(req, res) {
        try {
            const user_id = req.user.id;
            const data_exec = await PengawasUjianService.findById(user_id);
            return res.status(200).json({
                message: 'Data detail',
                data: data_exec
            });
        } catch (err) {
            console.error('PengawasUjianController.show error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * Reset login
     */
    static async resetLogin(req, res) {
        try {
            const user_id = req.user.id;
            const { peserta_seleksi_id } = req.params;

            const data_exec = await PengawasUjianService.resetLogin(peserta_seleksi_id,req.user.id);
            return res.status(200).json({
                message: 'reset login berhasil',
                data: data_exec
            });
        } catch (err) {
            console.error('PengawasUjianController.show error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * PUT /validasiPeserta/:id
     * validasi is allow
     */
    static async validasiPeserta(req, res) {
        try {
            const { peserta_seleksi_id } = req.params;

            const { error, value } = PengawasUjianRequest.validasiPeserta(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await PengawasUjianService.validasiPeserta(peserta_seleksi_id, value, req.user.id);
            return res.status(200).json({
                message: 'validasi berhasil',
                data: data_exec
            });
        } catch (err) {
            console.error('PengawasSeleksiController.update error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }
    
}

module.exports = PengawasUjianController;
