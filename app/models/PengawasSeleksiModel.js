// app/models/PengawasSeleksiModel.js
const { buildInsert, buildUpdate } = require('../helpers/sqlHelper');

class PengawasSeleksiModel {
    //setup tabel
    static tableName = `pengawas_seleksis`;
    static tableAlias = `ps`;
    static selectFields = `
    ps.id, ps.jadwal_id, ps.nama, ps.user_name, ps.created_at, ps.updated_at,
    js.id, js.seleksi_id, js.sesi, js.tanggal, js.lokasi_ujian, js.jam_mulai, js.jam_selesai, 
    js.status`;
    static joinTables = `
        LEFT JOIN jadwal_seleksis js ON js.id = ps.jadwal_seleksi_id
    `;
    static countColumns = `COUNT(js.id)`;
    static orderBy = `ORDER BY js.seleksi_id ASC, js.sesi ASC, js.tanggal ASC, js.jam_mulai ASC, js.lokasi_ujian, ps.nama`;

    static columns = [
        'jadwal_seleksi_id',
        'nama',
        'user_name',
        'password'
    ];

    /**
     * helper internal pencarian berdasarkan field dan value
     */
    static async findByKey(conn, field, value) {
        const allowedFields = ['js.id','js.sesi'];

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
        return this.findByKey(conn, 'js.id', id);
    }

    /**
     * cari berdasarkan sesi
     */
    static async findBySesi(conn, sesi) {
        return this.findByKey(conn, 'js.sesi', sesi);
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

module.exports = PengawasSeleksiModel;