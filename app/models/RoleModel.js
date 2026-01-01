// app/models/RoleModel.js

class RoleModel {
    //setup tabel
    static tableName = `roles`;
    static tableAlias = ``;
    static selectFields = `id,role,created_at,updated_at`;    
    static joinTables = ``;
    static countColumns = `COUNT(*)`;
    static orderBy = `ORDER BY role ASC`;
    static insertColumns = `role, created_at`;
    static insertValues  = `?, ?`;
    /**
     * helper internal pencarian berdasarkan field dan value
     */
    static async findByKey(conn, field, value) {
        const allowedFields = ['id','role'];

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
        return this.findByKey(conn, 'id', id);
    }

    /**
     * cari berdasarkan role
     */
    static async findByRole(conn, role) {
        return this.findByKey(conn, 'role', role);
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
                data.role,
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

        if (data.role !== undefined) {
            fields.push('role = ?');
            values.push(data.role);
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
}

module.exports = RoleModel;