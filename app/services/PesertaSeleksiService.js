// app/services/PesertaSeleksiService.js
const db = require('../../config/database');
const fs = require('fs');
const path = require('path');
const PesertaSeleksiModel = require('../models/PesertaSeleksiModel');
const JadwalSeleksiModel = require('../models/JadwalSeleksiModel');
const MediaPathModel = require('../models/MediaPathModel');
const MediaPathService = require('../services/MediaPathService');
const PengawasUjianService = require('../services/PengawasUjianService');

const ReschedulePesertaModel = require('../models/ReschedulePesertaModel');

const { pickFields } = require('../helpers/payloadHelper');

class PesertaSeleksiService {

    /**
     * Ambil semua PesertaSeleksi (paging + search)
     */
    static async getAll(dataWeb) {
        const query = dataWeb.query;
        const seleksi_id = parseInt(dataWeb.params.seleksi_id) || null;

        const page  = parseInt(query.page) || 1;
        const limit = query.limit != null ? parseInt(query.limit) : 10;
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

        if (query.jadwal_seleksi_id) {
            where.push(`js.id = ?`);
            params.push(query.jadwal_seleksi_id);
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


    static async dataPeserta(peserta_id) {
        const conn = await db.getConnection();
        try {
            const row = await PesertaSeleksiModel.dataPeserta(conn, peserta_id);
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
    

    static async validasiPesertaSeleksi(peserta_id,peserta_seleksi_id) {
        const conn = await db.getConnection();
        try {
            const isValidPesertaSeleksi = await PesertaSeleksiModel._validasiPesertaSeleksi(conn, peserta_id, peserta_seleksi_id);
            if(!isValidPesertaSeleksi){
                throw new Error('Anda tidak memiliki akses ke seleksi ini');
            }
            return isValidPesertaSeleksi;
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
     * Simpan PesertaSeleksi bulk baru
     */

    static async storeBulk(data, seleksi_id) {
        const conn = await db.getConnection();

        try {
            await conn.beginTransaction();

            const { peserta_ids, jadwal_seleksi_id } = data;
        
            // =====================
            // VALIDASI JADWAL
            // =====================
            const isValidJadwal = await JadwalSeleksiModel._isValidJadwalSeleksi(
                conn,
                jadwal_seleksi_id,
                seleksi_id
            );

            if (!isValidJadwal) {
                throw new Error('Jadwal tidak valid');
            }

            // =====================
            // AMBIL DATA PESERTA (MODEL)
            // =====================
            // console.log(peserta_ids);
            const rows = await PesertaSeleksiModel.getPesertaByPesertaSeleksiIds(
                conn,
                peserta_ids
            );

            if (!rows.length) {
                throw new Error('Data peserta tidak ditemukan');
            }

            // =====================
            // SIAPKAN VALUES
            // =====================
            const values = rows.map(r => [
                r.peserta_id,
                jadwal_seleksi_id
            ]);

            // =====================
            // BULK INSERT (IGNORE DUPLICATE)
            // =====================
            const inserted = await PesertaSeleksiModel.insertBulkIgnore(conn, values);

            await conn.commit();

            return {
                total: values.length,
                inserted,
                skipped: values.length - inserted
            };

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

            const isValidPesertaSeleksi = await PesertaSeleksiModel._isValidPesertaSeleksi(conn, payload.peserta_id, seleksi_id)
            const isValidJadwalSeleksi = await JadwalSeleksiModel._isValidJadwalSeleksi(conn, payload.jadwal_seleksi_id, seleksi_id)

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


    static async enterUjian(peserta_seleksi_id, data) {
        const conn = await db.getConnection();
        const uploadedPath = data?.enter_foto;

        try {
            await conn.beginTransaction();
            if (!uploadedPath) {
                throw new Error('Foto enter ujian wajib ada');
            }

            const seleksi = await ReschedulePesertaModel.cariInfoSeleksi(conn, peserta_seleksi_id);
            if (!seleksi) {
                throw new Error('Data tidak ditemukan');
            }

            const uuid = await MediaPathService.generateUniqueKey(conn);
            const media_path_id = await MediaPathModel.insert(conn, {
                judul:'Foto Enter Ujian',
                path: uploadedPath,
                jenis:'gambar',
                uuid
            });

            const affected = await PesertaSeleksiModel.enterUjian(
                conn, 
                seleksi.peserta_id, 
                seleksi.jadwal_seleksi_id, 
                seleksi.wajib_validasi_foto, 
                media_path_id
            );
            if (affected === 0) {
                throw new Error('proses enter ujian gagal dilakukan');
            }

            let validasiPeserta = {};
            if(!seleksi.wajib_validasi_foto){
                validasiPeserta = await PengawasUjianService.pembagianSoal(
                    conn, 
                    seleksi.seleksi_id, 
                    seleksi.peserta_seleksi_id
                );
            }
            await conn.commit();            
            return { success: true, validasiPeserta };
        } catch (err) {
            await conn.rollback();
            if (uploadedPath) {
                const filePath = path.join(process.cwd(), uploadedPath);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            throw err;
        } finally {
            conn.release();
        }
    }    

}

module.exports = PesertaSeleksiService;
