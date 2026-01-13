// app/models/SeleksiModel.js
const BaseModel = require('./BaseModel');

class SeleksiModel extends BaseModel {

    /* =======================
     * TABLE CONFIG
     * ======================= */
    static tableName = 'seleksis';
    static tableAlias = '';

    static selectFields = `
        id,
        nama,
        waktu_mulai,
        waktu_selesai,
        prefix_app,
        tahun,
        urutan,
        keterangan,
        created_at,
        updated_at
    `;

    static joinTables = '';
    static countColumns = 'COUNT(*)';
    static orderBy = 'ORDER BY tahun DESC, waktu_mulai DESC, urutan ASC';

    static columns = [
        'nama',
        'waktu_mulai',
        'waktu_selesai',
        'prefix_app',
        'tahun',
        'urutan',
        'keterangan'
    ];

    static allowedFields = [
        'id'
    ];

    /* =======================
     * API YANG DIPAKAI SERVICE
     * ======================= */

    /**
     * cari berdasarkan id
     */
    static async findById(conn, id) {
        return super.findByKey(conn, 'id', id);
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

    /**
     * Insert baru
     */
    static async insert(conn, data) {
        return super.insert(conn, data);
    }

    /**
     * Update data
     */
    static async update(conn, id, data) {
        return super.updateByKey(conn, 'id', id, data);
    }

    /**
     * Delete data
     */
    static async deleteById(conn, id) {
        return super.deleteByKey(conn, 'id', id);
    }

    /* =======================
     * METHOD KHUSUS 
     * ======================= */

    /**
     * Ambil urutan terakhir per tahun
     */
    static async findUrutan(conn, tahun) {
        const [[row]] = await conn.query(
            `SELECT MAX(urutan) AS last
                FROM ${this.tableName}
                WHERE tahun = ?`,
            [tahun]
        );

        return (row.last || 0) + 1;
    }
}

module.exports = SeleksiModel;
