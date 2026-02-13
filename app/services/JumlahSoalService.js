// app/services/JumlahSoalService.js
const db = require('../../config/database');
const JumlahSoalModel = require('../models/JumlahSoalModel');
const {pickFields} = require('../helpers/payloadHelper');

class JumlahSoalService {

    /**
     * Ambil semua JumlahSoal (paging + search)
     */
    static async getAll(dataWeb) {
        const query = dataWeb.query;
        const seleksi_id = parseInt(dataWeb.params.seleksi_id) || null;

        const page  = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        const where = [];
        const params = [];

        where.push(`(js.seleksi_id = ?)`);
        params.push(`${seleksi_id}`);

        // search umum
        if (query.search) {
            where.push(`(b.pertanyaan LIKE ? OR u.name LIKE ?)`);
            params.push(`%${query.search}%`);
            params.push(`%${query.search}%`);
        }

        // filter by domain_soal_id
        if (query.domain_soal_id) {
            where.push(`(ds.domain_soal_id = ?)`);
            params.push(query.domain_soal_id);
        }

        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';

        const conn = await db.getConnection();
        try {
            const data  = await JumlahSoalModel.findAll(conn, whereSql, params, limit, offset);
            const total = await JumlahSoalModel.countAll(conn, whereSql, params);
            return {
                data,
                meta: {
                    page,
                    limit,
                    total
                }
            };
        } finally {
            conn.release();
        }
    }

    /**
     * Detail findById
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const exec_query = await JumlahSoalModel.findById(conn, id);
            if (!exec_query) {
                throw new Error('Data tidak ditemukan');
            }
            return exec_query;
        } finally {
            conn.release();
        }
    }

    /**
     * Simpan JumlahSoal baru + JumlahSoal default
     */
    static async store(data, seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,JumlahSoalModel.columns);

            const JumlahSoalId = await JumlahSoalModel.insert(conn, {
                domain_soal_id:payload.domain_soal_id,
                seleksi_id:seleksi_id,
                jumlah:payload.jumlah
            });

            await conn.commit();

            return await JumlahSoalModel.findById(conn, JumlahSoalId);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Update JumlahSoal
     */
    static async update(id, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,JumlahSoalModel.columns);

            const affected = await JumlahSoalModel.update(conn, id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();
            return await JumlahSoalModel.findById(conn, id);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Hapus JumlahSoal + relasi JumlahSoal
     */
    static async destroy(id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await JumlahSoalModel.deleteById(conn, id);

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
}

module.exports = JumlahSoalService;
