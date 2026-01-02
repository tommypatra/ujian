// app/services/SeleksiService.js
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const SeleksiModel = require('../models/SeleksiModel');
const {pickFields} = require('../helpers/payloadHelper');

class SeleksiService {

    /**
     * Ambil semua Seleksi (paging + search)
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
            where.push(`(nama LIKE ?)`);
            params.push(`%${query.search}%`);
        }

        if(seleksi_id){
            where.push(`(id = ?)`);
            params.push(`${seleksi_id}`);
        }

        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';

        const conn = await db.getConnection();
        try {
            const data  = await SeleksiModel.findAll(conn, whereSql, params, limit, offset);
            const total = await SeleksiModel.countAll(conn, whereSql, params);

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
     * Detail Seleksi
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const Seleksi = await SeleksiModel.findById(conn, id);
            if (!Seleksi) {
                throw new Error('Data tidak ditemukan');
            }
            return Seleksi;
        } finally {
            conn.release();
        }
    }

    /**
     * Simpan Seleksi baru + Seleksi default
     */
    static async store(data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            
            const payload = pickFields(data,SeleksiModel.columns);

            const SeleksiId = await SeleksiModel.insert(conn, payload);

            await conn.commit();

            return await SeleksiModel.findById(conn, SeleksiId);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Update Seleksi
     */
    static async update(id, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,SeleksiModel.columns);

            const affected = await SeleksiModel.update(conn, id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();
            return await SeleksiModel.findById(conn, id);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Hapus Seleksi + relasi Seleksi
     */
    static async destroy(id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await SeleksiModel.deleteById(conn, id);

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

module.exports = SeleksiService;
