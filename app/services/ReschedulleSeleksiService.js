// app/services/ReschedulleSeleksiService.js
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const ReschedulleSeleksiModel = require('../models/ReschedulleSeleksiModel');
const PesertaSeleksiModel = require('../models/PesertaSeleksiModel');
const UserModel = require('../models/UserModel');

const {pickFields} = require('../helpers/payloadHelper');


class ReschedulleSeleksiService {

    /**
     * Ambil semua ReschedulleSeleksi (paging + search)
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
            where.push(`(p.email LIKE ? OR p.nama LIKE ? OR p.nomor_peserta LIKE ? OR p.hp LIKE ?)`);
            params.push(`%${query.search}%`);
            params.push(`%${query.search}%`);
            params.push(`%${query.search}%`);
            params.push(`%${query.search}%`);
        }

        if(seleksi_id){
            where.push(`(p.seleksi_id = ?)`);
            params.push(`${seleksi_id}`);
        }

        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';

        const conn = await db.getConnection();
        try {
            const data  = await ReschedulleSeleksiModel.findAll(conn, whereSql, params, limit, offset);
            const total = await ReschedulleSeleksiModel.countAll(conn, whereSql, params);

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
     * Detail ReschedulleSeleksi
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const ReschedulleSeleksi = await ReschedulleSeleksiModel.findById(conn, id);
            if (!ReschedulleSeleksi) {
                throw new Error('Data tidak ditemukan');
            }
            return ReschedulleSeleksi;
        } finally {
            conn.release();
        }
    }

    /**
     * Update ReschedulleSeleksi
     */
    static async update(id, user, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const peserta = await PesertaSeleksiModel.findById(conn, data.peserta_seleksi_id);
            if (!peserta) {
                throw new Error('Peserta seleksi tidak ditemukan');
            }

            const payload = pickFields(data,ReschedulleSeleksiModel.columns);
            payload.verified_user_id = user.id;
            payload.verified_at = new Date();

            const affected = await ReschedulleSeleksiModel.update(conn, id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();

            return await ReschedulleSeleksiModel.findById(conn, id);


        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

}

module.exports = ReschedulleSeleksiService;
