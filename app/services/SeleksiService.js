// app/services/SeleksiService.js
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const SeleksiModel = require('../models/SeleksiModel');

class SeleksiService {

    /**
     * Ambil semua Seleksi (paging + search)
     */
    static async getAll(query) {
        const page  = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        let whereSql = '';
        let params = [];

        if (query.search) {
            whereSql = `WHERE nama LIKE ?`;
            params.push(`%${query.search}%`);
        }

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

            const SeleksiId = await SeleksiModel.insert(conn, {
                nama: data.nama,
                waktu_mulai: data.waktu_mulai,
                waktu_selesai: data.waktu_selesai,
                prefix_nomor_peserta: data.prefix_nomor_peserta,
                prefix_login: data.prefix_login,
                keterangan: data.keterangan,
                created_at: new Date()
            });

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

            const payload = {};

            if (data.nama !== undefined) payload.nama = data.nama;
            if (data.waktu_mulai !== undefined) payload.waktu_mulai = data.waktu_mulai;
            if (data.waktu_selesai !== undefined) payload.waktu_selesai = data.waktu_selesai;
            if (data.keterangan !== undefined) payload.keterangan = data.keterangan;
            if (data.prefix_login !== undefined) payload.prefix_login = data.prefix_login;
            if (data.prefix_nomor_peserta !== undefined) payload.prefix_nomor_peserta = data.prefix_nomor_peserta;

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
