// app/models/JenisSoalModel.js
const BaseModel = require('./BaseModel');

class JenisSoalModel extends BaseModel {

    /* =======================
     * CONFIG (TETAP)
     * ======================= */
    static tableName = 'jenis_soals';
    static tableAlias = '';
    static selectFields = `id,kode,jenis,created_at,updated_at`;    
    static joinTables = ``;
    static countColumns = `COUNT(id)`;
    static orderBy = `ORDER BY kode ASC, jenis DESC`;

    static columns = [
        'kode',
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

module.exports = JenisSoalModel;
