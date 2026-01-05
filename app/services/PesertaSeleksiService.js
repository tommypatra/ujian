// app/services/PesertaSeleksiService.js
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const PesertaSeleksiModel = require('../models/PesertaSeleksiModel');
const JadwalSeleksiModel = require('../models/JadwalSeleksiModel');

const {pickFields} = require('../helpers/payloadHelper');


class PesertaSeleksiService {

    /**
     * Ambil semua PesertaSeleksi (paging + search)
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

        // search sesi
        if (query.sesi) {
            where.push(`(js.sesi = ?)`);
            params.push(`${query.sesi}`);
        }

        // filter by seleksi_id
        if(seleksi_id){
            where.push(`(p.seleksi_id = ?)`);
            params.push(`${seleksi_id}`);
        }

        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';

        const conn = await db.getConnection();
        try {
            const data  = await PesertaSeleksiModel.findAll(conn, whereSql, params, limit, offset);
            const total = await PesertaSeleksiModel.countAll(conn, whereSql, params);

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
     * Detail PesertaSeleksi
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const PesertaSeleksi = await PesertaSeleksiModel.findById(conn, id);
            if (!PesertaSeleksi) {
                throw new Error('Data tidak ditemukan');
            }
            return PesertaSeleksi;
        } finally {
            conn.release();
        }
    }

    /**
     * Simpan PesertaSeleksi baru
     */
    static async store(data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const jadwalSeleksi = await JadwalSeleksiModel.findById(conn, data.jadwal_seleksi_id);
            if (!jadwalSeleksi) {
                throw new Error('jadwal tidak ditemukan');
            }

            const pesertaSeleksi = await PesertaSeleksiModel.isValidPesertaSeleksi(conn, data.peserta_id, jadwalSeleksi.seleksi_id);
            if (!pesertaSeleksi) {
                throw new Error('peserta tidak ditemukan dalam seleksi ini');
            }
            const payload = pickFields(data,PesertaSeleksiModel.columns);

            const PesertaSeleksiId = await PesertaSeleksiModel.insert(conn,payload);
            await conn.commit();

            return await PesertaSeleksiModel.findById(conn, PesertaSeleksiId);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Update PesertaSeleksi
     */
    static async update(id, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const jadwalSeleksi = await JadwalSeleksiModel.findById(conn, data.jadwal_seleksi_id);
            if (!jadwalSeleksi) {
                throw new Error('jadwal tidak ditemukan');
            }

            console.log(jadwalSeleksi);
            
            const pesertaSeleksi = await PesertaSeleksiModel.isValidPesertaSeleksi(conn, data.peserta_id, jadwalSeleksi.seleksi_id);
            if (!pesertaSeleksi) {
                throw new Error('peserta tidak ditemukan dalam seleksi ini');
            }

            const payload = pickFields(data,PesertaSeleksiModel.columns);

            const affected = await PesertaSeleksiModel.update(conn, id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();

            return await PesertaSeleksiModel.findById(conn, id);


        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Hapus PesertaSeleksi
     */
    static async destroy(id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await PesertaSeleksiModel.deleteById(conn, id);

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

module.exports = PesertaSeleksiService;
