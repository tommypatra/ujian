// app/services/BankSoalPilihanService.js
const db = require('../../config/database');
const BankSoalPilihanModel = require('../models/BankSoalPilihanModel');

const {pickFields} = require('../helpers/payloadHelper');

class BankSoalPilihanService {

    /**
     * Detail pilihan berdasarkan bank_soal_id
     */
    static async findAllBySoalId(bank_soal_id) {
        const conn = await db.getConnection();
        try {
            const exec_query = await BankSoalPilihanModel.findAllBySoalId(conn, bank_soal_id);
            if (!exec_query) {
                throw new Error('Data tidak ditemukan');
            }
            return exec_query;
        } finally {
            conn.release();
        }
    }

    /**
     * Detail pilihan berdasarkan id
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const exec_query = await BankSoalPilihanModel.findById(conn, id);
            if (!exec_query) {
                throw new Error('Data tidak ditemukan');
            }
            return exec_query;
        } finally {
            conn.release();
        }
    }

    /**
     * Simpan BankSoalPilihan baru + BankSoalPilihan default
     */
    static async store(data, bank_soal_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,BankSoalPilihanModel.columns);
            payload.bank_soal_id=bank_soal_id;

            if(payload.is_benar && await BankSoalPilihanModel.adaJawbanBenar(conn,bank_soal_id)){
                throw new Error('Jawaban benar tidak boleh lebih dari 1');
            }

            const BankSoalPilihanId = await BankSoalPilihanModel.insert(conn, payload);

            await conn.commit();

            return await BankSoalPilihanModel.findById(conn, BankSoalPilihanId);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Update BankSoalPilihan
     */
    static async update(id, data, user_id, bank_soal_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,BankSoalPilihanModel.columns);
            payload.bank_soal_id=bank_soal_id;            

            if(payload.is_benar && await BankSoalPilihanModel.adaJawbanBenarSelainIni(conn,id,bank_soal_id)){
                throw new Error('Jawaban benar tidak boleh lebih dari 1');
            }

            const affected = await BankSoalPilihanModel.update(conn, id, user_id, bank_soal_id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();
            return await BankSoalPilihanModel.findById(conn, id);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Hapus BankSoalPilihan + relasi BankSoalPilihan
     */
    static async destroy(id, user_id, bank_soal_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await BankSoalPilihanModel.deleteById(conn, id, user_id, bank_soal_id);

            if (affected === 0) {
                throw new Error('Data tidak ditemukan');
            }

            await conn.commit();
            return { id };

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Hapus BankSoalPilihan + relasi BankSoalPilihan
     */
    static async destroyBySoalId(user_id, bank_soal_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await BankSoalPilihanModel.deleteBySoalId(conn, user_id, bank_soal_id);

            if (affected === 0) {
                throw new Error('Data tidak ditemukan');
            }

            await conn.commit();
            return { bank_soal_id };

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

}

module.exports = BankSoalPilihanService;
