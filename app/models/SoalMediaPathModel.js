// app/models/SoalMediaPathModel.js
const { buildInsert, buildUpdate } = require('../helpers/sqlHelper');

class SoalMediaPathModel {
    //setup tabel
    static tableName = 'soal_media_paths';
    static tableAlias = 'sm';
    static selectFields = `
        sm.id, sm.bank_soal_id, sm.media_path_id, sm.created_at, sm.updated_at,
        mp.judul, mp.path, mp.jenis
    `;    
    static joinTables = `        
        LEFT JOIN media_paths mp ON mp.id = sm.media_path_id
    `;
    static countColumns = `COUNT(DISTINCT sm.id)`;
    static orderBy = `ORDER BY mp.jenis, mp.judul`;

    static columns = [
        'bank_soal_id', 'media_path_id' 
    ];

    /**
     * helper internal pencarian berdasarkan field dan value
     */
    static async findByKey(conn, field, value) {
        const allowedFields = ['sm.id','sm.media_path_id'];

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
        const allowedFields = ['sm.bank_soal_id'];
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
        return this.findByKey(conn, 'sm.id', id);
    }

    /**
     * cari berdasarkan bank_soal_id
     */
    static async findAllByBankSoalId(conn, bank_soal_ids) {
        return this.findAllByKey(conn, 'sm.bank_soal_id', bank_soal_ids);
    }
    
        /**
     * cari berdasarkan media_path_id
     */
    static async findByMediaPathId(conn, media_path_id) {
        return this.findByKey(conn, 'sm.media_path_id', media_path_id);
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
        try {
            const insert = buildInsert(data, this.columns);
            const [result] = await conn.query(
                `INSERT INTO ${this.tableName} (${insert.columns})
                VALUES (${insert.placeholders})`,
                insert.values
            );
            return result.insertId;
        } catch (err) {
            throw mapDbError(err);
        }
    }

    /**
     * Update data
     */
    static async update(conn, id, data) {
        const update = buildUpdate(data, this.columns);
        if (!update) return 0;

        update.values.push(id);

        try {
            const [result] = await conn.query(
                `UPDATE ${this.tableName}
                SET ${update.setClause}
                WHERE id = ?`,
                update.values
            );

            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }
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

module.exports = SoalMediaPathModel;