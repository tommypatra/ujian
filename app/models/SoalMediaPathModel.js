// app/models/SoalMediaPathModel.js
const BaseModel = require('./BaseModel');

class SoalMediaPathModel extends BaseModel {

    /* =======================
     * CONFIG (TETAP)
     * ======================= */
    static tableName = 'soal_media_paths';
    static tableAlias = 'sm';

    static selectFields = `
        sm.id,
        sm.bank_soal_id,
        sm.media_path_id,
        sm.created_at,
        sm.updated_at,
        mp.judul,
        mp.path,
        mp.jenis
    `;

    static joinTables = `
        LEFT JOIN media_paths mp ON mp.id = sm.media_path_id
    `;

    static countColumns = `COUNT(DISTINCT sm.id)`;
    static orderBy = `ORDER BY mp.jenis, mp.judul`;

    static columns = [
        'bank_soal_id',
        'media_path_id'
    ];

    // ⬇️ PENTING: disesuaikan dengan field lama
    static allowedFields = [
        'sm.id',
        'sm.media_path_id',
        'sm.bank_soal_id'
    ];

    /* =======================
     * FIND (SINGLE)
     * ======================= */

    // WHERE sm.id = ?
    static async findById(conn, id) {
        return super.findByKey(conn, 'sm.id', id);
    }

    // WHERE sm.media_path_id = ?
    static async findByMediaPathId(conn, media_path_id) {
        return super.findByKey(conn, 'sm.media_path_id', media_path_id);
    }

    /* =======================
     * FIND MANY (WHERE IN)
     * ======================= */

    // WHERE sm.bank_soal_id IN (?,?,?)
    static async findAllByBankSoalId(conn, bank_soal_ids = []) {
        return super.findAllByKey(conn, 'sm.bank_soal_id', bank_soal_ids);
    }

    /* =======================
     * FIND ALL (PAGING)
     * ======================= */
    static async findAll(conn, whereSql = '', params = [], limit = 10, offset = 0) {
        return super.findAll(conn, whereSql, params, limit, offset);
    }

    /* =======================
     * COUNT
     * ======================= */
    static async countAll(conn, whereSql = '', params = []) {
        return super.countAll(conn, whereSql, params);
    }

    /* =======================
     * INSERT
     * ======================= */
    static async insert(conn, data) {
        return super.insert(conn, data);
    }

    /* =======================
     * UPDATE
     * ======================= */
    static async update(conn, id, data) {
        return super.updateByKey(conn, 'id', id, data);
    }

    /* =======================
     * DELETE
     * ======================= */
    static async deleteById(conn, id) {
        return super.deleteByKey(conn, 'id', id);
    }
}

module.exports = SoalMediaPathModel;
