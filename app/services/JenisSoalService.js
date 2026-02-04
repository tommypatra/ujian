// app/services/JenisSoalService.js
const db = require('../../config/database');
const JenisSoalModel = require('../models/JenisSoalModel');
const {pickFields} = require('../helpers/payloadHelper');

class JenisSoalService {

    /**
     * Ambil semua JenisSoal (paging + search)
     */
    static async getAll(query) {
        const page  = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        const where = [];
        const params = [];

        // search umum
        if (query.search) {
            where.push(`(jenis LIKE ? OR kode LIKE ?)`);
            params.push(`%${query.search}%`);
            params.push(`%${query.search}%`);
        }


        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';
        const conn = await db.getConnection();
        try {
            const data  = await JenisSoalModel.findAll(conn, whereSql, params, limit, offset);
            const total = await JenisSoalModel.countAll(conn, whereSql, params);

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
     * Detail JenisSoal
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const JenisSoal = await JenisSoalModel.findById(conn, id);
            if (!JenisSoal) {
                throw new Error('Data tidak ditemukan');
            }
            return JenisSoal;
        } finally {
            conn.release();
        }
    }

    /**
     * Simpan JenisSoal baru + JenisSoal default
     */
    static async store(data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            const payload = pickFields(data,JenisSoalModel.columns);

            const JenisSoalId = await JenisSoalModel.insert(conn, payload);

            await conn.commit();

            return await JenisSoalModel.findById(conn, JenisSoalId);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Update JenisSoal
     */
    static async update(id, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,JenisSoalModel.columns);

            const affected = await JenisSoalModel.update(conn, id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();
            return await JenisSoalModel.findById(conn, id);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Hapus JenisSoal + relasi JenisSoal
     */
    static async destroy(id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await JenisSoalModel.deleteById(conn, id);

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

module.exports = JenisSoalService;
