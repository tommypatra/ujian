// app/models/MediaPathModel.js
const BaseModel = require('./BaseModel');

class MediaPathModel extends BaseModel {

    /* =======================
     * CONFIG (TETAP)
     * ======================= */
    static tableName = 'media_paths';
    static tableAlias = '';

    static selectFields = `
        id, judul, path, jenis, created_at, updated_at
    `;

    static joinTables = ``;
    static countColumns = `COUNT(DISTINCT id)`;
    static orderBy = `ORDER BY jenis DESC, judul DESC`;

    static columns = [
        'judul',
        'path',
        'jenis'
    ];

    // untuk guard BaseModel
    static allowedFields = ['id'];

    /* =======================
     * FIND
     * ======================= */

    // identik dengan findByKey lama (WHERE id = ?)
    static async findById(conn, id) {
        return super.findByKey(conn, 'id', id);
    }

    /* =======================
     * FIND MANY BY KEY
     * ======================= */
    static async findAllByIds(conn, ids = []) {
        // wrapper aman → tetap pakai logic BaseModel
        return super.findAllByKey(conn, 'id', ids);
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

module.exports = MediaPathModel;
