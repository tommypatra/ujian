// app/services/JadwalSeleksiService.js
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const JadwalSeleksiModel = require('../models/JadwalSeleksiModel');
const PengawasSeleksiModel = require('../models/PengawasSeleksiModel');
const SeleksiModel = require('../models/SeleksiModel');

const {pickFields} = require('../helpers/payloadHelper');
const {generatePassword} = require('../helpers/webHelper');


class JadwalSeleksiService {
    /* =========================
     * INTERNAL HELPER
     * ========================= */

    static async _buildPengawasMap(conn, jadwalIds = []) {
        if (!Array.isArray(jadwalIds) || jadwalIds.length === 0) return {};

        const pengawasRows = await PengawasSeleksiModel.findByJadwalIds(conn, jadwalIds);

        const mapPengawas = {};
        for (const p of pengawasRows) {
            if (!mapPengawas[p.jadwal_seleksi_id]) {
                mapPengawas[p.jadwal_seleksi_id] = [];
            }
            mapPengawas[p.jadwal_seleksi_id].push(p);
        }

        return mapPengawas;
    }

    static async _attachPengawas(conn, jadwalData) {
        // kalau null / kosong
        if (!jadwalData) return jadwalData;

        // kalau object tunggal (findById)
        if (!Array.isArray(jadwalData)) {
            const mapPengawas = await this._buildPengawasMap(conn, [jadwalData.id]);
            return {
                ...jadwalData,
                pengawas: mapPengawas[jadwalData.id] || []
            };
        }

        // kalau array (getAll / findBySesi)
        const jadwalIds = jadwalData.map(j => j.id);
        const mapPengawas = await this._buildPengawasMap(conn, jadwalIds);

        return jadwalData.map(j => ({
            ...j,
            pengawas: mapPengawas[j.id] || []
        }));
    }    

    /**
     * Ambil semua JadwalSeleksi (paging + search)
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
            where.push(`(s.nama LIKE ?)`);
            params.push(`%${query.search}%`);
        }

        where.push(`(js.seleksi_id = ?)`);
        params.push(`${seleksi_id}`);

        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';

        const conn = await db.getConnection();
        try {
            const data  = await JadwalSeleksiModel.findAll(conn, whereSql, params, limit, offset);
            const total = await JadwalSeleksiModel.countAll(conn, whereSql, params);

            const result = await this._attachPengawas(conn, data);    

            return {
                data:result,
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
     * Detail JadwalSeleksi
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const jadwal = await JadwalSeleksiModel.findById(conn, id);
            if (!jadwal) {
                throw new Error('Data tidak ditemukan');
            }

            return await this._attachPengawas(conn, jadwal);

        } finally {
            conn.release();
        }
    }

    /**
     * Detail JadwalSeleksi
     */
    static async findBySesi(sesi) {
        const conn = await db.getConnection();
        try {
            const jadwal = await JadwalSeleksiModel.findBySesi(conn, sesi);
            if (!jadwal) {
                throw new Error('Data tidak ditemukan');
            }

            return await this._attachPengawas(conn, jadwal);

        } finally {
            conn.release();
        }
    }

    /**
     * Simpan JadwalSeleksi baru + pengawas default
     */
    static async store(data,seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,JadwalSeleksiModel.columns);
            payload.seleksi_id=seleksi_id;

            const JadwalSeleksiId = await JadwalSeleksiModel.insert(conn,payload);

            const seleksi = await SeleksiModel.findById(conn,seleksi_id);

            //generate pengawas
            const prefix = seleksi.prefix_app;
            const lastUsername = await PengawasSeleksiModel.findLastUsername(conn, seleksi_id);

            let urutan = 1;
            if (lastUsername) {
                const regex = new RegExp(`^${prefix}(\\d+)$`);
                const match = lastUsername.match(regex);
                if (match) {
                    urutan = parseInt(match[1], 10) + 1;
                }
            }

            const userName = `${prefix}${String(urutan).padStart(3, '0')}`;            
            const plainPassword = generatePassword();

            const payloadPengawas = {
                jadwal_seleksi_id:JadwalSeleksiId,
                name:`Pengawas ${userName}`,
                user_name:userName,
                password: await bcrypt.hash(plainPassword, 10)
            };

            const PengawasJadwaliId = await PengawasSeleksiModel.insert(conn,payloadPengawas);


            await conn.commit();

            const dataJadwal = await JadwalSeleksiModel.findById(conn, JadwalSeleksiId);
            const dataPengawas = await PengawasSeleksiModel.findById(conn, PengawasJadwaliId);

            return {
                jadwal : dataJadwal,
                pengawas : dataPengawas,
                password_pengawas: plainPassword
            };            

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Update JadwalSeleksi
     */
    static async update(id, data, seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            const payload = pickFields(data,JadwalSeleksiModel.columns);
            payload.seleksi_id=seleksi_id;

            // const affected = await JadwalSeleksiModel.update(conn, id, payload);
            const affected = await JadwalSeleksiModel.updateByKeys(conn, id,seleksi_id, payload);

            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();
            return await JadwalSeleksiModel.findById(conn, id);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Hapus JadwalSeleksi + relasi JadwalSeleksi
     */
    static async destroy(id,seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            // const hapus1 = await PengawasSeleksiModel.deleteByKey(conn, 'jadwal_seleksi_id',id);

            const affected = await JadwalSeleksiModel.deleteByKeys(conn, id,seleksi_id);

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

module.exports = JadwalSeleksiService;
