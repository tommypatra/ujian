// app/services/BankSoalService.js
const db = require('../../config/database');
const BankSoalModel = require('../models/BankSoalModel');
const SoalSeleksiModel = require('../models/SoalSeleksiModel');
const SoalMediaPathModel = require('../models/SoalMediaPathModel');
const BankSoalPilihanModel = require('../models/BankSoalPilihanModel');

const {pickFields} = require('../helpers/payloadHelper');

class BankSoalService {

    /**
     * Ambil semua BankSoal dan pilihan ganda (paging + search)
     */
    static async getAll(dataWeb) {
        const query = dataWeb.query;

        const page  = parseInt(query.page) || 1;
        const limit = query.limit != null ? parseInt(query.limit) : 10;
        const offset = (page - 1) * limit;

        const where = [];
        const params = [];

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

            if (data.length) {
                const soalIds = data.map(s => s.id);

                // media
                const mediaList = await SoalMediaPathModel.findAllByBankSoalId(conn, soalIds);
                const mediaMap = {};
                for (const m of mediaList) {
                    if (!mediaMap[m.bank_soal_id]) 
                        mediaMap[m.bank_soal_id] = [];

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

                finalData = await Promise.all(finalData.map(async (s) => {
                    s.opsi_pilihan_ganda = [];

                    if (s.kode_soal === 'PG') {
                        // s.opsi_pilihan_ganda = await BankSoalPilihanModel.findAllBySoalId(conn, s.id, {random:true});
                        s.opsi_pilihan_ganda = await BankSoalPilihanModel.findAllBySoalId(conn, s.id);
                    }
                    return s;
                }));
            }

            return {
                data: finalData,
                meta: { page, limit, total }
            };


        } finally {
            conn.release();
        }
    }

    /**
     * Detail BankSoal
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const soal = await BankSoalModel.findById(conn, id);
            if (!soal) {
                throw new Error('Data tidak ditemukan');
            }

            // 1) media
            const mediaList = await SoalMediaPathModel.findAllByBankSoalId(conn, [soal.id]);
            soal.media = mediaList.map(m => ({
                id: m.id,
                judul: m.judul,
                path: m.path,
                jenis: m.jenis,
            }));

            // 2) pilihan ganda (kalau PG)
            soal.opsi_pilihan_ganda = [];
            if (soal.kode_soal === 'PG') {
                soal.opsi_pilihan_ganda = await BankSoalPilihanModel.findAllBySoalId(conn, soal.id);
            }
            return soal;
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
            payload.tahun = payload.tahun ? parseInt(payload.tahun) : new Date().getFullYear();


            const BankSoalId = await BankSoalModel.insert(conn, payload);

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

            const affected = await BankSoalModel.update(conn, id, user_id, payload);
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
    static async destroy(id,user_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await BankSoalModel.deleteById(conn, id,user_id);

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

module.exports = BankSoalService;
