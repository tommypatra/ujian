// app/services/JadwalSeleksiService.js
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const JadwalSeleksiModel = require('../models/JadwalSeleksiModel');
const {pickFields} = require('../helpers/payloadHelper');


class JadwalSeleksiService {

    /**
     * Ambil semua JadwalSeleksi (paging + search)
     */
    static async getAll(dataWeb) {
        const query = dataWeb.query;
        const seleksi_id = parseInt(dataWeb.params.seleksi_id) || null;

        const page  = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        const where = [];
        const params = [];

        // search umum
        if (query.search) {
            where.push(`(s.nama LIKE ?)`);
            params.push(`%${query.search}%`);
        }

        // filter by seleksi_id
        if (query.seleksi_id) {
            where.push(`(js.seleksi_id = ?)`);
            params.push(parseInt(query.seleksi_id));
        }

        if(seleksi_id){
            where.push(`(js.seleksi_id = ?)`);
            params.push(`${seleksi_id}`);
        }


        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';

        const conn = await db.getConnection();
        try {
            const data  = await JadwalSeleksiModel.findAll(conn, whereSql, params, limit, offset);
            const total = await JadwalSeleksiModel.countAll(conn, whereSql, params);

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
     * Detail JadwalSeleksi
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const JadwalSeleksi = await JadwalSeleksiModel.findById(conn, id);
            if (!JadwalSeleksi) {
                throw new Error('Data tidak ditemukan');
            }
            return JadwalSeleksi;
        } finally {
            conn.release();
        }
    }

    /**
     * Detail JadwalSeleksi
     */
    static async findBySesi(sesi) {
        const conn = await db.getConnection();
        try {
            const JadwalSeleksi = await JadwalSeleksiModel.findBySesi(conn, sesi);
            if (!JadwalSeleksi) {
                throw new Error('Data tidak ditemukan');
            }
            return JadwalSeleksi;
        } finally {
            conn.release();
        }
    }

    /**
     * Simpan JadwalSeleksi baru + JadwalSeleksi default
     */
    static async store(data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();


            const payload = pickFields(data,JadwalSeleksiModel.columns);

            const JadwalSeleksiId = await JadwalSeleksiModel.insert(conn,payload);

            await conn.commit();

            return await JadwalSeleksiModel.findById(conn, JadwalSeleksiId);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Update JadwalSeleksi
     */
    static async update(id, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            const payload = pickFields(data,JadwalSeleksiModel.columns);

            const affected = await JadwalSeleksiModel.update(conn, id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();
            return await JadwalSeleksiModel.findById(conn, id);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Hapus JadwalSeleksi + relasi JadwalSeleksi
     */
    static async destroy(id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await JadwalSeleksiModel.deleteById(conn, id);

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

module.exports = JadwalSeleksiService;
