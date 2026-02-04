// app/models/BaseModel.js
const { buildInsert, buildUpdate } = require('../helpers/sqlHelper');
const { mapDbError } = require('../helpers/dbErrorHelper');

class BaseModel {

    /* =======================
     * INTERNAL GUARD
     * ======================= */
    static _ensureAllowedFields() {
        if (!Array.isArray(this.allowedFields)) {
            throw new Error(
                `${this.name} belum mendefinisikan static allowedFields`
            );
        }
    }

    static _ensureConfig() {
        if (!this.tableName) {
            throw new Error(`${this.name} belum mendefinisikan tableName`);
        }

        this.tableAlias   = this.tableAlias || '';
        this.joinTables   = this.joinTables || '';
        this.orderBy      = this.orderBy || '';
        this.groupBy      = this.groupBy || '';
        this.selectFields = this.selectFields || '*';
        this.countColumns = this.countColumns || 'COUNT(*)';
    }

    /* =======================
     * FIND ONE
     * ======================= */
    static async findByKey(conn, field, value, options = {}) {
        this._ensureAllowedFields();
        this._ensureConfig();

        if (!this.allowedFields.includes(field)) {
            throw new Error('Field tidak diizinkan');
        }

        const selectFields = Array.isArray(options.select) && options.select.length > 0
            ? options.select.join(', ')
            : this.selectFields;

        const [[row]] = await conn.query(
            `SELECT ${selectFields}
            FROM ${this.tableName}${this.tableAlias ? ' ' + this.tableAlias : ''}
            ${this.joinTables}
            WHERE ${field} = ?
            LIMIT 1`,
            [value]
        );

        return row || null;
    }

    /* =======================
     * FIND MANY BY KEY
     * ======================= */
    static async findAllByKey(conn, field, values = [], options = {}) {
        this._ensureAllowedFields();
        this._ensureConfig();

        if (!Array.isArray(values) || values.length === 0) return [];

        if (!this.allowedFields.includes(field)) {
            throw new Error('Field tidak diizinkan');
        }

        const placeholders = values.map(() => '?').join(',');
        // default order
        let orderSql = this.orderBy;

        // random order
        if (options.random === true) {
            orderSql = `ORDER BY RAND()`;
        }

        const selectFields = Array.isArray(options.select) && options.select.length > 0
            ? options.select.join(', ')
            : this.selectFields;


        const [rows] = await conn.query(
            `SELECT ${selectFields}
            FROM ${this.tableName}${this.tableAlias ? ' ' + this.tableAlias : ''}
                ${this.joinTables}
            WHERE ${field} IN (${placeholders})
            ${orderSql}`,
            values
        );

        return rows;
    }

    /* =======================
     * FIND MANY (PAGING)
     * ======================= */
    static async findAll(
        conn,
        whereSql = '',
        params = [],
        limit = 10,
        offset = 0,
        options = {}
    ) {
        this._ensureConfig();

        const selectFields = Array.isArray(options.select) && options.select.length > 0
            ? options.select.join(', ')
            : this.selectFields;

        const groupBy = this.groupBy
            ? `GROUP BY ${this.groupBy}`
            : '';            

        let sql = `
            SELECT ${selectFields}
            FROM ${this.tableName}${this.tableAlias ? ' ' + this.tableAlias : ''}
            ${this.joinTables}
            ${whereSql}
            ${groupBy}
            ${this.orderBy}
        `;


        const bindings = [...params];

        if (limit > 0) {
            sql += ` LIMIT ? OFFSET ?`;
            bindings.push(limit, offset);
        }

        console.log(sql);

        const [rows] = await conn.query(sql, bindings);
        return rows;
    }

    /* =======================
     * COUNT
     * ======================= */
    static async countAll(conn, whereSql = '', params = []) {
        this._ensureConfig();

        const [[row]] = await conn.query(
            `SELECT ${this.countColumns} AS total
             FROM ${this.tableName}${this.tableAlias ? ' ' + this.tableAlias : ''}
             ${this.joinTables}
             ${whereSql}`,
            params
        );

        return row.total;
    }

    /* =======================
     * INSERT
     * ======================= */
    static async insert(conn, data) {
        this._ensureConfig();

        try {
            const insert = buildInsert(data, this.columns);

            const [result] = await conn.query(
                `INSERT INTO ${this.tableName}
                 (${insert.columns})
                 VALUES (${insert.placeholders})`,
                insert.values
            );

            return result.insertId;
        } catch (err) {
            throw mapDbError(err);
        }
    }

    /* =======================
     * UPDATE (GENERIC)
     * ======================= */
    static async updateByKey(conn, key, value, data) {
        this._ensureConfig();

        const update = buildUpdate(data, this.columns);
        if (!update) return 0;

        update.values.push(value);

        try {
            const [result] = await conn.query(
                `UPDATE ${this.tableName}
                 SET ${update.setClause}
                 WHERE ${key} = ?`,
                update.values
            );

            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }
    }

    /* =======================
    * UPDATE BY MULTIPLE KEYS
    * ======================= */
    static async updateByKeys(conn, fields = [], values = [], data = {}) {
        this._ensureConfig();

        if (!Array.isArray(fields) || !Array.isArray(values)) {
            throw new Error('Fields dan values harus berupa array');
        }

        if (fields.length === 0 || values.length === 0) {
            throw new Error('Fields dan values tidak boleh kosong');
        }

        if (fields.length !== values.length) {
            throw new Error('Jumlah fields dan values harus sama');
        }

        const update = buildUpdate(data, this.columns);
        if (!update) return 0;

        // WHERE id = ? AND seleksi_id = ?
        const whereClause = fields
            .map(field => `${field} = ?`)
            .join(' AND ');

        try {
            const [result] = await conn.query(
                `UPDATE ${this.tableName}
                SET ${update.setClause}
                WHERE ${whereClause}`,
                [...update.values, ...values]
            );

            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }
    }


    /* =======================
     * DELETE
     * ======================= */
    static async deleteByKey(conn, key, value) {
        this._ensureConfig();

        try {
            const [result] = await conn.query(
                `DELETE FROM ${this.tableName}
                WHERE ${key} = ?`,
                [value]
            );

            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }
    }

    /* =======================
    * DELETE BY MULTIPLE KEYS
    * ======================= */
    static async deleteByKeys(conn, fields = [], values = []) {
        this._ensureConfig();

        if (!Array.isArray(fields) || !Array.isArray(values)) {
            throw new Error('Fields dan values harus berupa array');
        }

        if (fields.length === 0 || values.length === 0) {
            throw new Error('Fields dan values tidak boleh kosong');
        }

        if (fields.length !== values.length) {
            throw new Error('Jumlah fields dan values harus sama');
        }

        // contoh: seleksi_id = ? AND id = ?
        const whereClause = fields
            .map(field => `${field} = ?`)
            .join(' AND ');

        try {
            const [result] = await conn.query(
                `DELETE FROM ${this.tableName}
                WHERE ${whereClause}`,
                values
            );

            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }
    }


}

module.exports = BaseModel;
