// app/models/UserModel.js

class UserModel {
    //setup tabel
    static tableName = `users`;
    static tableAlias = ``;
    static selectFields = `id,name,email,created_at,updated_at`;    
    static selectAuthFields = `id,name,email,password,created_at,updated_at`;    
    static joinTables = ``;
    static countColumns = `COUNT(*)`;
    static orderBy = `ORDER BY name ASC`;
    static insertColumns = `name,email,password,created_at`;
    static insertValues  = `?,?,?,?`;
    /**
     * helper internal pencarian berdasarkan field dan value
     */
    static async findByKey(conn, field, value) {
        const allowedFields = ['id','name','email'];

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
     * cari berdasarkan email
     */
    static async findByEmail(conn, email) {
        const [[row]] = await conn.query(
            `SELECT ${this.selectAuthFields} FROM ${this.tableName} WHERE email = ?`,
            [email]
        );
        return row || null;
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
                data.name,
                data.email,
                data.password,
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

        if (data.name !== undefined) {
            fields.push('name = ?');
            values.push(data.name);
        }

        if (data.email !== undefined) {
            fields.push('email = ?');
            values.push(data.email);
        }

        if (data.password !== undefined) {
            fields.push('password = ?');
            values.push(data.password);
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

module.exports = UserModel;