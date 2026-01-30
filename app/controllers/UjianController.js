// app/controllers/UjianController.js
const UjianService = require('../services/UjianService');
const UjianRequest = require('../requests/UjianRequest');
const { JUMLAH_SOAL_UJIAN } = require('../helpers/ujianHelper');

const isDev = process.env.APP_ENV === 'development';

class UjianController {

    /**
     * GET /ujian/:jadwal_seleksi_id/soal
     * ?start=1&limit=20
     */
    static async index(req, res) {
        try {
            const { peserta_seleksi_id } = req.params;
            const peserta_id = parseInt(req.user.id) || null;

            const limit = Number(req.query.limit ?? JUMLAH_SOAL_UJIAN);
            const no = Number(req.query.no ?? 1);
            
            const start = Math.floor((no - 1) / limit) * limit + 1;

            const result = await UjianService.getSoalByRange(
                peserta_id,
                peserta_seleksi_id,
                start,
                limit
            );

            return res.status(200).json({
                message: 'Data ditemukan',
                data: result.data,
                meta: {
                    start: result.start,
                    limit: result.limit,
                    count: result.count,
                    blok: `${start} - ${start + limit - 1}`
                }
            });

        } catch (err) {
            console.error('UjianController.index error:', err);

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }


    static async selesaiUjian(req, res) {
        try {
            const peserta_id = req.user.id;
            const { peserta_seleksi_id } = req.params;

            const data_exec = await UjianService.selesaiUjian(peserta_id,peserta_seleksi_id);

            return res.status(200).json({
                message: 'ujian selesai',
                data: data_exec
            });
        } catch (err) {
            console.error('UjianController.update error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * PUT /UjianControllers/:id
     * Update data
     */
    static async simpanJawaban(req, res) {
        try {
            const peserta_id = req.user.id;
            const { peserta_seleksi_id } = req.params;

            const { error, value } = UjianRequest.simpanJawaban(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await UjianService.simpanJawaban(peserta_id,peserta_seleksi_id,value);

            return res.status(200).json({
                message: 'jawaban tersimpan',
                data: data_exec
            });
        } catch (err) {
            console.error('UjianController.update error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

}

module.exports = UjianController;
