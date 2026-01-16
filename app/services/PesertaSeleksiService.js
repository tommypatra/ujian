// app/services/PesertaSeleksiService.js
const db = require('../../config/database');
const PesertaSeleksiModel = require('../models/PesertaSeleksiModel');
const JadwalSeleksiModel = require('../models/JadwalSeleksiModel');

const { pickFields } = require('../helpers/payloadHelper');

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

        if (query.search) {
            where.push(`
                (
                    p.email LIKE ?
                    OR p.nama LIKE ?
                    OR p.nomor_peserta LIKE ?
                    OR p.hp LIKE ?
                )
            `);
            params.push(
                `%${query.search}%`,
                `%${query.search}%`,
                `%${query.search}%`,
                `%${query.search}%`
            );
        }

        if (query.sesi) {
            where.push(`js.sesi = ?`);
            params.push(query.sesi);
        }

        where.push(`p.seleksi_id = ?`);
        params.push(seleksi_id);

        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';

        const conn = await db.getConnection();
        try {
            const data  = await PesertaSeleksiModel.findAll(conn, whereSql, params, limit, offset);
            const total = await PesertaSeleksiModel.countAll(conn, whereSql, params);

            return {
                data,
                meta: { page, limit, total }
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
            const row = await PesertaSeleksiModel.findById(conn, id);
            if (!row) {
                throw new Error('Data tidak ditemukan');
            }
            return row;
        } finally {
            conn.release();
        }
    }

    static async findAllByPesertaId(peserta_id) {
        const conn = await db.getConnection();
        try {
            const row = await PesertaSeleksiModel.findAllByPesertaId(conn, peserta_id);
            if (!row) {
                throw new Error('Data tidak ditemukan');
            }
            return row;
        } finally {
            conn.release();
        }
    }
    

    /**
     * Simpan PesertaSeleksi baru
     */
    static async store(data, seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data, PesertaSeleksiModel.columns);
            payload.seleksi_id = seleksi_id;

            const isValidPesertaSeleksi = await PesertaSeleksiModel._isValidPesertaSeleksi(conn, payload.peserta_id, seleksi_id)
            const isValidJadwalSeleksi = await JadwalSeleksiModel._isValidJadwalSeleksi(conn, payload.jadwal_seleksi_id, seleksi_id)

            if(!isValidPesertaSeleksi){
                throw new Error('Peserta tersebut tidak ditemukan dalam seleksi ini');
            }else if(!isValidJadwalSeleksi){
                throw new Error('Jadwal tersebut tidak ditemukan dalam seleksi ini');
            }

            const id = await PesertaSeleksiModel.insert(conn, payload);

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
     * Update PesertaSeleksi (AMAN)
     */
    static async update(id, data, seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data, PesertaSeleksiModel.columns);

            const isValidPesertaSeleksi = await PesertaSeleksiModel.isValidPesertaSeleksi(conn, payload.peserta_id, seleksi_id)
            const isValidJadwalSeleksi = await PesertaSeleksiModel.isValidJadwalSeleksi(conn, payload.jadwal_seleksi_id, seleksi_id)

            if(!isValidPesertaSeleksi){
                throw new Error('Peserta tersebut tidak ditemukan dalam seleksi ini');
            }else if(!isValidJadwalSeleksi){
                throw new Error('Jadwal tersebut tidak ditemukan dalam seleksi ini');
            }

            const affected =
                await PesertaSeleksiModel.update(
                    conn,
                    id,
                    payload,
                    seleksi_id
                );

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
     * Hapus PesertaSeleksi (AMAN)
     */
    static async destroy(id, seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected =
                await PesertaSeleksiModel.delete(
                    conn,
                    id,
                    seleksi_id
                );

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
