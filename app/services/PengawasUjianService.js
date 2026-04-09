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
    static async getPengawasDetail(jadwal_seleksi_id){
        const conn = await db.getConnection();
        try {
            const exec_query = await PengawasSeleksiModel.detailPengawas(conn, jadwal_seleksi_id);
            if (!exec_query) {
                throw new Error('Data tidak ditemukan');
            }
            return exec_query;
        } finally {
            conn.release();
        }
    }

    static async findJadwalPengawas(req) {
        const user_id = req.user.id;
        const seleksi_id = req.params.seleksi_id;

        const conn = await db.getConnection();
        try {
            const data = await PengawasSeleksiModel.findJadwalPengawas(conn, seleksi_id, user_id);

            if (!data || data.length === 0) {
                throw new Error('Data tidak ditemukan');
            }

            return data;

        } finally {
            conn.release();
        }
    }


    static async getAll(dataWeb) {
        const query = dataWeb.query;

        const page  = parseInt(query.page) || 1;
        const limit = query.limit != null ? parseInt(query.limit) : 10;
        const offset = (page - 1) * limit;

        const where = [];
        const params = [];

        const jadwal_seleksi_id = parseInt(dataWeb.params.jadwal_seleksi_id) || null;

        const pengawas = await this.getPengawasDetail(jadwal_seleksi_id);
        if(!pengawas){
            throw new Error('Data tidak ditemukan');
        }
            
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
                'ps.media_path_id',
                'mp.uuid',
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
                'p.tanggal_lahir',
                'total_dijawab',
                'total_soal',
                'nilai',
            ]
        };

        const conn = await db.getConnection();
        try {
            const data  = await PesertaSeleksiModel.findAll(conn, whereSql, params, limit, offset);
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

    static async resetLogin(peserta_seleksi_id, user_id) {

        const conn = await db.getConnection();

        try {

            await conn.beginTransaction();

            console.log('cari peserta pengawas', peserta_seleksi_id, user_id);

            const peserta = await PesertaSeleksiModel.cariPesertaPengawas(
                conn,
                peserta_seleksi_id,
                user_id
            );

            if (!peserta) {
                throw new Error('Data tidak ditemukan');
            }

            const affected = await PengawasSeleksiModel.resetLogin(
                conn,
                peserta_seleksi_id,
                user_id
            );

            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();

            // ambil data terbaru
            const data = await PesertaSeleksiModel.findById(
                conn,
                peserta_seleksi_id
            );

            // hapus foto setelah commit
            if (peserta.path) {

                const filePath = path.join(process.cwd(), peserta.path);

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }

            }

            return data;

        } catch (err) {

            await conn.rollback();
            throw err;

        } finally {

            conn.release();

        }

    }
    
    static async pembagianSoal(conn, seleksi_id, peserta_seleksi_id) {

        // kalau sudah ada soal → skip (hindari double generate)
        const total = await MapingSoalPesertaModel.countAllByPeserta(conn, peserta_seleksi_id);
        if (total > 0) {
            return;
        }

        // 1. ambil pengaturan jumlah soal per domain 
        const domains = await JumlahSoalModel.findAllBySeleksiId(conn, seleksi_id);

        for (const d of domains) {
            const soal_domain_id = d.domain_soal_id;
            const required = d.jumlah;

            // 2. hitung soal peserta yang sudah ada
            const existing = await MapingSoalPesertaModel.countSoalPesertaByDomain(
                conn,
                peserta_seleksi_id,
                soal_domain_id
            );

            const need = required - existing;
            if (need <= 0) continue;

            // 3. cari soal random sesuai kebutuhan
            const soal_random = await MapingSoalPesertaModel.findRandomByDomain(
                conn,
                peserta_seleksi_id,
                seleksi_id,
                soal_domain_id,
                need
            );

            // VALIDASI (penting)
            if (!soal_random || soal_random.length === 0) {
                throw new Error(`Soal domain ${soal_domain_id} tidak tersedia`);
            }

            for (const soal of soal_random) {
                // 4. insert mapping soal peserta
                await MapingSoalPesertaModel.insertIgnore(conn, {
                    peserta_seleksi_id,
                    bank_soal_id: soal.id
                });

                // 5. jika pilihan ganda maka generate pilihan
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
    }

    /**
     * Validasi peserta
     */
    static async validasiPeserta(seleksi_id, peserta_seleksi_id, pengawas_seleksi_id, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            // console.log('data',data)
    
            const affected = await PengawasSeleksiModel.validasiPeserta(conn, peserta_seleksi_id, pengawas_seleksi_id, data);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await this.pembagianSoal(conn, seleksi_id, peserta_seleksi_id);

            await conn.commit();
            return await PesertaSeleksiModel.findById(conn, peserta_seleksi_id);
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    static async akhiriPesertaSesiUjian(jadwal_seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const result = await UjianModel.akhiriPesertaSesiUjian(
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

    static async mulaiJadwalUjian(pengawas_id, jadwal_seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const result = await UjianModel.mulaiJadwalUjian(
                conn,
                jadwal_seleksi_id,
                pengawas_id
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


    static async selesaiJadwalUjian(pengawas_id, jadwal_seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const result = await UjianModel.selesaiJadwalUjian(
                conn,
                jadwal_seleksi_id,
                pengawas_id            
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
