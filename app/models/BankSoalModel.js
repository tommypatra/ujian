// app/models/BankSoalModel.js
const BaseModel = require('./BaseModel');

class BankSoalModel extends BaseModel {

    /* =======================
     * CONFIG
     * ======================= */
    static tableName = 'bank_soals';
    static tableAlias = 'b';

    static selectFields = `
        b.id, b.jenis_soal_id, b.domain_soal_id, b.tahun, b.pembuat_user_id,
        b.pertanyaan, b.bobot, b.is_aktif, b.created_at, b.updated_at,
        u.name, u.email,
        ds.kode AS kode_domain, ds.domain,
        js.kode AS kode_soal, js.jenis
    `;

    static joinTables = `
        LEFT JOIN users u ON u.id = b.pembuat_user_id
        LEFT JOIN jenis_soals js ON js.id = b.jenis_soal_id
        LEFT JOIN domain_soals ds ON ds.id = b.domain_soal_id
    `;

    static orderBy = `
        ORDER BY
            b.tahun DESC,
            b.domain_soal_id ASC,
            b.jenis_soal_id ASC,
            b.created_at DESC
    `;

    static countColumns = `COUNT(DISTINCT b.id)`;

    static columns = [
        'jenis_soal_id',
        'domain_soal_id',
        'tahun',
        'pembuat_user_id',
        'pertanyaan',
        'bobot',
        'is_aktif'
    ];

    static allowedFields = [
        'b.id',
        'b.jenis_soal_id',
        'b.domain_soal_id',
        'b.tahun',
        'b.pembuat_user_id',
    ];

    static async findAll(conn, whereSql = '', params = [], limit = 10, offset = 0) {
        return super.findAll(conn, whereSql, params, limit, offset);
    }

    static async countAll(conn, whereSql = '', params = []) {
        return super.countAll(conn, whereSql, params);
    }

    static async findById(conn, id) {
        return super.findByKey(conn, 'b.id', id);
    }

    static async insert(conn, data) {
        return super.insert(conn, data);
    }

    static async update(conn, id, pembuat_user_id,data) {
        return super.updateByKeys(conn, ['id','pembuat_user_id'],[id,pembuat_user_id], data);
    }

    static async deleteById(conn, id,pembuat_user_id) {
        return super.deleteByKeys(
            conn,
            ['id', 'pembuat_user_id'],
            [id, pembuat_user_id]
        );
    }

    static async deleteByUserId(conn, pembuat_user_id) {
        return super.deleteByKey(conn, 'pembuat_user_id', pembuat_user_id);
    }
}

module.exports = BankSoalModel;
