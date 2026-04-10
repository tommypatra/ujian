// app/models/NilaiSeleksiModel.js
const BaseModel = require('./BaseModel');

class NilaiSeleksiModel extends BaseModel {

    /* =======================
     * TABLE CONFIG
     * ======================= */
    static tableName = 'peserta_seleksis';
    static tableAlias = 'ps';

    static selectFields = `
        p.id AS peserta_id,
        p.nama,
        p.nomor_peserta,
        p.tanggal_lahir,
        COUNT(CASE WHEN bsp.is_benar = 1 THEN 1 END) AS jumlah_benar,
        COUNT(CASE WHEN bsp.is_benar = 0 THEN 1 END) AS jumlah_salah,
        ps.id as peserta_seleksi_id,
        p.is_login,
        ps.is_enter,
        ps.is_allow,
        ps.is_done,
        ps.is_valid,

        ps.total_dijawab,
        ps.total_soal,
        ROUND(
            (ps.total_benar / ps.total_soal) * 100
        ,2) AS nilai,
        js.status
    `;

    static joinTables = `
        JOIN jadwal_seleksis js ON js.id = ps.jadwal_seleksi_id
        JOIN pesertas p ON p.id = ps.peserta_id
        LEFT JOIN jawaban_pesertas mpp ON mpp.peserta_seleksi_id = ps.id
        LEFT JOIN bank_soal_pilihans bsp ON bsp.id = mpp.bank_soal_pilihan_id`;

    static countColumns = 'COUNT(*)';
    static orderBy = 'ORDER BY p.nama ASC';
    static groupBy = 'ps.id';

    static columns = [
    ];
        'p.nama'

    static allowedFields = [
        'p.id',
        'ps.id',
        'p.seleksi_id',
    ];

    /**
     * cari berdasarkan id
     */
    static async findById(conn, id) {
        return super.findByKey(conn, 'ps.id', id);
    }

    static async findAllByKey(conn, peserta_seleksi_ids) {
        return super.findAllByKey(conn, 'ps.id', peserta_seleksi_ids);
    }

    /**
     * Ambil data (paged)
     */
    static async findAll(conn, whereSql = '', params = [], limit = 10, offset = 0) {
        return super.findAll(conn, whereSql, params, limit, offset);
    }

    /**
     * Hitung total (untuk pagination)
     */
    static async countAll(conn, whereSql = '', params = []) {
        return super.countAll(conn, whereSql, params);
    }

}

module.exports = NilaiSeleksiModel;
