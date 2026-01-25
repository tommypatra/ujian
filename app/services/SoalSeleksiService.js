// app/services/SoalSeleksiService.js
const db = require('../../config/database');
const SoalSeleksiModel = require('../models/SoalSeleksiModel');
const SoalMediaPathModel = require('../models/SoalMediaPathModel');
const BankSoalPilihanModel = require('../models/BankSoalPilihanModel');
const BankSoalModel = require('../models/BankSoalModel');

const {pickFields} = require('../helpers/payloadHelper');

class SoalSeleksiService {

    /**
     * Ambil semua SoalSeleksi (paging + search)
     */
    static async getAll(dataWeb) {
        const query = dataWeb.query;
        const seleksi_id = parseInt(dataWeb.params.seleksi_id) || null;

        const page  = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        const where = [];
        const params = [];

        where.push(`(ss.seleksi_id = ?)`);
        params.push(`${seleksi_id}`);

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
            const data  = await SoalSeleksiModel.findAll(conn, whereSql, params, limit, offset);
            const total = await SoalSeleksiModel.countAll(conn, whereSql, params);
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
     * Detail SoalSeleksi
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const exec_query = await SoalSeleksiModel.findById(conn, id);
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
    static async storeSoalSeleksi(data, user_id, seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,BankSoalModel.columns);
            payload.pembuat_user_id=user_id;
            payload.tahun = payload.tahun ? parseInt(payload.tahun) : new Date().getFullYear();


            const BankSoalId = await BankSoalModel.insert(conn, payload);
            const SoalSeleksiId = await SoalSeleksiModel.insert(conn, {
                bank_soal_id:BankSoalId,
                seleksi_id:seleksi_id
            });

            await conn.commit();

            return await SoalSeleksiModel.findById(conn, SoalSeleksiId);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Simpan SoalSeleksi baru + SoalSeleksi default
     */
    static async store(data, seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,SoalSeleksiModel.columns);

            const cekDomainSoalId = await SoalSeleksiModel.cekDomainSoalId(conn,seleksi_id,payload.bank_soal_id);
            if(!cekDomainSoalId){
                throw new Error('Atur terlebih dahulu jumlah soal untuk domain soal ini');
            }

            const SoalSeleksiId = await SoalSeleksiModel.insert(conn, {
                bank_soal_id:payload.bank_soal_id,
                seleksi_id:seleksi_id
            });

            await conn.commit();

            return await SoalSeleksiModel.findById(conn, SoalSeleksiId);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Update SoalSeleksi
     */
    static async update(id, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,SoalSeleksiModel.columns);

            const cekDomainSoalId = await SoalSeleksiModel.cekDomainSoalId(conn,seleksi_id,payload.bank_soal_id);
            if(!cekDomainSoalId){
                throw new Error('Atur terlebih dahulu jumlah soal untuk domain soal ini');
            }

            const affected = await SoalSeleksiModel.update(conn, id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();
            return await SoalSeleksiModel.findById(conn, id);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Hapus SoalSeleksi + relasi SoalSeleksi
     */
    static async destroy(id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await SoalSeleksiModel.deleteById(conn, id);

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

module.exports = SoalSeleksiService;
