// app/services/ReschedulleService.js
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const ReschedulleModel = require('../models/ReschedulleModel');
const PesertaSeleksiModel = require('../models/PesertaSeleksiModel');
const UserModel = require('../models/UserModel');

const {pickFields} = require('../helpers/payloadHelper');


class ReschedulleService {

    /**
     * Ambil semua Reschedulle (paging + search)
     */
    static async getAll(dataWeb) {
        const query = dataWeb.query;
        const peserta_id = parseInt(dataWeb.user.id);
        
        const page  = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        const where = [];
        const params = [];

        // search umum
        if (query.search) {
            where.push(`(p.email LIKE ? OR p.nama LIKE ? OR p.nomor_peserta LIKE ? OR p.hp LIKE ?)`);
            params.push(`%${query.search}%`);
            params.push(`%${query.search}%`);
            params.push(`%${query.search}%`);
            params.push(`%${query.search}%`);
        }

        where.push(`(p.id = ?)`);
        params.push(`${peserta_id}`);

        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';

        const conn = await db.getConnection();
        try {
            const data  = await ReschedulleModel.findAll(conn, whereSql, params, limit, offset);
            const total = await ReschedulleModel.countAll(conn, whereSql, params);

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
     * Detail Reschedulle
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const Reschedulle = await ReschedulleModel.findById(conn, id);
            if (!Reschedulle) {
                throw new Error('Data tidak ditemukan');
            }
            return Reschedulle;
        } finally {
            conn.release();
        }
    }

    /**
     * Simpan Reschedulle baru
     */
    static async store(data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            // const peserta = await PesertaSeleksiModel.findById(conn, data.peserta_seleksi_id);
            // if (!peserta) {
            //     throw new Error('Peserta seleksi tidak ditemukan');
            // }

            const payload = pickFields(data,ReschedulleModel.columns);

            const ReschedulleId = await ReschedulleModel.insert(conn,payload);
            await conn.commit();

            return await ReschedulleModel.findById(conn, ReschedulleId);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Update Reschedulle
     */
    static async update(id, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            // const peserta = await PesertaSeleksiModel.findById(conn, data.peserta_seleksi_id);
            // if (!peserta) {
            //     throw new Error('Peserta seleksi tidak ditemukan');
            // }

            const payload = pickFields(data,ReschedulleModel.columns);

            const affected = await ReschedulleModel.update(conn, id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();

            return await ReschedulleModel.findById(conn, id);


        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * validasi Reschedulle
     */
    static async validasi(id, user, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,ReschedulleModel.validasi_kolom);
            payload.verified_user_id = user.id;
            payload.verified_at = new Date();

            const affected = await ReschedulleModel.update(conn, id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();

            return await ReschedulleModel.findById(conn, id);


        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Hapus Reschedulle
     */
    static async destroy(id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await ReschedulleModel.deleteById(conn, id);

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

module.exports = ReschedulleService;
