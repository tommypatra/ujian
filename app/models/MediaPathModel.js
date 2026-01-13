// app/models/MediaPathModel.js
const { buildInsert, buildUpdate } = require('../helpers/sqlHelper');

class MediaPathModel {
    //setup tabel
    static tableName = 'media_paths';
    static tableAlias = 'mp';
    static selectFields = `
        mp.id, mp.judul, mp.path, mp.jenis, mp.created_at, mp.updated_at,
    `;    
    static joinTables = ``;
    static countColumns = `COUNT(DISTINCT mp.id)`;
    static orderBy = `ORDER BY mp.jenis DESC, mp.judul DESC`;

    static columns = [
        'judul', 'path' ,'jenis'
    ];

    /**
     * helper internal pencarian berdasarkan field dan value
     */
    static async findByKey(conn, field, value) {
        const allowedFields = ['mp.id'];

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
     * helper internal pencarian berdasarkan field dan value
     */
    static async findAllByKey(conn, field, values) {
        const allowedFields = ['mp.id'];
        if (!values.length) return [];

        if (!allowedFields.includes(field)) {
            throw new Error('Field tidak diizinkan');
        }

        const placeholders = values.map(() => '?').join(',');

        const [rows] = await conn.query(
            `SELECT ${this.selectFields}
            FROM ${this.tableName} ${this.tableAlias}
            ${this.joinTables}
            WHERE ${field} IN (${placeholders})
            ${this.orderBy}`,values);

        return rows;
    }

    /**
     * cari berdasarkan id
     */
    static async findById(conn, id) {
        return this.findByKey(conn, 'mp.id', id);
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
        const insert = buildInsert(data, this.columns);

        const [result] = await conn.query(`
            INSERT INTO ${this.tableName} (${insert.columns})
            VALUES (${insert.placeholders})
            `,
            insert.values
        );

        return result.insertId;
    }

    /**
     * Update data
     */
    static async update(conn, id, data) {
        const update = buildUpdate(data, this.columns);
        if (!update) return 0;

        update.values.push(id);

        const [result] = await conn.query(`UPDATE ${this.tableName}
            SET ${update.setClause} WHERE id = ?`,
            update.values
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

module.exports = MediaPathModel;