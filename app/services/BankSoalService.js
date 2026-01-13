// app/services/BankSoalService.js
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const BankSoalModel = require('../models/BankSoalModel');
const SoalSeleksiModel = require('../models/SoalSeleksiModel');
const SoalMediaPathModel = require('../models/SoalMediaPathModel');

const {pickFields} = require('../helpers/payloadHelper');

class BankSoalService {

    /**
     * Ambil semua BankSoal (paging + search)
     */
    static async getAll(dataWeb) {
        const query = dataWeb.query;
        const seleksi_id = parseInt(dataWeb.params.seleksi_id) || null;

        const page  = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        const where = [];
        const params = [];

        if(seleksi_id){
            where.push(`(ss.seleksi_id = ?)`);
            params.push(`${seleksi_id}`);
        }

        // search umum
        if (query.search) {
            where.push(`(b.pertanyaan LIKE ? OR u.name LIKE ?)`);
            params.push(`%${query.search}%`);
            params.push(`%${query.search}%`);
        }

        // filter by jenis_soal_id
        if (query.jenis_soal_id) {
            where.push(`(b.jenis_soal_id = ?)`);
            params.push(parseInt(query.jenis_soal_id));
        }

        // filter by tahun
        if (query.tahun) {
            where.push(`(b.tahun = ?)`);
            params.push(query.tahun);
        }

        // filter by domain_soal_id
        if (query.domain_soal_id) {
            where.push(`(b.domain_soal_id = ?)`);
            params.push(query.domain_soal_id);
        }

        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';

        const conn = await db.getConnection();
        try {
            const data  = await BankSoalModel.findAll(conn, whereSql, params, limit, offset);
            const total = await BankSoalModel.countAll(conn, whereSql, params);

            let finalData = data;
            if(data.length){
                const soalIds = data.map(s => s.id);
                const mediaList = await SoalMediaPathModel.findAllByBankSoalId(conn,soalIds);
                const mediaMap = {};
                        for (const m of mediaList) {
                            if (!mediaMap[m.bank_soal_id]) {
                                mediaMap[m.bank_soal_id] = [];
                            }
                            mediaMap[m.bank_soal_id].push({
                                id: m.id,
                                judul: m.judul,
                                path: m.path,
                                jenis: m.jenis
                            });
                        }

                        finalData = data.map(s => ({
                            ...s,
                            media: mediaMap[s.id] || []
                        }));
            }

            return {
                finalData,
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
     * Detail BankSoal
     */
    static async findById(id, seleksi_id) {
        const conn = await db.getConnection();
        try {
            const exec_query = await BankSoalModel.findById(conn, id, seleksi_id);
            if (!exec_query) {
                throw new Error('Data tidak ditemukan');
            }
            return exec_query;
        } finally {
            conn.release();
        }
    }

    /**
     * Simpan BankSoal baru + BankSoal default
     */
    static async store(data, user_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,BankSoalModel.columns);
            payload.pembuat_user_id=user_id;

            const BankSoalId = await BankSoalModel.insert(conn, payload);
            const SoalSeleksiId = await SoalSeleksiModel.insert(conn, {
                bank_soal_id:BankSoalId,
                seleksi_id:data.seleksi_id
            });

            await conn.commit();

            return await BankSoalModel.findById(conn, BankSoalId);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Update BankSoal
     */
    static async update(id, data, user_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,BankSoalModel.columns);
            payload.pembuat_user_id=user_id;

            const affected = await BankSoalModel.update(conn, id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();
            return await BankSoalModel.findById(conn, id);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Hapus BankSoal + relasi BankSoal
     */
    static async destroy(id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await BankSoalModel.deleteById(conn, id);

            if (affected === 0) {
                throw new Error('Data tidak ditemukan');
            }

            await conn.commit();
            return { id };

        } catch (err) {
            await conn.rollback();

            // FK constraint (referensi tidak ditemukan)
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                // ambil nama foreign key
                const match = err.message.match(/FOREIGN KEY \(`(.+?)`\)/);
                const field = match ? match[1] : 'referensi';

                throw new Error(`Referensi ${field} tidak ditemukan`);
            }

            throw err;
        } finally {
            conn.release();
        }
    }
}

module.exports = BankSoalService;
