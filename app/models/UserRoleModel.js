// app/models/UserRoleModel.js
const BaseModel = require('./BaseModel');

class UserRoleModel extends BaseModel {

    /* =======================
     * CONFIG
     * ======================= */
    static tableName = 'user_roles';
    static tableAlias = 'ur';

    static selectFields = `
        ur.id,
        ur.user_id,
        ur.role_id,
        u.name AS user_name,
        r.role AS role_name,
        u.email,
        ur.created_at,
        ur.updated_at
    `;

    static joinTables = `
        LEFT JOIN users u ON u.id = ur.user_id
        LEFT JOIN roles r ON r.id = ur.role_id
    `;

    static countColumns = 'COUNT(DISTINCT ur.id)';
    static orderBy = 'ORDER BY u.name ASC, r.role ASC';

    static columns = [
        'user_id',
        'role_id'
    ];

    static allowedFields = [
        'ur.id',
        'ur.user_id'
    ];

    /* =======================
     * API YANG DIPAKAI SERVICE
     * ======================= */

    static async findById(conn, id) {
        return super.findByKey(conn, 'ur.id', id);
    }

    /**
     * cari berdasarkan banyakuserid
     */
    static async findAllByUserIds(conn, user_ids) {
        return this.findAllByKey(conn, 'ur.user_id', user_ids);
    }    

    static async findAllByUserId(conn, user_id) {
        const rows = await super.findAllByKey(
            conn,
            'ur.user_id',
            [user_id]
        );

        return rows.map(r => r.role_name);
    }

    static async findAll(conn, whereSql = '', params = [], limit = 10, offset = 0) {
        return super.findAll(conn, whereSql, params, limit, offset);
    }

    static async countAll(conn, whereSql = '', params = []) {
        return super.countAll(conn, whereSql, params);
    }

    static async insert(conn, data) {
        return super.insert(conn, data);
    }

    static async update(conn, id, data) {
        return super.updateByKey(conn, 'id', id, data);
    }

    static async deleteById(conn, id) {
        return super.deleteByKey(conn, 'id', id);
    }

    static async deleteByUserId(conn, userId) {
        return super.deleteByKey(conn, 'user_id', userId);
    }
}

module.exports = UserRoleModel;
