// app/models/DomainSoalModel.js
const BaseModel = require('./BaseModel');

class DomainSoalModel extends BaseModel {

    /* =======================
     * CONFIG (TETAP SAMA)
     * ======================= */
    static tableName = 'domain_soals';
    static tableAlias = '';
    static selectFields = `id,kode,domain,created_at,updated_at`;
    static joinTables = ``;
    static countColumns = `COUNT(id)`;
    static orderBy = `ORDER BY kode ASC, domain DESC`;

    static columns = [
        'kode',
        'domain'
    ];

    // untuk guard BaseModel
    static allowedFields = ['id'];

    /* =======================
     * FIND
     * ======================= */

    // sama dengan findByKey lama (WHERE id = ?)
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

module.exports = DomainSoalModel;