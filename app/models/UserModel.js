// app/models/UserModel.js
const BaseModel = require('./BaseModel');

class UserModel extends BaseModel {

    /* =======================
     * TABLE CONFIG
     * ======================= */
    static tableName = 'users';
    static tableAlias = 'u';

    static selectFields = `
        u.id,
        u.name,
        u.email,
        u.created_at,
        u.updated_at
    `;

    static selectAuthFields = `
        u.id,
        u.name,
        u.email,
        u.password,
        u.created_at,
        u.updated_at
    `;

    static joinTables = `
        LEFT JOIN user_roles ur ON ur.user_id = u.id
    `;

    
    
    static countColumns = 'COUNT(DISTINCT u.id)';
    static orderBy = 'ORDER BY u.name ASC';
    static groupBy = 'u.id';

    static columns = [
        'name',
        'email',
        'password'
    ];

    static allowedFields = [
        'u.id',
        'u.name',
        'u.email'
    ];

    /* =======================
     * API LAMA (DIPERTAHANKAN)
     * ======================= */

    /**
     * helper internal pencarian berdasarkan field dan value
     */
    static async findByKey(conn, field, value) {
        return super.findByKey(conn, field, value);
    }

    /**
     * cari berdasarkan id
     */
    static async findById(conn, id) {
        return this.findByKey(conn, 'id', id);
    }

    /**
     * cari berdasarkan email (untuk auth)
     * pakai selectAuthFields (password ikut)
     */
    static async findByEmail(conn, email) {
        const [[row]] = await conn.query(
            `SELECT ${this.selectAuthFields}
             FROM ${this.tableName}
             WHERE email = ?
             LIMIT 1`,
            [email]
        );

        return row || null;
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
        // signature lama dipertahankan
        return super.updateByKey(conn, 'id', id, data);
    }

    /**
     * Delete data
     */
    static async deleteById(conn, id) {
        return super.deleteByKey(conn, 'id', id);
    }
}

module.exports = UserModel;