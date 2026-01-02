// app/models/PengelolaSeleksiModel.js
const { buildInsert, buildUpdate } = require('../helpers/sqlHelper');

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

    static columns = [
        'user_id',
        'seleksi_id',
    ];

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

    static async deleteBySeleksiId(conn, seleksiId) {
        const [result] = await conn.query(
            `DELETE FROM ${this.tableName} WHERE seleksi_id = ?`,
            [seleksiId]
        );
        return result.affectedRows;
    }
}

module.exports = PengelolaSeleksiModel;