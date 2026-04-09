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
     * GET /findJadwalPengawas
     * Ambil detail dari pengawas id yang login
     */
    static async findJadwalPengawas(req, res) {
        try {
            const data = await PengawasUjianService.findJadwalPengawas(req);
            return res.status(200).json({
                message: 'Data detail',
                data
            });
        } catch (err) {
            console.error('PengawasUjianController.findJadwalPengawas error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * GET /findJadwalPengawas
     * Ambil detail dari pengawas id yang login
     */
    static async getPengawasDetail(req, res) {
        try {
            const jadwal_seleksi_id = req.params.seleksi_id;
    
            const data = await PengawasUjianService.getPengawasDetail(jadwal_seleksi_id);
            return res.status(200).json({
                message: 'Data detail',
                data
            });
        } catch (err) {
            console.error('PengawasUjianController.findJadwalPengawas error:', err);
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
            // console.log('user id ',req.user.id)
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
            const { seleksi_id, jadwal_seleksi_id, peserta_seleksi_id } = req.params;

            const { error, value } = PengawasUjianRequest.validasiPeserta(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await PengawasUjianService.validasiPeserta(seleksi_id, peserta_seleksi_id, req.user.id, value);
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

    static async akhiriPesertaSesiUjian(req, res) {
        try {
            const pengawas_id = req.user.id;
            const { jadwal_seleksi_id } = req.params;

            const result = await PengawasUjianService.akhiriPesertaSesiUjian(
                jadwal_seleksi_id
            );

            return res.status(200).json({
                message: 'Sesi ujian berhasil diakhiri',
                data: result
            });

        } catch (err) {
            console.error('akhiriSesiUjian error:', err);
            return res.status(400).json({
                message: err.message,
                data: null
            });
        }
    }

    static async mulaiJadwalUjian(req, res) {
        try {
            const pengawas_id = req.user.id;
            const { jadwal_seleksi_id } = req.params;

            const result = await PengawasUjianService.mulaiJadwalUjian(
                pengawas_id,
                jadwal_seleksi_id
            );

            return res.status(200).json({
                message: 'Sesi ujian berhasil diakhiri',
                data: result
            });

        } catch (err) {
            console.error('akhiriSesiUjian error:', err);
            return res.status(400).json({
                message: err.message,
                data: null
            });
        }
    }

    static async selesaiJadwalUjian(req, res) {
        try {
            const pengawas_id = req.user.id;
            const { jadwal_seleksi_id } = req.params;

            const result = await PengawasUjianService.selesaiJadwalUjian(
                pengawas_id,
                jadwal_seleksi_id
            );

            return res.status(200).json({
                message: 'Sesi ujian berhasil diakhiri',
                data: result
            });

        } catch (err) {
            console.error('akhiriSesiUjian error:', err);
            return res.status(400).json({
                message: err.message,
                data: null
            });
        }
    }
    
}

module.exports = PengawasUjianController;
