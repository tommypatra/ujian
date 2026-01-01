// app/models/PengelolaSeleksiModel.js

class PengelolaSeleksiModel {
    //setup tabel
    static tableName = 'pengelola_seleksis';
    static tableAlias = 'ps';
    static selectFields = `
        ps.id,
        ps.user_id,
        ps.seleksi_id,
        u.name as nama_user,
        s.nama as nama_seleksi,
        ps.jabatan,
        ps.created_at,
        ps.updated_at
    `;    
    static joinTables = `        
        LEFT JOIN users u ON u.id = ps.user_id
        LEFT JOIN seleksis s ON s.id = ps.seleksi_id
    `;
    static countColumns = `COUNT(DISTINCT ps.id)`;
    static orderBy = `ORDER BY s.waktu_mulai DESC, ps.jabatan ASC, u.name ASC`;
    static insertColumns = `user_id, seleksi_id, created_at`;
    static insertValues  = `?, ?, ?`;
    /**
     * helper internal pencarian berdasarkan field dan value
     */
    static async findByKey(conn, field, value) {
        const allowedFields = ['ps.id','ps.user_id','ps.seleksi_id'];

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
        return this.findByKey(conn, 'ps.id', id);
    }


    /**
     * cari berdasarkan id
     */
    static async findAllByUserId(conn, user_id) {
        const [rows] = await conn.query(
            `SELECT ${this.selectFields} FROM ${this.tableName} ${this.tableAlias} ${this.joinTables}            
            WHERE ps.user_id = ?`,
            [user_id]
        );

        return rows;
    }

    /**
     * cari berdasarkan id
     */
    static async findAllBySeleksiId(conn, seleksi_id) {
        const [rows] = await conn.query(
            `SELECT ${this.selectFields} FROM ${this.tableName} ${this.tableAlias} ${this.joinTables}            
            WHERE ps.seleksi_id = ?`,
            [seleksi_id]
        );

        return rows;
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
                data.seleksi_id,
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

        if (data.seleksi_id !== undefined) {
            fields.push('seleksi_id = ?');
            values.push(data.seleksi_id);
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

    static async deleteBySeleksiId(conn, seleksiId) {
        const [result] = await conn.query(
            `DELETE FROM ${this.tableName} WHERE seleksi_id = ?`,
            [seleksiId]
        );
        return result.affectedRows;
    }
}

module.exports = PengelolaSeleksiModel;