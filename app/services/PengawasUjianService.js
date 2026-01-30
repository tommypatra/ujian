// app/services/PengawasUjianService.js
const db = require('../../config/database');
const fs = require('fs');
const path = require('path');

const PengawasSeleksiModel = require('../models/PengawasSeleksiModel');
const PesertaSeleksiModel = require('../models/PesertaSeleksiModel');
const JumlahSoalModel = require('../models/JumlahSoalModel');
const MapingSoalPesertaModel = require('../models/MapingSoalPesertaModel');
const UjianModel = require('../models/UjianModel');


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

        if (query.peserta_seleksi_id) {
            where.push(`ps.id = ?`);
            params.push(query.peserta_seleksi_id);
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
    static async validasiPeserta(seleksi_id, jadwal_seleksi_id, peserta_seleksi_id, pengawas_seleksi_id, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await PengawasSeleksiModel.validasiPeserta(conn, peserta_seleksi_id, jadwal_seleksi_id, pengawas_seleksi_id, data);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            // 1. ambil pengaturan jumlah soal per domain 
            const domains = await JumlahSoalModel.findAllBySeleksiId(conn, seleksi_id);
            for (const d of domains) {
                const soal_domain_id = d.domain_soal_id;
                const required = d.jumlah;

                // console.log(d);
                // 2. hitung soal peserta yang sudah ada
                const existing = await MapingSoalPesertaModel.countSoalPesertaByDomain(
                    conn,
                    peserta_seleksi_id,
                    soal_domain_id
                );

                const need = required - existing;
                // console.log(need, required, existing);
                if (need <= 0) {
                    // keluar dari loop domain soal id tertentu ke domain soal berikutnya atau keluar dari loop
                    continue;
                }

                // 3. cari soal random sesuai kebutuhan
                const soal_random = await MapingSoalPesertaModel.findRandomByDomain(
                    conn,
                    peserta_seleksi_id,
                    seleksi_id,
                    soal_domain_id,
                    need
                );

                // console.log(soal_random);
                for (const soal of soal_random) {                    
                    // 4. insert mapping soal peserta
                    await MapingSoalPesertaModel.insertIgnore(
                        conn, 
                        {
                            peserta_seleksi_id:peserta_seleksi_id,
                            bank_soal_id:soal.id
                        }
                    );

                    // 5. jika pilihan ganda → generate pilihan
                    // sesuaikan ID jenis soal PG
                    // if (soal.kode_jenis === 'PG') {
                    //     await MapingSoalPesertaModel.generatePilihanPeserta(conn, peserta_seleksi_id, soal.id);
                    // }

                    if (soal.kode_jenis === 'PG') {
                        const pilihanOrder = await MapingSoalPesertaModel.generatePilihanOrder(
                            conn,
                            soal.id
                        );
                        
                        await MapingSoalPesertaModel.updatePilihanOrder(
                            conn,
                            peserta_seleksi_id,
                            soal.id,
                            JSON.stringify(pilihanOrder)
                        );
        
                    } 
                    
                }
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

    static async akhiriSesiUjian(pengawas_id, jadwal_seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const result = await UjianModel.akhiriSesiUjian(
                conn,
                jadwal_seleksi_id
            );

            await conn.commit();

            return {
                total_berakhir: result.affectedRows
            };

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }


}

module.exports = PengawasUjianService;
