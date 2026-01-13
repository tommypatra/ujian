// app/services/ReschedullePanitiaService.js
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const ReschedullePanitiaModel = require('../models/ReschedullePanitiaModel');
// const PesertaSeleksiModel = require('../models/PesertaSeleksiModel');
// const UserModel = require('../models/UserModel');

const {pickFields} = require('../helpers/payloadHelper');


class ReschedullePanitiaService {

    /**
     * Ambil semua ReschedullePanitia (paging + search)
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

        where.push(`(p.seleksi_id = ?)`);
        params.push(`${seleksi_id}`);

        // filter by status
        if (query.status) {
            where.push(`(rs.status = ?)`);
            params.push(parseInt(query.status));
        }else{
            where.push(`(rs.status = 'pending')`);
        }


        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';

        const conn = await db.getConnection();
        try {
            const data  = await ReschedullePanitiaModel.findAll(conn, whereSql, params, limit, offset);
            const total = await ReschedullePanitiaModel.countAll(conn, whereSql, params);

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
     * Detail ReschedullePanitia
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const ReschedullePanitia = await ReschedullePanitiaModel.findById(conn, id);
            if (!ReschedullePanitia) {
                throw new Error('Data tidak ditemukan');
            }
            return ReschedullePanitia;
        } finally {
            conn.release();
        }
    }

    /**
     * validasi ReschedullePeserta
     */
    static async validasi(id, user, peserta_seleksi_id, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,ReschedullePanitiaModel.columns);
            
            payload.verified_user_id = user.id;
            payload.peserta_seleksi_id=peserta_seleksi_id;
            payload.verified_at = new Date();

            const affected = await ReschedullePanitiaModel.update(conn, id, peserta_seleksi_id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();

            return await ReschedullePesertaModel.findById(conn, id);


        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

}

module.exports = ReschedullePanitiaService;
