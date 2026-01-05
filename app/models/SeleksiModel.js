// app/models/SeleksiModel.js
const { buildInsert, buildUpdate } = require('../helpers/sqlHelper');

class SeleksiModel {
    //setup tabel
    static tableName = `seleksis`;
    static tableAlias = ``;
    static selectFields = `id,nama, waktu_mulai, waktu_selesai, prefix_app, tahun, urutan, keterangan ,created_at,updated_at`;
    static joinTables = ``;
    static countColumns = `COUNT(*)`;
    static orderBy = `ORDER BY tahun DESC, waktu_mulai DESC, urutan ASC`;

    static columns = [
        'nama', 
        'waktu_mulai', 
        'waktu_selesai', 
        'prefix_app', 
        'tahun',
        'urutan',
        'keterangan'
    ];

    /**
     * helper internal pencarian berdasarkan field dan value
     */
    static async findByKey(conn, field, value) {
        const allowedFields = ['id'];

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

    static async findUrutan(conn,tahun) {
        const [[row]] = await conn.query(
            `SELECT MAX(urutan) AS last
            FROM seleksis
            WHERE tahun = ?`,
            [tahun]
        );
        return (row.last || 0) + 1;
    }

    /**
     * cari berdasarkan id
     */
    static async findById(conn, id) {
        return this.findByKey(conn, 'id', id);
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
}

module.exports = SeleksiModel;