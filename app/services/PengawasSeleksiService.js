// app/services/PengawasSeleksiService.js
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const PengawasSeleksiModel = require('../models/PengawasSeleksiModel');
const {pickFields} = require('../helpers/payloadHelper');
const JadwalSeleksiModel = require('../models/JadwalSeleksiModel');

class PengawasSeleksiService {

    /**
     * Ambil semua PengawasSeleksi (paging + search)
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
            where.push(`(ps.name LIKE ? OR ps.user_name LIKE ? OR js.lokasi_ujian LIKE ?)`);
            params.push(`%${query.search}%`);
            params.push(`%${query.search}%`);
            params.push(`%${query.search}%`);
        }

        where.push(`(js.seleksi_id = ?)`);
        params.push(`${seleksi_id}`);

        // filter by sesi
        if (query.sesi) {
            where.push(`(js.sesi = ?)`);
            params.push(parseInt(query.sesi));
        }

        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';

        const conn = await db.getConnection();
        try {
            const data  = await PengawasSeleksiModel.findAll(conn, whereSql, params, limit, offset);
            const total = await PengawasSeleksiModel.countAll(conn, whereSql, params);

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
     * Detail PengawasSeleksi
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const exec_query = await PengawasSeleksiModel.findById(conn, id);
            if (!exec_query) {
                throw new Error('Data tidak ditemukan');
            }
            return exec_query;
        } finally {
            conn.release();
        }
    }


    /**
     * Simpan PengawasSeleksi baru
     */
    static async store(data,seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            const payload = pickFields(data,PengawasSeleksiModel.columns);

            if(JadwalSeleksiModel._isValidJadwalSeleksi(conn,payload.jadwal_seleksi_id,seleksi_id)){
                throw new Error('jadwal tidak ditemukan pada seleksi tersebut');
            }

            let plainPassword = payload.password;
            if(!payload.password){
                plainPassword = String(Math.floor(100000 + Math.random() * 900000));
            }
            payload.password = await bcrypt.hash(plainPassword, 10);

            const PengawasSeleksiId = await PengawasSeleksiModel.insert(conn, payload);

            await conn.commit();

            const result = await PengawasSeleksiModel.findById(conn, PengawasSeleksiId);

            return {
                ...result,
                password_plain: plainPassword
            };            

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Update PengawasSeleksi
     */
    static async update(id, data, seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,PengawasSeleksiModel.columns);
            let plainPassword='';
            if (data.password && data.password.trim() !== '') {
                plainPassword=data.password;
                payload.password = await bcrypt.hash(plainPassword, 10);
            }

            const affected = await PengawasSeleksiModel.update(conn, id, seleksi_id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();

            const result = await PengawasSeleksiModel.findById(conn, id);

            return {
                ...result,
                password: plainPassword
            };            

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Hapus PengawasSeleksi + relasi PengawasSeleksi
     */
    static async destroy(id,seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await PengawasSeleksiModel.deleteById(conn, id,seleksi_id);

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

module.exports = PengawasSeleksiService;
