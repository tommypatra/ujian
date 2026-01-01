// app/services/PengelolaSeleksiService.js
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const PengelolaSeleksiModel = require('../models/PengelolaSeleksiModel');
const UserModel = require('../models/UserModel');
const SeleksiModel = require('../models/SeleksiModel');

class PengelolaSeleksiService {

    /**
     * Ambil semua PengelolaSeleksi (paging + search)
     */
    static async getAll(query) {
        const page  = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        let whereSql = '';
        let params = [];

        if (query.search) {
            whereSql = `WHERE s.seleksi LIKE ? u.name LIKE ?`;
            params.push(`%${query.search}%`, `%${query.search}%`);
        }

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
    static async store(data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const user = await UserModel.findById(conn, data.user_id);
            if (!user) {
                throw new Error('User tidak ditemukan');
            }

            const seleksi_id = await SeleksiModel.findById(conn, data.seleksi_id);
            if (!seleksi_id) {
                throw new Error('Seleksi tidak ditemukan');
            }            

            const PengelolaSeleksiId = await PengelolaSeleksiModel.insert(conn, {
                user_id: data.user_id,
                seleksi_id: data.seleksi_id,
                created_at: new Date()
            });

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
    static async update(id, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            const payload = {};

            if (data.user_id !== undefined){ 
                const user = await UserModel.findById(conn, data.user_id);
                if (!user) {
                    throw new Error('User tidak ditemukan');
                }

                payload.user_id = data.user_id;
            }
            if (data.seleksi_id !== undefined){ 
                const seleksi_id = await SeleksiModel.findById(conn, data.seleksi_id);
                if (!seleksi_id) {
                    throw new Error('Seleksi tidak ditemukan');
                }            

                payload.seleksi_id = data.seleksi_id;
            }
            const affected = await PengelolaSeleksiModel.update(conn, id, payload);
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
    static async destroy(id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await PengelolaSeleksiModel.deleteById(conn, id);

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
