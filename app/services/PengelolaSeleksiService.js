// app/services/PengelolaSeleksiService.js
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const PengelolaSeleksiModel = require('../models/PengelolaSeleksiModel');
const UserModel = require('../models/UserModel');
const SeleksiModel = require('../models/SeleksiModel');
const {pickFields} = require('../helpers/payloadHelper');

class PengelolaSeleksiService {

    /**
     * Ambil semua PengelolaSeleksi (paging + search)
     */
    static async getAll(dataWeb) {
        const query = dataWeb.query;
        const seleksi_id = parseInt(dataWeb.params.seleksi_id) || null;

        const page  = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        const where = [];
        const params = [];

        //untuk seleksi id
        where.push(`s.id = ?`);
        params.push(parseInt(seleksi_id));


        // search umum
        if (query.search) {
            where.push(`(ps.jabatan LIKE ? OR u.name LIKE ? OR u.email LIKE ?)`);
            params.push(
                `%${query.search}%`,
                `%${query.search}%`,
                `%${query.search}%`
            );
        }

        
        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';

        const conn = await db.getConnection();
        try {
            const data  = await PengelolaSeleksiModel.findAll(conn, whereSql, params, limit, offset);
            const total = await PengelolaSeleksiModel.countAll(conn, whereSql, params);

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
     * Detail PengelolaSeleksi
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const exec_query = await PengelolaSeleksiModel.findById(conn, id);
            if (!exec_query) {
                throw new Error('Data tidak ditemukan');
            }
            return exec_query;
        } finally {
            conn.release();
        }
    }

    /**
     * Simpan PengelolaSeleksi baru + PengelolaSeleksi default
     */
    static async store(data, seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,PengelolaSeleksiModel.columns);
            payload.seleksi_id = seleksi_id;
            
            const PengelolaSeleksiId = await PengelolaSeleksiModel.insert(conn, payload);

            await conn.commit();

            return await PengelolaSeleksiModel.findById(conn, PengelolaSeleksiId);

        } catch (err) {
            await conn.rollback();

            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Update PengelolaSeleksi
     */
    static async update(id, data, seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            const payload = pickFields(data,PengelolaSeleksiModel.columns);

            const affected = await PengelolaSeleksiModel.updateByKeys(conn, ['id','seleksi_id'],[id,seleksi_id], payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();
            return await PengelolaSeleksiModel.findById(conn, id);

        } catch (err) {
            await conn.rollback();

            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Hapus PengelolaSeleksi + relasi PengelolaSeleksi
     */
    static async destroy(id,seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await PengelolaSeleksiModel.deleteById(conn, id, seleksi_id);

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

module.exports = PengelolaSeleksiService;
