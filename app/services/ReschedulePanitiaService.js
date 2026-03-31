// app/services/ReschedulePanitiaService.js
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const ReschedulePanitiaModel = require('../models/ReschedulePanitiaModel');
// const PesertaSeleksiModel = require('../models/PesertaSeleksiModel');
// const UserModel = require('../models/UserModel');

const {pickFields} = require('../helpers/payloadHelper');


class ReschedulePanitiaService {

    /**
     * Ambil semua ReschedullePanitia (paging + search)
     */
    static async getAll(dataWeb) {
        const query = dataWeb.query;
        const seleksi_id = parseInt(dataWeb.params.seleksi_id) || null;
        
        const page  = parseInt(query.page) || 1;
        const limit = query.limit != null ? parseInt(query.limit) : 10;
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

        where.push(`(rs.is_kirim = 1)`);

        // filter by status
        if (query.status) {
            where.push(`(rs.status = ?)`);
            params.push(query.status);
        }else{
            where.push(`(rs.status = 'proses')`);
        }

        // filter by status
        if (query.pilih_peserta) { 
            where.push( `
                NOT EXISTS ( 
                SELECT 1 FROM peserta_seleksis ps2 
                INNER JOIN jadwal_seleksis js2 ON js2.id = ps2.jadwal_seleksi_id 
                WHERE ps2.peserta_id = p.id AND js2.status = 'susulan')`
            ); 
        }        
        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';

        const conn = await db.getConnection();
        try {
            const data  = await ReschedulePanitiaModel.findAll(conn, whereSql, params, limit, offset);
            const total = await ReschedulePanitiaModel.countAll(conn, whereSql, params);

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
            const ReschedullePanitia = await ReschedulePanitiaModel.findById(conn, id);
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
    static async validasi(id, user_id, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data, ReschedulePanitiaModel.columns);            
            payload.verified_user_id = user_id;
            payload.verified_at = new Date();


            console.log(payload);
            const affected = await ReschedulePanitiaModel.update(conn, id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();

            return await ReschedulePanitiaModel.findById(conn, id);


        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

}

module.exports = ReschedulePanitiaService;
