// app/controllers/BankSoalPilihanController.js
const BankSoalPilihanService = require('../services/BankSoalPilihanService');
const BankSoalPilihanRequest = require('../requests/BankSoalPilihanRequest');

const isDev = process.env.APP_ENV === 'development';

class BankSoalPilihanController {

    /**
     * GET /BankSoalPilihans
     * Ambil list pilihan sesuai bank
     */
    static async index(req, res) {
        try {
            const { bank_soal_id } = req.params;

            const data_exec = await BankSoalPilihanService.findAllBySoalId(bank_soal_id);
            return res.status(200).json({
                message: 'Data ditemukan',
                data: data_exec,
            });
        } catch (err) {
            console.error('BankSoalPilihanController.index error:', err);

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * GET /BankSoalPilihans/:id
     * Ambil detail
     */
    static async show(req, res) {
        try {
            const { id } = req.params;

            const data_exec = await BankSoalPilihanService.findById(id);
            return res.status(200).json({
                message: 'Data ditemukan',
                data: data_exec,
            });
        } catch (err) {
            console.error('BankSoalPilihanController.index error:', err);

            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * POST /BankSoalPilihans
     * Tambah baru
     */
    static async store(req, res) {
        // console.log('BODY DI CONTROLLER:', req.body);
        try {
            const { error, value } = BankSoalPilihanRequest.store(req.body);
            const { bank_soal_id } = req.params;

            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await BankSoalPilihanService.store(value,bank_soal_id);
            return res.status(201).json({
                message: 'Tambah data berhasil',
                data: data_exec
            });
        } catch (err) {
            console.error('BankSoalPilihanController.store error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * PUT /BankSoalPilihans/:id
     * Update data
     */
    static async update(req, res) {
        try {
            const { id, bank_soal_id } = req.params;
            const user_id = req.user.id;

            const { error, value } = BankSoalPilihanRequest.update(req.body);
            if (error) {
                return res.status(422).json({
                    message: error.details[0].message,
                    data: null
                });
            }

            const data_exec = await BankSoalPilihanService.update(id, value, user_id, bank_soal_id);
            return res.status(200).json({
                message: 'Data berhasil diperbarui',
                data: data_exec
            });
        } catch (err) {
            console.error('BankSoalPilihanController.update error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * DELETE /BankSoalPilihans/:id
     * Hapus
     */
    static async destroy(req, res) {
        try {
            const { id, bank_soal_id } = req.params;
            const user_id = req.user.id;

            const data_exec = await BankSoalPilihanService.destroy(id, user_id, bank_soal_id);
            return res.status(200).json({
                message: 'Data berhasil dihapus',
                data: data_exec
            });
        } catch (err) {
            console.error('BankSoalPilihanController.destroy error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }

    /**
     * DELETE /BankSoalPilihans/ by bank_soal_id
     * Hapus
     */
    static async destroyBySoalId(req, res) {
        try {
            const { bank_soal_id } = req.params;
            const user_id = req.user.id;

            const data_exec = await BankSoalPilihanService.destroyBySoalId(user_id, bank_soal_id);
            return res.status(200).json({
                message: 'Data berhasil dihapus',
                data: data_exec
            });
        } catch (err) {
            console.error('BankSoalPilihanController.destroy error:', err);
            return res.status(500).json({
                message: isDev ? err.message : 'Internal server error',
                data: null
            });
        }
    }
}

module.exports = BankSoalPilihanController;
