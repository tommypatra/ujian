// app/models/UserRoleModel.js

class UserRoleModel {
    //setup tabel
    static tableName = 'user_roles';
    static tableAlias = 'ur';
    static selectFields = `
        ur.id,
        ur.user_id,
        ur.role_id,
        u.name AS user_name,
        r.role AS role_name,
        ur.created_at,
        ur.updated_at
    `;    
    static joinTables = `        
        LEFT JOIN users u ON u.id = ur.user_id
        LEFT JOIN roles r ON r.id = ur.role_id
    `;
    static countColumns = `COUNT(DISTINCT ur.id)`;
    static orderBy = `ORDER BY u.name ASC, r.role ASC`;
    static insertColumns = `user_id, role_id, created_at`;
    static insertValues  = `?, ?, ?`;
    /**
     * helper internal pencarian berdasarkan field dan value
     */
    static async findByKey(conn, field, value) {
        const allowedFields = ['ur.id','ur.user_id'];

        if (!allowedFields.includes(field)) {
            throw new Error('Field tidak diizinkan');
        }

        const [[row]] = await conn.query(
            `SELECT ${this.selectFields} FROM ${this.tableName} ${this.tableAlias} ${this.joinTables}            
            WHERE ${field} = ?`,
            [value]
        );

        return row || null;
    }

    /**
     * cari berdasarkan id
     */
    static async findById(conn, id) {
        return this.findByKey(conn, 'ur.id', id);
    }


    /**
     * cari berdasarkan id
     */
    static async findAllByUserId(conn, user_id) {
        const [rows] = await conn.query(
            `SELECT ${this.selectFields} FROM ${this.tableName} ${this.tableAlias} ${this.joinTables}            
            WHERE ur.user_id = ?`,
            [user_id]
        );

        return rows.map(r => r.role_name);
    }

    
    /**
     * Ambil data (paged)
     */
    static async findAll(conn, whereSql = '', params = [], limit = 10, offset = 0) {
        const [rows] = await conn.query(
            `SELECT ${this.selectFields} FROM ${this.tableName} ${this.tableAlias} ${this.joinTables}            
            ${whereSql}
            ${this.orderBy} LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        return rows;
    }

    /**
     * Hitung total (untuk pagination)
     */
    static async countAll(conn, whereSql = '', params = []) {
        const [[row]] = await conn.query(
            `SELECT ${this.countColumns} AS total FROM ${this.tableName} ${this.tableAlias} ${this.joinTables}
            ${whereSql}`,
            params
        );

        return row.total;
    }

    /**
     * Insert baru
     */
    static async insert(conn, data) {
        const [result] = await conn.query(
            `
            INSERT INTO ${this.tableName} (${this.insertColumns})
            VALUES (${this.insertValues})
            `,
            [
                data.user_id,
                data.role_id,
                data.created_at
            ]
        );

        return result.insertId;
    }

    /**
     * Update data
     */
    static async update(conn, id, data) {
        const fields = [];
        const values = [];

        if (data.user_id !== undefined) {
            fields.push('user_id = ?');
            values.push(data.user_id);
        }

        if (data.role_id !== undefined) {
            fields.push('role_id = ?');
            values.push(data.role_id);
        }

        if (fields.length === 0) {
            return 0; // tidak ada yang diupdate
        }

        fields.push('updated_at = ?');
        values.push(new Date());

        values.push(id);

        const [result] = await conn.query(
            `
            UPDATE ${this.tableName}
            SET ${fields.join(', ')}
            WHERE id = ?
            `,
            values
        );

        return result.affectedRows;
    }

    /**
     * Delete data
     */
    static async deleteById(conn, id) {
        const [result] = await conn.query(
            `
            DELETE FROM ${this.tableName}
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows;
    }

    static async deleteByUserId(conn, userId) {
        const [result] = await conn.query(
            `DELETE FROM ${this.tableName} WHERE user_id = ?`,
            [userId]
        );
        return result.affectedRows;
    }

}

module.exports = UserRoleModel;