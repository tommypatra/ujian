// app/services/PengawasUjianService.js
const db = require('../../config/database');
const fs = require('fs');
const path = require('path');

const PengawasSeleksiModel = require('../models/PengawasSeleksiModel');
const PesertaSeleksiModel = require('../models/PesertaSeleksiModel');

class PengawasUjianService {

    /**
     * Ambil detail pengawas
     */
    static async getPengawasDetail(pengawas_id){
        const pengawas = await this.findById(pengawas_id);
        if (!pengawas) {
            const e = new Error('maaf data pengawas atau peserta jadwal tidak ditemukan');
            e.statusCode = 404;
            throw e;
        }
        return pengawas;
    }

    static async getAll(dataWeb) {
        const query = dataWeb.query;

        const page  = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        const where = [];
        const params = [];

        const pengawas = await this.getPengawasDetail(dataWeb.user.id);
        const jadwal_seleksi_id = pengawas.jadwal_seleksi_id;

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

        where.push(`js.id = ?`);
        params.push(jadwal_seleksi_id);

        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';
        const options={ 
            select: [
                'ps.id',
                'ps.peserta_id',
                'ps.jadwal_seleksi_id',
                'ps.is_enter',
                'ps.enter_foto',
                'ps.enter_at',
                'ps.is_done',
                'ps.is_allow',
                'ps.allow_at',
                'ps.created_at',
                'ps.updated_at',
                'p.seleksi_id',
                'p.jenis_kelamin',
                'p.hp',
                'p.email',
                'p.nama',
                'p.is_login',
                'p.nomor_peserta',
                'p.foto',
                'p.user_name',
                'p.tanggal_lahir'
            ]
        };

        const conn = await db.getConnection();
        try {
            const data  = await PesertaSeleksiModel.findAll(conn, whereSql, params, limit, offset, options);
            const total = await PesertaSeleksiModel.countAll(conn, whereSql, params);

            return { pengawas, peserta: { data, meta: { page, limit, total } } }

        } finally {
            conn.release();
        }
    }

    /**
     * Detail PengawasUjian
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
     * reset login
     */
    static async resetLogin(peserta_seleksi_id, pengawas_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            //cari dulu apakah peserta ini ada atau tidak
            const peserta = await PesertaSeleksiModel.findById(conn, peserta_seleksi_id, {
                select: ['ps.id', 'ps.enter_foto']
            });
            if (!peserta) {
                throw new Error('Data tidak ditemukan');
            }

            const affected = await PengawasSeleksiModel.resetLogin(conn, peserta_seleksi_id, pengawas_id);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }
            await conn.commit();

            if (peserta.enter_foto) {
                const filePath = path.join(process.cwd(), peserta.enter_foto);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            return await PesertaSeleksiModel.findById(conn, peserta_seleksi_id);
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Validasi peserta
     */
    static async validasiPeserta(peserta_seleksi_id, data, pengawas_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await PengawasSeleksiModel.validasiPeserta(conn, peserta_seleksi_id, pengawas_id, data);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();

            return await PesertaSeleksiModel.findById(conn, peserta_seleksi_id);
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

}

module.exports = PengawasUjianService;
