// app/models/PengelolaSeleksiModel.js
const BaseModel = require('./BaseModel');

class PengelolaSeleksiModel extends BaseModel {

    /* =======================
     * TABLE CONFIG
     * ======================= */
    static tableName = 'pengelola_seleksis';
    static tableAlias = 'ps';

    static selectFields = `
        ps.id,
        ps.user_id,
        ps.seleksi_id,
        u.name AS nama_user,
        s.nama AS nama_seleksi,
        ps.jabatan,
        ps.created_at,
        ps.updated_at
    `;

    static joinTables = `
        LEFT JOIN users u ON u.id = ps.user_id
        LEFT JOIN seleksis s ON s.id = ps.seleksi_id
    `;

    static countColumns = 'COUNT(DISTINCT ps.id)';
    static orderBy = `
        ORDER BY
            s.tahun DESC,
            s.waktu_mulai DESC,
            ps.jabatan ASC,
            u.name ASC
    `;

    static columns = [
        'user_id',
        'jabatan',
        'seleksi_id'
    ];

    static allowedFields = [
        'ps.id',
        'ps.user_id',
        'ps.seleksi_id'
    ];

    /* =======================
     * API YANG DIPAKAI SERVICE
     * ======================= */

    /**
     * cari berdasarkan id
     */
    static async findById(conn, id) {
        return super.findByKey(conn, 'ps.id', id);
    }

    /**
     * cari semua berdasarkan user_id
     */
    static async findAllByUserId(conn, user_id) {
        return super.findAllByKey(
            conn,
            'ps.user_id',
            [user_id]
        );
    }

    /**
     * cari semua berdasarkan seleksi_id
     */
    static async findAllBySeleksiId(conn, seleksi_id) {
        return super.findAllByKey(
            conn,
            'ps.seleksi_id',
            [seleksi_id]
        );
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
    static async deleteById(conn, id, seleksi_id) {
        return super.deleteByKeys(conn, ['id','seleksi_id'], [id,seleksi_id]);
    }

    static async deleteByUserId(conn, userId,seleksi_id) {
        return super.deleteByKey(conn, ['user_id','seleksi_id'], [userId,seleksi_id]);
    }

    static async deleteBySeleksiId(conn, seleksi_id) {
        return super.deleteByKey(conn, 'seleksi_id', seleksi_id);
    }
}

module.exports = PengelolaSeleksiModel;
