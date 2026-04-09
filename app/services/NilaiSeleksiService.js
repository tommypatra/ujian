// app/services/NilaiSeleksiService.js
const db = require('../../config/database');
const NilaiSeleksiModel = require('../models/NilaiSeleksiModel');

class NilaiSeleksiService {

    /**
     * Ambil semua NilaiSeleksi (paging + search)
     */
    static async getAll(dataWeb) {
        const query = dataWeb.query;
        const page  = parseInt(query.page) || 1;
        const seleksi_id = parseInt(dataWeb.params.seleksi_id) || null;

        const limit = query.limit != null ? parseInt(query.limit) : 10;
        const offset = (page - 1) * limit;

        const where = [];
        const params = [];

        if (!query.jadwal_seleksi_id) {
            where.push(`(ps.is_valid = 1)`);
        }else{
            where.push(`(ps.jadwal_seleksi_id = ?)`);
            params.push(`${query.jadwal_seleksi_id}`);
        }

        where.push(`(p.seleksi_id LIKE ?)`);
        params.push(`${seleksi_id}`);

        // search umum
        if (query.search) {
            where.push(`(p.nama LIKE ?)`);
            params.push(`%${query.search}%`);
        }

        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';

            const conn = await db.getConnection();
        try {
            const data  = await NilaiSeleksiModel.findAll(conn, whereSql, params, limit, offset);
            const total = await NilaiSeleksiModel.countAll(conn, whereSql, params);

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
     * Detail NilaiSeleksi
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const NilaiSeleksi = await NilaiSeleksiModel.findById(conn, id);
            if (!NilaiSeleksi) {
                throw new Error('Data tidak ditemukan');
            }
            return NilaiSeleksi;
        } finally {
            conn.release();
        }
    }
    
    /**
     * Detail NilaiSeleksi
     */
    static async findAllByKey(peserta_seleksi_ids) {
        const conn = await db.getConnection();
        try {
            console.log(peserta_seleksi_ids)
            const nilaiSeleksi = await NilaiSeleksiModel.findAllByKey(conn, peserta_seleksi_ids);
            if (!nilaiSeleksi) {
                throw new Error('Data tidak ditemukan');
            }
            return nilaiSeleksi;
        } finally {
            conn.release();
        }
    }


}

module.exports = NilaiSeleksiService;
