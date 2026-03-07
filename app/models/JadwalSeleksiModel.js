// app/models/JadwalSeleksiModel.js
const BaseModel = require('./BaseModel');

class JadwalSeleksiModel extends BaseModel {

    /* =======================
     * TABLE CONFIG
     * ======================= */
    static tableName = 'jadwal_seleksis';
    static tableAlias = 'js';

    static selectFields = `
        js.id,
        js.seleksi_id,
        js.sesi,
        js.tanggal,
        js.lokasi_ujian,
        js.jam_mulai,
        js.jam_selesai,
        js.status,
        js.created_at,
        js.updated_at,
        s.nama,
        s.waktu_mulai,
        s.waktu_selesai,
        s.prefix_app,
        s.tahun,
        s.keterangan
    `;

    static joinTables = `
        LEFT JOIN seleksis s ON s.id = js.seleksi_id
    `;

    static countColumns = 'COUNT(js.id)';

    static orderBy = `
        ORDER BY
            s.tahun DESC,
            s.waktu_mulai DESC,
            js.sesi ASC,
            js.tanggal ASC,
            js.jam_mulai ASC,
            js.lokasi_ujian
    `;

    static columns = [
        'seleksi_id',
        'sesi',
        'tanggal',
        'jam_mulai',
        'jam_selesai',
        'lokasi_ujian',
        'status'
    ];

    static allowedFields = [
        'js.id',
        'js.sesi'
    ];


    // untuk cek apakah jadwal seleksi tersebut memiliki seleksi_id tertentu untuk validasi
    static async _isValidJadwalSeleksi(conn, jadwal_seleksi_id, seleksi_id) {
        const [[result]] = await conn.query(
            `SELECT id FROM jadwal_seleksis
            WHERE id = ? AND seleksi_id = ? 
            LIMIT 1`,
            [jadwal_seleksi_id, seleksi_id]
        );
        return !!result;
    }
    


    /* =======================
     * READ
     * ======================= */

    static async findById(conn, id) {
        return super.findByKey(conn, 'js.id', id);
    }

    static async findBySesi(conn, sesi) {
        return super.findAllByKey(conn, 'js.sesi', [sesi]);
    }

    static async findAll(conn, whereSql = '', params = [], limit = 10, offset = 0) {
        return super.findAll(conn, whereSql, params, limit, offset);
    }

    static async countAll(conn, whereSql = '', params = []) {
        return super.countAll(conn, whereSql, params);
    }

    /* =======================
     * WRITE (AMAN)
     * ======================= */

    // INSERT (seleksi_id DIKUNCI dari service)
    static async insert(conn, data) {
        return super.insert(conn, data);
    }

    // UPDATE by id + seleksi_id (ANTI IDOR)
    static async updateByKeys(conn, id, seleksi_id, data) {
        return super.updateByKeys(
            conn,
            ['id', 'seleksi_id'],
            [id, seleksi_id],
            data
        );
    }

    // DELETE by id + seleksi_id (ANTI IDOR)
    static async deleteByKeys(conn, id, seleksi_id) {
        return super.deleteByKeys(
            conn,
            ['id', 'seleksi_id'],
            [id, seleksi_id]
        );
    }


    /**
     * Cari id jadwal berdasarkan seleksi_id dan array sesi
     */
    static async cariIdJadwal(conn, seleksi_id, sesiList = []) {
        if (!sesiList.length) return [];
        const [rows] = await conn.query(
            `SELECT id, sesi 
            FROM jadwal_seleksis 
            WHERE seleksi_id = ? 
            AND sesi IN (?)`,
            [seleksi_id, sesiList]
        );
        return rows;
    }

    static async jumlahJadwal(conn, seleksi_id) {
        const [[row]] = await conn.query(
            `SELECT COUNT(*) AS total
            FROM jadwal_seleksis
            WHERE seleksi_id = ?`,
            [seleksi_id]
        );

        return row.total;
    }
    
}

module.exports = JadwalSeleksiModel;
