// app/services/ReschedullePesertaService.js
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const ReschedullePesertaModel = require('../models/ReschedullePesertaModel');
// const PesertaSeleksiModel = require('../models/PesertaSeleksiModel');
// const UserModel = require('../models/UserModel');

const {pickFields} = require('../helpers/payloadHelper');


class ReschedullePesertaService {

    /**
     * Ambil semua ReschedullePeserta (paging + search)
     */
    static async getAll(dataWeb) {
        const query = dataWeb.query;
        const peserta_seleksi_id = parseInt(dataWeb.params.peserta_seleksi_id) || null;
        
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

        where.push(`(ps.id = ?)`);
        params.push(`${peserta_seleksi_id}`);

        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';

        const conn = await db.getConnection();
        try {
            const data  = await ReschedullePesertaModel.findAll(conn, whereSql, params, limit, offset);
            const total = await ReschedullePesertaModel.countAll(conn, whereSql, params);

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
     * Detail ReschedullePeserta
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const ReschedullePeserta = await ReschedullePesertaModel.findById(conn, id);
            if (!ReschedullePeserta) {
                throw new Error('Data tidak ditemukan');
            }
            return ReschedullePeserta;
        } finally {
            conn.release();
        }
    }

    /**
     * Simpan ReschedullePeserta baru
     */
    static async store(data,peserta_seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,ReschedullePesertaModel.columns);

            const ReschedullePesertaId = await ReschedullePesertaModel.insert(conn,payload);
            await conn.commit();

            return await ReschedullePesertaModel.findById(conn, ReschedullePesertaId);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Update ReschedullePeserta
     */
    static async update(id, data, peserta_seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,ReschedullePesertaModel.columns);

            const affected = await ReschedullePesertaModel.update(conn, id, peserta_seleksi_id, payload);
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



    /**
     * Hapus ReschedullePeserta
     */
    static async destroy(id,peserta_seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await ReschedullePesertaModel.delete(conn, id,peserta_seleksi_id);

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

module.exports = ReschedullePesertaService;
