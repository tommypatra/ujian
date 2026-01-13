// app/models/RoleModel.js
const BaseModel = require('./BaseModel');

class RoleModel extends BaseModel {

    /* =======================
     * TABLE CONFIG
     * ======================= */
    static tableName = 'roles';
    static tableAlias = '';

    static selectFields = `
        id,
        role,
        created_at,
        updated_at
    `;

    static joinTables = '';
    static countColumns = 'COUNT(*)';
    static orderBy = 'ORDER BY role ASC';

    static columns = [
        'role'
    ];

    static allowedFields = [
        'id',
        'role'
    ];

    /**
     * cari berdasarkan id
     */
    static async findById(conn, id) {
        return super.findByKey(conn, 'id', id);
    }

    /**
     * cari berdasarkan role
     */
    static async findByRole(conn, role) {
        return super.findByKey(conn, 'role', role);
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
}

module.exports = RoleModel;
